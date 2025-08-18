// components/ui/select.tsx
import React, { useState } from 'react';
import clsx from 'clsx';

interface SelectProps {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

const Select = ({ label, placeholder, options, value, onChange }: SelectProps) => {
  const [selectedOption, setSelectedOption] = useState(value || '');

  return (
    <div>
      <label htmlFor="function" className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id="function"
        value={value || selectedOption}
        onChange={(e) => {
          const newValue = e.target.value;
          setSelectedOption(newValue);
          onChange?.(newValue);
        }}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;