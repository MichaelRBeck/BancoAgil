export type User = {
  _id: string;
  fullName: string; // Corrigir aqui
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
  totalBalance: number;
};

export type Transaction = {
  _id: string;
  userId: string;
  type: "Depósito" | "Saque" | "Transferência";
  value: number;
  cpfOrigin?: string;
  cpfDest?: string;
  createdAt: string;
};
