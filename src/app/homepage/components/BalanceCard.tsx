type BalanceCardProps = {
  totalBalance?: number;
};

export function BalanceCard({ totalBalance = 0 }: BalanceCardProps) {
  return (
    <div className="w-full sm:w-80 rounded-xl border bg-white px-6 py-4 shadow-sm">
      <p className="font-medium text-gray-600">Valor Total</p>
      <p className="mt-2 text-3xl font-extrabold text-black">
        {totalBalance.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </div>
  );
}
