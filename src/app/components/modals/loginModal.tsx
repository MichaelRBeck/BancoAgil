'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';

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
  const dispatch = useDispatch();
  const cpfInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormDataLogin>({
    cpf: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ cpf?: string; password?: string; server?: string }>({});

  useEffect(() => {
    cpfInputRef.current?.focus();
  }, []);

  const isValidCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    return /^\d{11}$/.test(cleaned);
  };

  const isValidPassword = (password: string) => password.length >= 6;

  const validateField = (name: string, value: string) => {
    if (name === 'cpf') {
      setErrors((prev) => ({
        ...prev,
        cpf: isValidCPF(value) ? undefined : 'CPF inválido. Use o formato 000.000.000-00',
      }));
    }

    if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: isValidPassword(value) ? undefined : 'Senha deve ter pelo menos 6 caracteres.',
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const canSubmit = () =>
    isValidCPF(formData.cpf) &&
    isValidPassword(formData.password) &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!isValidCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido. Use o formato 000.000.000-00';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!loginResponse.ok) {
        const result = await loginResponse.json();
        setErrors({ server: result.error || 'Erro ao fazer login' });
        setLoading(false);
        return;
      }

      // Após login, buscar usuário com o cookie JWT
      const userResponse = await fetch('/api/get-user', { credentials: 'include' });
      if (!userResponse.ok) {
        setErrors({ server: 'Erro ao obter dados do usuário após login' });
        setLoading(false);
        return;
      }

      const user = await userResponse.json();

      dispatch(setUser({
        id: user.id,
        fullName: user.fullName,
        cpf: user.cpf,
        totalBalance: user.totalBalance || 0,
      }));

      router.push('/homepage');  // redireciona para página protegida

      onClose();

    } catch (error) {
      setErrors({ server: 'Erro de conexão com o servidor.' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Overlay onClick={onClose} aria-modal="true" role="dialog" aria-labelledby="login-title">
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Fechar modal">✕</CloseButton>
        <Title id="login-title">Entre na plataforma BancoÁgil</Title>

        <form className="flex flex-col gap-6 pt-4" onSubmit={handleSubmit} noValidate>
          <FormInput
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            required
            maxLength={14}
            hasError={!!errors.cpf}
            errorMessage={errors.cpf}
            ref={cpfInputRef}
          />

          <FormInput
            label="Senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
            hasError={!!errors.password}
            errorMessage={errors.password}
          />

          <label htmlFor="showPassword" className="flex items-center gap-2 text-sm text-[var(--text)]">
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4"
            />
            Mostrar senha
          </label>

          {errors.server && (
            <div role="alert" className="text-red-600 text-center text-sm">
              {errors.server}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit()}
            className={`h-12 w-full rounded-xl bg-[var(--primary)] text-white font-bold tracking-[0.015em] hover:bg-[#1f3550] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </ModalBox>
    </Overlay>
  );
}
