import { useState } from 'react';
import TransactionModal from './modals/transactionModal';

interface NewTransactionButtonProps {
  userId: string | null;
  onSave: (newTransaction: any) => void;
  children: React.ReactNode;
  disabled?: boolean; // ✅ Adicionado aqui
}

export default function NewTransactionButton({
  userId,
  onSave,
  children,
  disabled = false, // ✅ Valor padrão para prop opcional
}: NewTransactionButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  return (
    <>
      <button
        disabled={disabled} // ✅ Aplicado ao botão
        onClick={() => {
          if (!disabled) setShowModal(true);
        }}
        className={`cursor-pointer h-10 min-w-[180px] rounded-xl px-6 text-sm font-bold tracking-[0.015em] transition ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          backgroundColor: disabled ? '#A0A0A0' : 'var(--primary)',
          color: '#FAFAFA',
        }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = 'var(--secondary)';
        }}
        onMouseLeave={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = 'var(--primary)';
        }}
      >
        {children}
      </button>

      {showModal && userId && (
        <TransactionModal
          onClose={handleClose}
          userId={userId}
          onSave={onSave}
        />
      )}
    </>
  );
}
