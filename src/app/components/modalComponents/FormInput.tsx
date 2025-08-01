import React, { forwardRef } from 'react';

// Tipagem das props esperadas pelo componente FormInput
interface FormInputProps {
  label: string; // Rótulo exibido acima do input
  name: string; // Nome do input, usado também como identificador
  value: string; // Valor atual do input
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Função chamada ao alterar o valor
  placeholder?: string; // Texto de sugestão exibido quando o campo está vazio
  type?: string; // Tipo do input (text, number, etc.)
  required?: boolean; // Se o campo é obrigatório
  hasError?: boolean; // Se o campo tem erro de validação
  errorMessage?: string; // Mensagem de erro a ser exibida
  maxLength?: number; // Tamanho máximo permitido no campo
  min?: string; // Valor mínimo (útil em campos numéricos ou de data)
  step?: string; // Intervalo entre valores (para inputs numéricos)
  disabled?: boolean;
}

// Componente de input de formulário reutilizável com suporte a ref
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  hasError = false,
  errorMessage,
  maxLength,
  min,
  step,
  disabled = false,
}, ref) => {
  return (
    <label className="flex flex-col">
      {/* Rótulo do campo com indicação de obrigatório */}
      <span className="text-base font-medium text-[#121714] pb-2">
        {label}{' '}
        {required && (
          <span className={hasError ? 'text-red-500' : 'text-gray-400'}>
            *
          </span>
        )}
      </span>

      {/* Campo de entrada de dados */}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        step={step}
        required={required}
        disabled={disabled}
        ref={ref}
        className={`
          h-14 w-full rounded-xl border
          ${hasError ? 'border-red-500' : 'border-[#dce4e0]'}
          bg-white px-4 text-base text-[#121714]
          placeholder:text-[#668572] focus:outline-none
        `}
      />

      {/* Mensagem de erro exibida abaixo do input */}
      {hasError && errorMessage && (
        <span className="text-sm text-red-500 mt-1">{errorMessage}</span>
      )}
    </label>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
