interface ValueInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function ValueInput({ value, onChange }: ValueInputProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-24 rounded-lg border border-gray-300 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
    />
  );
}
