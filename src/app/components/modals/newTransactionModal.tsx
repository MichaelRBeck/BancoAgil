'use client';

import { useState } from 'react';
import styled from 'styled-components';
import FormInput from '../modalComponents/FormInput';
import FormSelect from '../modalComponents/FormSelect';

interface ModalProps {
  onClose: () => void;
  userId: string | null;
}

// Styled Components
const Overlay = styled.div`
position: fixed;
inset: 0;
z-index: 50;
display: flex;
align-items: center;
justify-content: center;
background-color: rgba(255, 255, 255, 0.3);
backdrop-filter: blur(4px);
`;

const ModalBox = styled.div`
position: relative;
background-color: white;
border-radius: 0.75rem;
padding: 2rem;
width: 100%;
max-width: 40rem;
max-height: 90vh;
overflow-y: auto;
box-shadow: 0 4px 12px rgba(18, 23, 20, 0.12);
`;

const CloseButton = styled.button`
position: absolute;
top: 1rem;
right: 1rem;
color: #6b7280;
font-size: 1.5rem;
cursor: pointer;

&:hover {
  color: #374151;
}
`;

const Title = styled.h1`
font-size: 1.875rem; /* text-3xl */
font-weight: 700;
color: #121714;
margin-bottom: 2rem;
line-height: 1.25;
`;

export default function NewTransactionModal({ onClose, userId }: ModalProps) {
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [cpfDestinatario, setCpfDestinatario] = useState('');

  const isTransfer = tipo === 'Transferência';
  const isFormValid =
    tipo !== '' &&
    parseFloat(valor) > 0 &&
    (!isTransfer || cpfDestinatario.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !userId) {
      alert('Dados inválidos ou usuário não identificado.');
      return;
    }

    try {
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tipo,
          valor,
          cpfDestinatario: isTransfer ? cpfDestinatario : undefined,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = { message: 'Resposta inválida do servidor.' };
      }
      if (!res.ok) {
        alert(`Erro: ${data.message}`);
      } else {
        alert('Transação realizada com sucesso!');
        onClose();
      }
    } catch (error) {
      console.error('Erro ao enviar transação:', error);
      alert('Erro ao enviar transação.');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Fechar modal">✕</CloseButton>

        <Title>Adicionar transação</Title>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FormSelect
            label="Tipo"
            name="tipo"
            value={tipo}
            onChange={(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
              setTipo(e.target.value)
            }
            required
            options={[
              { value: '', label: 'Selecione' },
              { value: 'Saque', label: 'Saque' },
              { value: 'Depósito', label: 'Depósito' },
              { value: 'Transferência', label: 'Transferência' },
            ]}
          />

          <FormInput
            label="Valor"
            name="valor"
            type="number"
            min="0"
            step="0.01"
            value={valor}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
              setValor(e.target.value)
            }
            placeholder="R$ 0,00"
            required
          />

          {isTransfer && (
            <FormInput
              label="CPF do destinatário"
              name="cpfDestinatario"
              type="text"
              value={cpfDestinatario}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                setCpfDestinatario(e.target.value)
              }
              placeholder="000.000.000-00"
              required
            />
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full rounded-xl py-3 text-base font-bold tracking-[0.015em] transition ${isFormValid ? 'hover:bg-secondary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            style={{
              backgroundColor: isFormValid ? 'var(--primary)' : undefined,
              color: isFormValid ? 'white' : undefined,
            }}
          >
            Salvar
          </button>
        </form>
      </ModalBox>
    </Overlay>
  );
}
