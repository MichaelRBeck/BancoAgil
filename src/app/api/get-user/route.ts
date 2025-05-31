import { NextResponse } from "next/server";
import { getUserById } from "../../services/userService";

// Função que lida com requisições GET para buscar um usuário por ID
export async function GET(request: Request) {
  // Extrai os parâmetros da URL da requisição
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Verifica se o parâmetro "id" foi fornecido
  if (!id) {
    return NextResponse.json({ error: "Usuário sem ID" }, { status: 400 });
  }

  try {
    // Tenta buscar o usuário pelo ID usando a função de serviço
    const user = await getUserById(id);

    // Retorna o usuário encontrado em formato JSON
    return NextResponse.json(user);
  } catch (err) {
    // Retorna erro caso o usuário não seja encontrado
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
}
