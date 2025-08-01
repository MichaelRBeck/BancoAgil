import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Transaction from '@/app/models/Transactions';
import dbConnect from '@/app/lib/mongodb'; // seu helper para conectar ao mongo

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const tipo = searchParams.get('tipo');

  if (!userId || !tipo) {
    return NextResponse.json({ error: 'Parâmetros userId e tipo são obrigatórios' }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'userId inválido' }, { status: 400 });
  }

  try {
    // Busca última transação do userId e tipo, ordenada pela data mais recente
    const lastTransaction = await Transaction.findOne({ 
      userId: new mongoose.Types.ObjectId(userId),
      type: tipo,
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ transaction: lastTransaction || null });
  } catch (error) {
    console.error('Erro ao buscar última transação:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
