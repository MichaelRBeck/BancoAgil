import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";
import Transaction from "@/app/models/Transactions";
import User from "@/app/models/User";

// Atualiza o valor de uma transação e ajusta os saldos dos usuários envolvidos
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongoDB();

    // aguardar params para acessar o id
    const { id: transactionId } = await context.params;
    const { newValue } = await req.json();

    // Validação básica do novo valor
    if (typeof newValue !== "number" || isNaN(newValue) || newValue <= 0) {
      return NextResponse.json({ message: "Valor inválido." }, { status: 400 });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ message: "Transação não encontrada." }, { status: 404 });
    }

    const oldValue = transaction.value;
    const diff = newValue - oldValue;

    async function updateUserBalanceByCpfOrId({
      userId,
      cpf,
      amount,
    }: {
      userId?: string;
      cpf?: string;
      amount: number;
    }) {
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
        await updateUserBalanceByCpfOrId({
          userId: transaction.userId.toString(),
          amount: diff,
        });
        break;
      case "Saque":
        await updateUserBalanceByCpfOrId({
          userId: transaction.userId.toString(),
          amount: -diff,
        });
        break;
      case "Transferência":
        if (transaction.cpfOrigin) {
          await updateUserBalanceByCpfOrId({
            cpf: transaction.cpfOrigin,
            amount: -diff,
          });
        }
        if (transaction.cpfDest) {
          await updateUserBalanceByCpfOrId({
            cpf: transaction.cpfDest,
            amount: diff,
          });
        }
        break;
      default:
        return NextResponse.json(
          { message: "Tipo de transação inválido." },
          { status: 400 }
        );
    }

    transaction.value = newValue;
    await transaction.save();

    return NextResponse.json(
      { message: "Transação atualizada com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao editar transação:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar transação." },
      { status: 500 }
    );
  }
}


// Deleta uma transação e ajusta os saldos dos usuários envolvidos
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params agora é uma Promise
) {
  try {
    // primeiro await para o params
    const { id: transactionId } = await context.params;

    await connectMongoDB();

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        { message: "Transação não encontrada." },
        { status: 404 }
      );
    }

    const value = transaction.value;

    async function updateUserBalanceByCpfOrId({
      userId,
      cpf,
      amount,
    }: {
      userId?: string;
      cpf?: string;
      amount: number;
    }) {
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
        await updateUserBalanceByCpfOrId({
          userId: transaction.userId.toString(),
          amount: -value,
        });
        break;
      case "Saque":
        await updateUserBalanceByCpfOrId({
          userId: transaction.userId.toString(),
          amount: value,
        });
        break;
      case "Transferência":
        if (transaction.cpfOrigin) {
          await updateUserBalanceByCpfOrId({
            cpf: transaction.cpfOrigin,
            amount: value,
          });
        }
        if (transaction.cpfDest) {
          await updateUserBalanceByCpfOrId({
            cpf: transaction.cpfDest,
            amount: -value,
          });
        }
        break;
      default:
        return NextResponse.json(
          { message: "Tipo de transação inválido." },
          { status: 400 }
        );
    }

    await transaction.deleteOne();

    return NextResponse.json(
      { message: "Transação excluída com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    return NextResponse.json(
      { message: "Erro ao excluir transação." },
      { status: 500 }
    );
  }
}