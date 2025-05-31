import React from 'react';

// Tipagem das props esperadas pelo componente FormSelect
interface FormSelectProps {
  label: string; // Rótulo exibido acima do select
  name: string; // Nome do select, usado também como identificador
  value: string; // Valor atualmente selecionado
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Função chamada ao alterar a seleção
  required?: boolean; // Se o campo é obrigatório
  options: { value: string; label: string }[]; // Lista de opções a serem exibidas no select
}

// Componente de select (dropdown) reutilizável
export default function FormSelect({
  label,
  name,
  value,
  onChange,
  required = false,
  options,
}: FormSelectProps) {
  return (
    <label className="flex flex-col">
      {/* Rótulo do campo com indicação de obrigatório */}
      <span className="text-base font-medium text-[#121714] pb-2">
        {label}{' '}
        {required && <span className="text-gray-400">*</span>}
      </span>

      {/* Campo select com as opções fornecidas */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="h-14 w-full rounded-xl border border-[#dce4e0] bg-white px-4 text-base text-[#121714] focus:outline-none"
      >
        {options.map(({ value: val, label }) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
