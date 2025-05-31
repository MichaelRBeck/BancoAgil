import { User } from '../types/transaction';

// Componente para exibir o saldo total do usuário
export default function TotalBalanceCard({ user }: { user: User | null }) {
  return (
    <div className="w-full sm:w-80 rounded-xl border bg-white px-6 py-4 shadow-sm">
      {/* Título da seção */}
      <p className="font-medium text-gray-600">Valor Total</p>

      {/* Valor formatado do saldo total do usuário */}
      <p className="mt-2 text-3xl font-extrabold text-black">
        {user
          ? user.totalBalance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }) // Formata o valor como moeda BRL (Real)
          : "R$ 0,00" // Exibe valor padrão caso o usuário seja null
        }
      </p>
    </div>
  );
}
