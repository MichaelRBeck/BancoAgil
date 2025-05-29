import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { fullName, email, password, cpf, birthDate } = body;

    if (!fullName || !email || !password || !cpf || !birthDate) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ cpf });
    if (existingUser) {
      return NextResponse.json({ error: 'CPF já cadastrado.' }, { status: 409 });
    }

    const newUser = new User({
      fullName,
      email,
      password,
      cpf,
      birthDate,
      totalBalance: 0,
    });

    await newUser.save();
    return NextResponse.json({ message: 'Usuário cadastrado com sucesso.' }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}