import connectDB from "../lib/mongodb";
import User, { IUser } from "../models/User";

export async function getUserById(userId: string): Promise<IUser | null> {
  await connectDB();
  try {
    const user = await User.findById(userId).lean<IUser>();
    return user || null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}
