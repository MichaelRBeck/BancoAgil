import React, { useState } from 'react';
import { FormDataRegister, ModalProps } from '../../types/ModalTypes';
import { getFieldErrors, isFormValid } from '../../utils/Validation';

import FormInput from '../modalComponents/FormInput';

import {
  Overlay,
  ModalContainer,
  CloseButton,
  Title,
  Form,
  ShowPasswordLabel,
  CheckboxInput,
  TermsLabel,
  TermsCheckbox,
  TermsText,
  SubmitButton,
} from './registerModal.styles';

// Componente de modal para cadastro de novo usuário
export default function RegisterModal({ onClose }: ModalProps) {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState<FormDataRegister>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    birthDate: '',
    acceptedTerms: false,
  });

  // Estado para alternar visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  // Validações de campos e formulário
  const fieldErrors = getFieldErrors(formData);
  const validForm = isFormValid(formData);

  // Atualiza os valores do formulário conforme o usuário digita/marca
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Trata corretamente valores de checkbox
    const updatedValue =
      type === 'checkbox' && 'checked' in e.target
        ? (e.target as HTMLInputElement).checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Submete os dados do formulário à API de cadastro
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
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {/* Botão de fechar modal */}
        <CloseButton onClick={onClose} aria-label="Fechar modal">
          ✕
        </CloseButton>

        {/* Título do modal */}
        <Title>Cadastro BancoÁgil</Title>

        {/* Formulário de cadastro */}
        <Form onSubmit={handleSubmit}>
          {/* Nome completo */}
          <FormInput
            label="Nome completo"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            hasError={fieldErrors.fullName}
            placeholder="Seu nome completo"
            required
          />

          {/* E-mail */}
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

          {/* CPF */}
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

          {/* Senha */}
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

          {/* Checkbox para mostrar senha */}
          <ShowPasswordLabel>
            <CheckboxInput
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Mostrar senha
          </ShowPasswordLabel>

          {/* Confirmar senha */}
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

          {/* Data de nascimento */}
          <FormInput
            label="Data de nascimento"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            type="date"
          />

          {/* Aceitação dos termos */}
          <TermsLabel>
            <TermsCheckbox
              name="acceptedTerms"
              type="checkbox"
              checked={formData.acceptedTerms}
              onChange={handleChange}
            />
            <TermsText>
              Concordo com os <span>Termos de Serviço</span> e a{' '}
              <span>Política de Privacidade</span>.
            </TermsText>
          </TermsLabel>

          {/* Botão de envio do formulário */}
          <SubmitButton type="submit" disabled={!validForm}>
            Criar Conta
          </SubmitButton>
        </Form>
      </ModalContainer>
    </Overlay>
  );
}
