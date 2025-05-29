import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import connectDB from '@/app/lib/mongodb';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { cpf, password } = await req.json();

    const user = await User.findOne({ cpf });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login realizado com sucesso', userId: user._id });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
