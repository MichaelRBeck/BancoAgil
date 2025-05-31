// Define as props esperadas pelo componente ValueInput
interface ValueInputProps {
  value: number; // Valor numérico atual do input
  onChange: (newValue: number) => void; // Função chamada ao alterar o valor
}

// Componente reutilizável de input numérico simples
export default function ValueInput({ value, onChange }: ValueInputProps) {
  return (
    <input
      type="number" // Define o input como numérico
      value={value} // Valor controlado vindo da prop
      onChange={(e) => onChange(Number(e.target.value))} // Converte o valor para número e aciona o onChange
      className="w-24 rounded-lg border border-gray-300 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
    />
  );
}
