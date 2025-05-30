import { useState } from 'react';
import NewTransactionModal from "../../components/modals/newTransactionModal";

interface NewTransactionButtonProps {
  userId?: string;
}

export default function NewTransactionButton({ userId = '' }: NewTransactionButtonProps) {
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);

  return (
    <>
      <div className="flex justify-start px-4 mt-4 mb-6">
        <button
          onClick={() => setShowNewTransactionModal(true)}
          className="cursor-pointer h-10 min-w-[180px] rounded-xl px-6 text-sm font-bold tracking-[0.015em] transition"
          style={{ backgroundColor: 'var(--primary)', color: '#FAFAFA' }}
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

      {showNewTransactionModal && (
        <NewTransactionModal
          onClose={() => setShowNewTransactionModal(false)}
          userId={userId}
        />
      )}
    </>
  );
}
