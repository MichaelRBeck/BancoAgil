import React from 'react';

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: { value: string; label: string }[];
}

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
      <span className="text-base font-medium text-[#121714] pb-2">
        {label} {required && <span className="text-gray-400">*</span>}
      </span>
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
