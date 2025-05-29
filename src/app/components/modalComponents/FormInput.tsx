import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  maxLength?: number;
  min?: string;
  step?: string;
}

export default function FormInput({
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
}: FormInputProps) {
  return (
    <label className="flex flex-col">
      <span className="text-base font-medium text-[#121714] pb-2">
        {label}{' '}
        {required && (
          <span className={hasError ? 'text-red-500' : 'text-gray-400'}>*</span>
        )}
      </span>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        step={step}
        className={`h-14 w-full rounded-xl border ${
          hasError ? 'border-red-500' : 'border-[#dce4e0]'
        } bg-white px-4 text-base text-[#121714] placeholder:text-[#668572] focus:outline-none`}
        required={required}
      />
      {hasError && errorMessage && (
        <span className="text-sm text-red-500 mt-1">{errorMessage}</span>
      )}
    </label>
  );
}
