type UserHeader = {
  fullName?: string;
};

export function UserHeader({ fullName }: UserHeader) {
  return (
    <div className="flex flex-wrap justify-between gap-3 p-4 pl-0">
      <p className="min-w-72 text-[28px] sm:text-[32px] font-bold leading-tight text-[#121714]">
        {fullName ? `Olá, ${fullName}` : "Usuário não encontrado"}
      </p>
    </div>
  );
}
