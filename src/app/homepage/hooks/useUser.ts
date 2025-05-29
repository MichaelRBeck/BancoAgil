import { useEffect, useState } from "react";

export function useUser(userId: string | null) {
  const [user, setUser] = useState<{ fullName: string; totalBalance: number } | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/get-user?id=${userId}`)
      .then((res) => res.ok && res.json())
      .then((data) => data && setUser(data))
      .catch((err) => console.error("Erro ao buscar usuário:", err));
  }, [userId]);

  return user;
}
