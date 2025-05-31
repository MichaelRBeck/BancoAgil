  'use client';

  import React, { useState } from 'react';
  import { useRouter } from 'next/navigation';

  import {
    Overlay,
    ModalBox,
    Title,
    CloseButton
  } from './loginModal.styles';

  import FormInput from '../modalComponents/FormInput';
  import { FormDataLogin, ModalProps } from '../../types/ModalTypes';

  export default function LoginModal({ onClose }: ModalProps) {
    const router = useRouter();

    // Estado para armazenar dados do formulário
    const [formData, setFormData] = useState<FormDataLogin>({
      cpf: '',
      password: '',
    });

    // Estado para controle de exibição da senha
    const [showPassword, setShowPassword] = useState(false);

    // Atualiza os dados do formulário conforme o usuário digita
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    // Envia os dados de login para a API
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
          // Armazena o ID do usuário logado e redireciona
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

          <form
            className="flex flex-col gap-6 pt-4"
            onSubmit={handleSubmit}
          >
            {/* Campo CPF */}
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

            {/* Campo Senha */}
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

            {/* Checkbox para mostrar ou esconder a senha */}
            <label className="flex items-center gap-2 text-sm text-[var(--text)]">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4"
              />
              Mostrar senha
            </label>

            {/* Botão de login */}
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
