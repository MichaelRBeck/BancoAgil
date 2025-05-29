import { NextResponse } from "next/server";
import { getUserById } from "../../services/userService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const user = await getUserById(id);
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
