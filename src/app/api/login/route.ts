import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import connectDB from '@/app/lib/mongodb';

// Função que lida com requisições POST para autenticação de login
export async function POST(req: Request) {
  try {
    // Conecta ao banco de dados
    await connectDB();

    // Extrai CPF e senha do corpo da requisição
    const { cpf, password } = await req.json();

    // Busca o usuário pelo CPF
    const user = await User.findOne({ cpf });

    // Se o usuário não for encontrado, retorna erro 404
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verifica se a senha fornecida está correta
    if (user.password !== password) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    // Se CPF e senha forem válidos, retorna sucesso com o ID do usuário
    return NextResponse.json({ message: 'Login realizado com sucesso', userId: user._id });
  } catch (error) {
    // Em caso de erro inesperado, registra no console e retorna erro 500
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
