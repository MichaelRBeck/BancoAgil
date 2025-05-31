import { useEffect, useState } from "react";
import { Transaction } from "@/app/transactions/types/transaction";

// Hook para buscar as transações do usuário pelo userId
export function useUserTransactions(userId: string | null) {
  // Estado para armazenar as transações (array vazio por padrão)
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Se não houver userId, não faz nada (mantém array vazio)
    if (!userId) return;

    // Faz a requisição para buscar as transações da API
    fetch(`/api/transaction?userId=${userId}`)
      .then((res) => {
        // Se a resposta for OK, converte para JSON, senão retorna false
        if (res.ok) return res.json();
        return false;
      })
      .then((data) => {
        // Se houver dados, atualiza o estado das transações
        if (data) setTransactions(data);
      })
      .catch((err) => {
        // Em caso de erro, loga no console (sem alterar o estado)
        console.error("Erro ao buscar transações:", err);
      });
  }, [userId]);

  // Retorna as transações e a função para atualizar o estado
  return { transactions, setTransactions };
}
