import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="space-y-1">
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        className={clsx(
          'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500',
          props.className
        )}
      />
    </div>
  );
};

export default Input;