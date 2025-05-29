import React, { useState } from 'react';
import FormInput from '../modalComponents/FormInput';
import { FormDataRegister, ModalProps } from '../../types/ModalTypes';
import { getFieldErrors, isFormValid } from '../../utils/Validation';

export default function RegisterModal({ onClose }: ModalProps) {
  const [formData, setFormData] = useState<FormDataRegister>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    birthDate: '',
    acceptedTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const fieldErrors = getFieldErrors(formData);
  const validForm = isFormValid(formData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const updatedValue =
      type === 'checkbox' && 'checked' in e.target
        ? (e.target as HTMLInputElement).checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validForm) return;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          cpf: formData.cpf,
          birthDate: formData.birthDate,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        onClose();
      } else {
        alert(result.error || 'Erro ao cadastrar');
      }
    } catch {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl bg-[var(--neutral)] p-8 shadow-lg max-h-[90vh] overflow-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          aria-label="Fechar modal"
        >
          ✕
        </button>

        <h1 className="text-[var(--text)] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5 text-left">
          Cadastro BancoÁgil
        </h1>

        <form className="flex flex-col gap-6 pt-4" onSubmit={handleSubmit}>
          <FormInput
            label="Nome completo"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            hasError={fieldErrors.fullName}
            placeholder="Seu nome completo"
            required
          />
          <FormInput
            label="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            hasError={fieldErrors.email}
            placeholder="exemplo@email.com"
            type="email"
            required
            errorMessage="Formato de e-mail inválido"
          />
          <FormInput
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            hasError={fieldErrors.cpf}
            placeholder="000.000.000-00"
            required
            maxLength={14}
            errorMessage="CPF inválido."
          />
          <FormInput
            label="Senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            hasError={fieldErrors.password}
            placeholder="Mínimo 6 caracteres"
            required
            errorMessage="A senha deve ter pelo menos 6 caracteres."
          />
          <label className="flex items-center gap-2 text-sm text-[var(--text)]">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4 rounded border border-[#dce4e0] checked:bg-[var(--green)] checked:border-[var(--green)] focus:outline-none"
            />
            Mostrar senha
          </label>
          <FormInput
            label="Confirmar Senha"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            hasError={fieldErrors.confirmPassword}
            placeholder="Repita a senha"
            required
            errorMessage="As senhas não coincidem."
          />
          <FormInput
            label="Data de nascimento"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            type="date"
          />
          <label className="flex items-start gap-3 px-1 text-[var(--text)]">
            <input
              name="acceptedTerms"
              type="checkbox"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              className="mt-1 h-5 w-5 rounded border-2 border-[#dce4e0] bg-transparent text-[var(--green)] checked:bg-[var(--green)] checked:border-[var(--green)] focus:outline-none"
            />
            <span className="text-base">
              Concordo com os{' '}
              <span className="underline cursor-pointer">Termos de Serviço</span> e a{' '}
              <span className="underline cursor-pointer">Política de Privacidade</span>.
            </span>
          </label>
          <button
            type="submit"
            disabled={!validForm}
            className={`h-12 w-full rounded-xl text-white font-semibold text-lg transition-colors ${validForm
                ? 'bg-[var(--primary)] hover:bg-[#1f3550] cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
