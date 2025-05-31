import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

// Função que lida com requisições POST para cadastro de novo usuário
export async function POST(req: NextRequest) {
  try {
    // Conecta ao banco de dados
    await connectDB();

    // Obtém os dados do corpo da requisição
    const body = await req.json();
    const { fullName, email, password, cpf, birthDate } = body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!fullName || !email || !password || !cpf || !birthDate) {
      return NextResponse.json(
        { error: 'Preencha todos os campos obrigatórios.' },
        { status: 400 }
      );
    }

    // Verifica se o CPF já está cadastrado
    const existingUser = await User.findOne({ cpf });
    if (existingUser) {
      return NextResponse.json(
        { error: 'CPF já cadastrado.' },
        { status: 409 }
      );
    }

    // Cria uma nova instância de usuário
    const newUser = new User({
      fullName,
      email,
      password,
      cpf,
      birthDate,
      totalBalance: 0, // Define saldo inicial como zero
    });

    // Salva o novo usuário no banco
    await newUser.save();

    // Retorna resposta de sucesso
    return NextResponse.json(
      { message: 'Usuário cadastrado com sucesso.' },
      { status: 201 }
    );

  } catch (error) {
    // Retorna erro genérico em caso de falha inesperada
    return NextResponse.json(
      { error: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}
