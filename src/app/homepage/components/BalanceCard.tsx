// Define os tipos das props recebidas pelo componente
type BalanceCardProps = {
  totalBalance?: number; // saldo total opcional, com valor padrão de 0
};

// Componente que exibe o saldo total do usuário em formato monetário
export function BalanceCard({ totalBalance = 0 }: BalanceCardProps) {
  return (
    <div className="w-full sm:w-80 rounded-xl border bg-white px-6 py-4 shadow-sm">
      {/* Rótulo descritivo */}
      <p className="font-medium text-gray-600">Valor Total</p>

      {/* Valor formatado como moeda brasileira */}
      <p className="mt-2 text-3xl font-extrabold text-black">
        {totalBalance.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </div>
  );
}
