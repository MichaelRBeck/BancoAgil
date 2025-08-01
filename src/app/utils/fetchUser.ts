export async function fetchUser(userId: string | null) {
  if (!userId) return null;

  try {
    const res = await fetch(`/api/get-user?id=${userId}`);

    if (!res.ok) {
      console.error('Erro ao buscar usuário:', await res.text());
      return null;
    }

    const data = await res.json();
    if (data.error) {
      console.warn('API retornou erro:', data.error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro de rede ao buscar usuário:', error);
    return null;
  }
}