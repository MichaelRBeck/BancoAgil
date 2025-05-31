import { useEffect, useState } from "react";

// Hook para buscar dados do usuário pelo userId
export function useUser(userId: string | null) {
  // Estado para armazenar o usuário (ou null se não encontrado)
  const [user, setUser] = useState<{ fullName: string; totalBalance: number } | null>(null);

  useEffect(() => {
    // Se não tiver userId, não faz nada e mantém user como null
    if (!userId) return;

    // Faz a requisição para buscar o usuário pela API
    fetch(`/api/get-user?id=${userId}`)
      .then((res) => {
        // Se a resposta for ok, converte para json, senão retorna false
        if (res.ok) return res.json();
        return false;
      })
      .then((data) => {
        // Se tiver dados, atualiza o estado user
        if (data) setUser(data);
      })
      .catch((err) => {
        // Em caso de erro, loga no console (não altera estado)
        console.error("Erro ao buscar usuário:", err);
      });
  }, [userId]);

  // Retorna o usuário ou null enquanto carrega/não encontra
  return user;
}
