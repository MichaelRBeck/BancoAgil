import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;   // <== Inclua o _id aqui
  fullName: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
  totalBalance: number;
}

export interface IUserLean {
  _id: string;           // aqui _id como string (MongoDB id convertido)
  fullName: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
  totalBalance: number;
}

const UserSchema: Schema = new Schema<IUser>({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  cpf: { 
    type: String, 
    required: true, 
    unique: true 
  },
  birthDate: { 
    type: String, 
    required: true 
  },
  totalBalance: { 
    type: Number, 
    default: 0 
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
