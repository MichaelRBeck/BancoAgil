'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import FormInput from '../modalComponents/FormInput';
import { FormDataLogin, ModalProps } from '../../types/ModalTypes';
import { useRouter } from 'next/navigation';

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
  width: 100%;
  max-width: 32rem; /* max-w-lg */
  border-radius: 0.75rem;
  background-color: var(--neutral);
  padding: 2rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: var(--text);
  font-size: 1.375rem; /* 22px */
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.015em;
  padding: 1.25rem 0 0.75rem;
  text-align: left;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280; /* gray-500 */
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #374151; /* gray-700 */
  }
`;

export default function LoginModal({ onClose }: ModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataLogin>({
    cpf: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('authUserId', result.userId);
        router.push(`/homepage?id=${result.userId}`);
        onClose();
      } else {
        alert(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✕</CloseButton>

        <Title>Entre na plataforma BancoÁgil</Title>

        <form className="flex flex-col gap-6 pt-4" onSubmit={handleSubmit}>
          <FormInput
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            required={false}
            maxLength={14}
            errorMessage="CPF inválido."
          />

          <FormInput
            label="Senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required={false}
            errorMessage="A senha deve ter pelo menos 6 caracteres."
          />

          <label className="flex items-center gap-2 text-sm text-[var(--text)]">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4"
            />
            Mostrar senha
          </label>

          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-[var(--primary)] text-[var(--text)] text-white font-bold tracking-[0.015em] hover:bg-[#1f3550] transition-colors cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </ModalBox>
    </Overlay>
  );
}
