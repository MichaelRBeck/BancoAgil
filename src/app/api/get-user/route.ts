import { NextResponse } from "next/server";
import { getUserById } from "../../services/userService";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const token = getCookieValue(cookieHeader, 'token');
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (e) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user = await getUserById(payload.userId);

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id.toString(),
      fullName: user.fullName,
      cpf: user.cpf,
      totalBalance: user.totalBalance,
    });
  } catch (err) {
    console.error('Erro interno no get-user:', err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
