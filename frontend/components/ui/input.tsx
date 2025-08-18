import React, { ChangeEvent } from "react";

type InputProps = {
  label?: string;
  name?: string;
  type: string;
  placeholder?: string;
  value?: string;            // input controlado
  defaultValue?: string;     // input não-controlado
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;        // <-- adicionado para permitir classes externas
};

export default function Input({
  label,
  name,
  type,
  placeholder,
  value,
  defaultValue,
  onChange,
  required,
  disabled,
  className,                 // <-- recebe a classe externa
}: InputProps) {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${className || ""}`}
      />
    </div>
  );
}
