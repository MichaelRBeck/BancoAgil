import { NextRequest, NextResponse } from 'next/server';
import Transaction from '@/app/models/Transactions';
import User from '@/app/models/User';
import connectMongoDB from '@/app/lib/mongodb';

const VALID_TRANSACTION_TYPES = ['Saque', 'Depósito', 'Transferência'] as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  if (!userId) {
    return NextResponse.json({ error: 'User ID obrigatório' }, { status: 400 });
  }

  if (type && !VALID_TRANSACTION_TYPES.includes(type as any)) {
    return NextResponse.json({ error: 'Tipo de transação inválido' }, { status: 400 });
  }

  try {
    await connectMongoDB();

    const filter: any = { userId };

    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { cpfOrigin: { $regex: search, $options: 'i' } },
        { cpfDest: { $regex: search, $options: 'i' } },
      ];
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const enriched = await Promise.all(
      transactions.map(async (tx) => {
        const txObj = tx.toObject();

        const [originUser, destUser] = await Promise.all([
          txObj.cpfOrigin ? User.findOne({ cpf: txObj.cpfOrigin }) : null,
          txObj.cpfDest ? User.findOne({ cpf: txObj.cpfDest }) : null,
        ]);

        return {
          ...txObj,
          nameOrigin: originUser?.fullName || '',
          nameDest: destUser?.fullName || '',
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Erro no GET /transaction:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectMongoDB();
    const { id, value, attachment, attachmentName } = await req.json();

    if (!id || value == null) {
      return NextResponse.json({ message: 'ID ou valor ausente.' }, { status: 400 });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return NextResponse.json({ message: 'Transação não encontrada.' }, { status: 404 });
    }

    const user = await User.findById(transaction.userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    const oldValue = transaction.value;
    const diff = value - oldValue;

    // Se valor não mudou e só queremos limpar anexo
    const onlyAttachmentChanged = oldValue === value;

    // Validar saldo antes de permitir alteração
    if (transaction.type === 'Saque' || transaction.type === 'Transferência') {
      const saldoDisponivel = user.totalBalance;

      // Se o novo valor implica maior débito do que antes, validar saldo
      if (diff > 0 && saldoDisponivel < diff) {
        return NextResponse.json(
          { message: 'Saldo insuficiente para essa atualização.' },
          { status: 400 }
        );
      }
    }

    // Atualizar saldos conforme diferença de valor
    if (transaction.type === 'Saque') {
      await User.findByIdAndUpdate(transaction.userId, { $inc: { totalBalance: -diff } });
    } else if (transaction.type === 'Depósito') {
      await User.findByIdAndUpdate(transaction.userId, { $inc: { totalBalance: diff } });
    } else if (transaction.type === 'Transferência') {
      const remetente = await User.findById(transaction.userId);
      const destinatario = await User.findOne({ cpf: transaction.cpfDest });

      if (!destinatario) {
        return NextResponse.json({ message: 'Destinatário não encontrado.' }, { status: 404 });
      }

      await User.findByIdAndUpdate(remetente._id, { $inc: { totalBalance: -diff } });
      await User.findByIdAndUpdate(destinatario._id, { $inc: { totalBalance: diff } });
    }

    // Atualizar transação
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        value,
        attachment: attachment || '',
        attachmentName: attachmentName || '',
      },
      { new: true }
    );

    const updatedUser = await User.findById(transaction.userId);

    return NextResponse.json({
      transaction: updatedTransaction,
      newBalance: updatedUser?.totalBalance ?? 0,
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json({ message: 'Erro ao atualizar transação.' }, { status: 500 });
  }
}



export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const body = await req.json();

    const {
      userId,
      type,
      value,
      cpfOrigin,
      nameOrigin,
      cpfDest,
      nameDest,
      attachment,
      attachmentName,
    } = body;

    if (!userId || !type || value == null) {
      return NextResponse.json({ message: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    if (attachment && attachment.length > 1_400_000) {
      return NextResponse.json({ message: 'Anexo excede 1MB.' }, { status: 413 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    // 🧠 Preenche automaticamente os dados do remetente, caso não enviados do frontend
    const finalCpfOrigin = cpfOrigin || user.cpf;
    const finalNameOrigin = nameOrigin || user.fullName;

    // 🛑 BLOQUEAR SAQUE SEM SALDO
    if (type === 'Saque' && user.totalBalance < value) {
      return NextResponse.json({ message: 'Saldo insuficiente para saque.' }, { status: 400 });
    }

    // 🛑 BLOQUEAR TRANSFERÊNCIA SEM SALDO
    if (type === 'Transferência') {
      const destinatario = await User.findOne({ cpf: cpfDest });

      if (!destinatario) {
        return NextResponse.json({ message: 'Destinatário não encontrado.' }, { status: 404 });
      }

      if (user.totalBalance < value) {
        return NextResponse.json({ message: 'Saldo insuficiente para transferência.' }, { status: 400 });
      }

      // Executa transferência
      await User.findByIdAndUpdate(userId, {
        $inc: { totalBalance: -value },
      });
      await User.findByIdAndUpdate(destinatario._id, {
        $inc: { totalBalance: value },
      });
    } else if (type === 'Saque') {
      await User.findByIdAndUpdate(userId, { $inc: { totalBalance: -value } });
    } else if (type === 'Depósito') {
      await User.findByIdAndUpdate(userId, { $inc: { totalBalance: value } });
    }

    const newTransaction = await Transaction.create({
      userId,
      type,
      value,
      cpfOrigin: finalCpfOrigin,
      nameOrigin: finalNameOrigin,
      cpfDest,
      nameDest,
      attachment,
      attachmentName,
    });

    const updatedUser = await User.findById(userId);

    return NextResponse.json({
      transaction: newTransaction,
      newBalance: updatedUser?.totalBalance ?? 0,
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no POST /transaction:', error);
    return NextResponse.json({ message: 'Erro ao criar transação.' }, { status: 500 });
  }
}


