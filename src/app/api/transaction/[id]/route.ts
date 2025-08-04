import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/app/lib/mongodb";
import Transaction from "@/app/models/Transactions";
import User from "@/app/models/User";

mongoose.set("strictQuery", false);

const VALID_TRANSACTION_TYPES = ["Saque", "Depósito", "Transferência"] as const;

async function updateUserBalanceByCpfOrId({
  userId,
  cpf,
  amount,
}: {
  userId?: string;
  cpf?: string;
  amount: number;
}) {
  const user = userId
    ? await User.findById(userId)
    : cpf
    ? await User.findOne({ cpf })
    : null;

  if (!user) throw new Error("Usuário não encontrado");

  user.totalBalance = Math.max((user.totalBalance || 0) + amount, 0);
  await user.save();
}

export async function PUT(
  req: NextRequest,
  context: any
) {
  try {
    await connectMongoDB();

    const { id } = context.params as { id: string };
    const { value } = await req.json();

    if (typeof value !== "number" || isNaN(value) || value <= 0) {
      return NextResponse.json({ message: "Valor inválido." }, { status: 400 });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return NextResponse.json({ message: "Transação não encontrada." }, { status: 404 });
    }

    if (!VALID_TRANSACTION_TYPES.includes(transaction.type as any)) {
      return NextResponse.json({ message: "Tipo de transação inválido." }, { status: 400 });
    }

    const diff = value - transaction.value;

    switch (transaction.type) {
      case "Depósito":
        await updateUserBalanceByCpfOrId({ userId: transaction.userId?.toString(), amount: diff });
        break;
      case "Saque":
        await updateUserBalanceByCpfOrId({ userId: transaction.userId?.toString(), amount: -diff });
        break;
      case "Transferência":
        if (transaction.cpfOrigin) {
          await updateUserBalanceByCpfOrId({ cpf: transaction.cpfOrigin, amount: -diff });
        }
        if (transaction.cpfDest) {
          await updateUserBalanceByCpfOrId({ cpf: transaction.cpfDest, amount: diff });
        }
        break;
    }

    transaction.value = value;
    await transaction.save();

    return NextResponse.json(
      { message: "Transação atualizada com sucesso.", transaction },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Erro ao atualizar transação:", error.message);
    return NextResponse.json(
      { message: "Erro ao atualizar transação.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  console.log("🧠 Entrando no handler DELETE /api/transaction/[id]");
  try {
    await connectMongoDB();

    const { id } = context.params as { id: string };
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      console.log("❌ Transação não encontrada no MongoDB.");
      return NextResponse.json({ message: "Transação não encontrada." }, { status: 404 });
    }

    if (!VALID_TRANSACTION_TYPES.includes(transaction.type as any)) {
      return NextResponse.json({ message: "Tipo de transação inválido." }, { status: 400 });
    }

    const value = transaction.value;

    switch (transaction.type) {
      case "Depósito":
        await updateUserBalanceByCpfOrId({ userId: transaction.userId?.toString(), amount: -value });
        break;
      case "Saque":
        await updateUserBalanceByCpfOrId({ userId: transaction.userId?.toString(), amount: value });
        break;
      case "Transferência":
        if (transaction.cpfOrigin) {
          await updateUserBalanceByCpfOrId({ cpf: transaction.cpfOrigin, amount: value });
        }
        if (transaction.cpfDest) {
          await updateUserBalanceByCpfOrId({ cpf: transaction.cpfDest, amount: -value });
        }
        break;
    }

    await transaction.deleteOne();

    return NextResponse.json({ message: "Transação excluída com sucesso." }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Erro ao excluir transação:", error.message);
    return NextResponse.json(
      { message: "Erro ao excluir transação.", error: error.message },
      { status: 500 }
    );
  }
}
