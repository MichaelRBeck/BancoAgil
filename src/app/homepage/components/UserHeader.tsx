// Define as props esperadas pelo componente
type UserHeader = {
  fullName?: string; // nome completo do usuário (opcional)
};

// Componente que exibe uma saudação personalizada com base no nome do usuário
export function UserHeader({ fullName }: UserHeader) {
  return (
    <div className="flex flex-wrap justify-between gap-3 p-4 pl-0">
      <p className="min-w-72 text-[28px] sm:text-[32px] font-bold leading-tight text-[#121714]">
        {/* Exibe saudação personalizada ou mensagem de erro */}
        {fullName ? `Olá, ${fullName}` : "Usuário não encontrado"}
      </p>
    </div>
  );
}
