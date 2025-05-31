'use client';

import { useState } from 'react';
import {
  Overlay,
  ModalBox,
  CloseButton,
  Title,
} from './newTransactionModal.styles';
import FormInput from '../modalComponents/FormInput';
import FormSelect from '../modalComponents/FormSelect';

interface ModalProps {
  onClose: () => void;
  userId: string | null;
}

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
            className={`w-full rounded-xl py-3 text-base font-bold tracking-[0.015em] transition ${
              isFormValid ? 'hover:bg-secondary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
