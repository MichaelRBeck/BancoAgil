import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import { IUserLean } from '../models/User';

export async function getUserById(userId: string): Promise<IUserLean | null> {
  await connectDB();

  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(objectId).lean<IUserLean>().exec();
    return user || null;
  } catch (error) {
    return null;
  }
}
