'use client';

import { useEffect, useState } from 'react';
import {
  Overlay,
  ModalBox,
  CloseButton,
  Title,
} from './transactionModal.styles';
import FormInput from '../modalComponents/FormInput';
import FormSelect from '../modalComponents/FormSelect';
import { useDispatch } from 'react-redux';
import { setUserBalance } from '@/redux/userSlice';
import type { Transaction } from '@/app/transactions/types/transaction';

interface ModalProps {
  onClose: () => void;
  userId: string | null;
  onSave: (newTransaction: Transaction) => void | Promise<void>;
  transactionToEdit?: Transaction;
}

export default function TransactionModal({
  onClose,
  userId,
  onSave,
  transactionToEdit,
}: ModalProps) {
  const dispatch = useDispatch();
  const [tipo, setTipo] = useState(transactionToEdit?.type || '');
  const [valor, setValor] = useState(transactionToEdit ? String(transactionToEdit.value) : '');
  const [cpfDestinatario, setCpfDestinatario] = useState(transactionToEdit?.cpfDest || '');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const isTransfer = tipo === 'Transferência';

  const isValidCPF = (cpf: string) => /^\d{11}$/.test(cpf.replace(/\D/g, ''));

  const isFormValid =
    tipo !== '' &&
    !isNaN(parseFloat(valor)) &&
    parseFloat(valor) > 0 &&
    (!isTransfer || (cpfDestinatario.trim() !== '' && isValidCPF(cpfDestinatario)));

  const resetForm = () => {
    setTipo('');
    setValor('');
    setCpfDestinatario('');
    setFileBase64(null);
    setFileName(null);
  };

  useEffect(() => {
    if (transactionToEdit) {
      setTipo(transactionToEdit.type || '');
      setValor(String(transactionToEdit.value));
      setCpfDestinatario(transactionToEdit.cpfDest || '');
      setFileBase64(transactionToEdit.attachment || null);
      setFileName(transactionToEdit.attachmentName || null);
    } else {
      resetForm();
    }
  }, [transactionToEdit]);

  useEffect(() => {
    if (!userId || !tipo || transactionToEdit) return;

    fetch(`/api/transaction/last?userId=${userId}&tipo=${encodeURIComponent(tipo)}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data?.transaction) setLastTransaction(data.transaction);
        else setLastTransaction(null);
      })
      .catch(() => setLastTransaction(null));
  }, [userId, tipo, transactionToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return setFileBase64(null), setFileName(null);

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setFileBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return alert('Usuário não identificado.');
    if (!isFormValid) {
      return alert(
        'Por favor, preencha todos os campos corretamente.\n- Valor deve ser maior que zero\n- CPF válido para transferências'
      );
    }

    if (!transactionToEdit && lastTransaction) {
      const sameType = tipo === lastTransaction.type;
      const sameValue = parseFloat(valor) === lastTransaction.value;
      const sameCPF =
        !isTransfer ||
        (cpfDestinatario.replace(/\D/g, '') === lastTransaction.cpfDest?.replace(/\D/g, ''));
      const lastCreatedAt = new Date(lastTransaction.createdAt).getTime();
      const now = Date.now();
      const isDuplicate = sameType && sameValue && sameCPF && now - lastCreatedAt <= 5 * 60 * 1000;

      if (isDuplicate && !window.confirm(
        `Atenção: esta transação parece ser uma duplicata recente:\n\nTipo: ${tipo}\nValor: R$ ${parseFloat(valor).toFixed(2)}\n${isTransfer ? `CPF destinatário: ${cpfDestinatario}\n` : ''}Deseja continuar?`
      )) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (transactionToEdit) {
        const payload = {
          id: transactionToEdit._id,
          value: parseFloat(valor),
          attachment: fileBase64 ?? '',
          attachmentName: fileName ?? '',
        };

        const res = await fetch('/api/transaction', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error((await res.json()).message || 'Erro ao atualizar transação');

        const data = await res.json();
        await onSave(data.transaction);
        dispatch(setUserBalance(data.newBalance));
        alert('Transação atualizada com sucesso!');
      } else {
        const payload = {
          type: tipo,
          value: parseFloat(valor),
          userId,
          ...(isTransfer && { cpfDest: cpfDestinatario }),
          ...(fileBase64 && { attachment: fileBase64 }),
          ...(fileName && { attachmentName: fileName }),
        };

        const res = await fetch('/api/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error((await res.json()).message || 'Erro ao salvar transação');

        const data = await res.json();
        await onSave(data.transaction);
        dispatch(setUserBalance(data.newBalance));
        alert('Transação realizada com sucesso!');
      }

      resetForm();
      onClose();
    } catch (error: any) {
      alert(error.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Fechar modal">✕</CloseButton>
        <Title>{transactionToEdit ? 'Editar transação' : 'Adicionar transação'}</Title>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <FormSelect
            label="Tipo"
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            options={[
              { value: '', label: 'Selecione' },
              { value: 'Saque', label: 'Saque' },
              { value: 'Depósito', label: 'Depósito' },
              { value: 'Transferência', label: 'Transferência' },
            ]}
            disabled={!!transactionToEdit || isSubmitting}
          />

          <FormInput
            label="Valor"
            name="valor"
            type="number"
            min="0.01"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
            disabled={isSubmitting}
          />

          {isTransfer && (
            <FormInput
              label="CPF do destinatário"
              name="cpfDestinatario"
              value={cpfDestinatario}
              onChange={(e) => setCpfDestinatario(e.target.value)}
              placeholder="000.000.000-00"
              required
              disabled={isSubmitting}
            />
          )}

          <div className="flex flex-col">
            <label htmlFor="fileInput" className="font-semibold mb-1">Anexo (imagem ou PDF)</label>
            <input
              id="fileInput"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            {fileName && (
              <div className="mt-2 text-sm text-gray-700">
                <span>📎 {fileName}</span>
                {fileBase64?.startsWith('data:image') && (
                  <img src={fileBase64} alt="Prévia" className="w-32 border rounded mt-1" />
                )}
                {fileBase64?.startsWith('data:application/pdf') && (
                  <a href={fileBase64} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mt-1">
                    Visualizar PDF
                  </a>
                )}
                <button
                  type="button"
                  className="text-red-600 underline text-xs mt-1"
                  onClick={() => {
                    setFileBase64(null);
                    setFileName(null);
                    const input = document.getElementById('fileInput') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                >
                  ❌ Remover anexo
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full rounded-xl py-3 text-base font-bold tracking-[0.015em] transition ${
              isFormValid && !isSubmitting
                ? 'bg-primary text-white hover:bg-secondary'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Enviando...' : 'Salvar'}
          </button>
        </form>
      </ModalBox>
    </Overlay>
  );
}
