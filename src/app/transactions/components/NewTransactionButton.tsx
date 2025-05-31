import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NewTransactionModal from "../../components/modals/newTransactionModal";

export default function NewTransactionButton() {
  // Estado para controlar a exibição do modal de nova transação
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);

  // Hooks do Next.js para navegação e leitura dos parâmetros da URL
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtém o parâmetro 'id' da URL, que representa o ID do usuário autenticado
  const userId = searchParams.get('id');

  return (
    <>
      <div className="flex justify-start px-4 mt-4 mb-6">
        <button
          onClick={() => setShowNewTransactionModal(true)} // Abre o modal ao clicar
          className="cursor-pointer h-10 min-w-[180px] rounded-xl px-6 text-sm font-bold tracking-[0.015em] transition"
          style={{ backgroundColor: 'var(--primary)', color: '#FAFAFA' }}
          // Efeitos simples de hover que mudam a cor de fundo do botão
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary)';
          }}
        >
          Realizar uma nova transação
        </button>
      </div>

      {/* Renderiza o modal somente se o estado estiver ativo */}
      {showNewTransactionModal && (
        <NewTransactionModal
          onClose={() => setShowNewTransactionModal(false)} // Fecha o modal
          userId={userId} // Passa o userId para o modal usar na criação da transação
        />
      )}
    </>
  );
}
