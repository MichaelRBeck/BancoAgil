import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import connectDB from '@/app/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

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

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        cpf: user.cpf,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = new NextResponse(
      JSON.stringify({
        message: 'Login realizado com sucesso',
        userId: user._id.toString(),
        fullName: user.fullName,
        cpf: user.cpf,
        totalBalance: user.totalBalance,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
