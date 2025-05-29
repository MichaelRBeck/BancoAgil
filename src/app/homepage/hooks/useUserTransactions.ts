import { useEffect, useState } from "react";
import { Transaction } from "@/app/transactions/types/transaction";

export function useUserTransactions(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    console.log("Fetching transactions for user:", userId);
    if (!userId) return;
    fetch(`/api/transaction?userId=${userId}`)
      .then((res) => res.ok && res.json())
      .then((data) => data && setTransactions(data))
      .catch((err) => console.error("Erro ao buscar transações:", err));
  }, [userId]);

  return { transactions, setTransactions };
}
