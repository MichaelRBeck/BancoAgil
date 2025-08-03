import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Transaction from '@/app/models/Transactions';
import dbConnect from '@/app/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export async function GET(req: NextRequest) {
  await dbConnect();

  // Verifica autenticação via cookie
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const tipo = searchParams.get('tipo');

  if (!userId || !tipo) {
    return NextResponse.json(
      { error: 'Parâmetros userId e tipo são obrigatórios' },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'userId inválido' }, { status: 400 });
  }

  try {
    const lastTransaction = await Transaction.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      type: tipo,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ transaction: lastTransaction || null });
  } catch (error) {
    console.error('Erro ao buscar última transação:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
