import React from "react";

type Option = { value: string; label: string };

export type SelectProps = {
  name?: string;
  id?: string;
  value: string; // ✅ agora existe
  onChange: (value: string) => void; // ✅ controlado
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Select({
  name,
  id,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
  className,
}: SelectProps) {
  const selectId = id || name;

  return (
    <div className="w-full">
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 ${className || ""}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}