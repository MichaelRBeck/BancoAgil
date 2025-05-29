import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Transaction from "../../../models/Transactions";
import User from "../../../models/User";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();

    const transactionId = context.params.id;
    const { newValue } = await req.json();

    if (typeof newValue !== "number" || isNaN(newValue) || newValue <= 0) {
      return NextResponse.json({ message: "Valor inválido." }, { status: 400 });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ message: "Transação não encontrada." }, { status: 404 });
    }

    const oldValue = transaction.value;
    const difference = newValue - oldValue;

    async function updateUserBalanceByCpfOrId({ userId, cpf, amount }: { userId?: string; cpf?: string; amount: number }) {
      let user;
      if (userId) {
        user = await User.findById(userId);
      } else if (cpf) {
        user = await User.findOne({ cpf });
      }
      if (!user) return;

      user.totalBalance = (user.totalBalance || 0) + amount;
      if (user.totalBalance < 0) user.totalBalance = 0;
      await user.save();
    }

    switch (transaction.type) {
      case "Depósito":
        await updateUserBalanceByCpfOrId({ userId: transaction.userId.toString(), amount: difference });
        break;
      case "Saque":
        await updateUserBalanceByCpfOrId({ userId: transaction.userId.toString(), amount: -difference });
        break;
      case "Transferência":
        if (transaction.cpfOrigin) {
          await updateUserBalanceByCpfOrId({ cpf: transaction.cpfOrigin, amount: -difference });
        }
        if (transaction.cpfDest) {
          await updateUserBalanceByCpfOrId({ cpf: transaction.cpfDest, amount: difference });
        }
        break;
    }

    transaction.value = newValue;
    await transaction.save();

    return NextResponse.json({ message: "Transação e saldos atualizados com sucesso." });

  } catch (error) {
    console.error("Erro ao editar transação:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();

    const transactionId = context.params.id;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ message: "Transação não encontrada." }, { status: 404 });
    }

    const value = transaction.value;

    async function updateUserBalanceByCpfOrId({ userId, cpf, amount }: { userId?: string; cpf?: string; amount: number }) {
      let user;
      if (userId) {
        user = await User.findById(userId);
      } else if (cpf) {
        user = await User.findOne({ cpf });
      }
      if (!user) return;

      user.totalBalance = (user.totalBalance || 0) + amount;
      if (user.totalBalance < 0) user.totalBalance = 0;
      await user.save();
    }

    switch (transaction.type) {
      case "Depósito":
        // Remove o depósito, então subtrai o valor do saldo do usuário
        await updateUserBalanceByCpfOrId({ userId: transaction.userId.toString(), amount: -value });
        break;
      case "Saque":
        // Remove o saque, então adiciona o valor de volta no saldo do usuário
        await updateUserBalanceByCpfOrId({ userId: transaction.userId.toString(), amount: value });
        break;
      case "Transferência":
        // Para transferências, desfaz a transferência
        if (transaction.cpfOrigin) {
          await updateUserBalanceByCpfOrId({ cpf: transaction.cpfOrigin, amount: value });
        }
        if (transaction.cpfDest) {
          await updateUserBalanceByCpfOrId({ cpf: transaction.cpfDest, amount: -value });
        }
        break;
    }

    await transaction.deleteOne();

    return NextResponse.json({ message: "Transação excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}