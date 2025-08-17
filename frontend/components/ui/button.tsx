// components/ui/button.tsx

import React from 'react';

type ButtonVariant = 'default' | 'primary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = ({ children, variant = 'default', size = 'md', ...props }: ButtonProps) => {
  // classes base
  let baseClasses = 'font-semibold rounded-md transition-colors inline-flex items-center justify-center ';

  // classes de variant
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = 'bg-red-600 text-white hover:bg-red-700';
  } else if (variant === 'default') {
    variantClasses = 'bg-transparent text-red-600 border border-red-600 hover:bg-red-100';
  } else if (variant === 'outline') {
    variantClasses = 'bg-white text-red-600 border border-red-600 hover:bg-red-100';
  }

  // classes de size
  let sizeClasses = '';
  if (size === 'sm') {
    sizeClasses = 'px-2 py-1 text-sm';
  } else if (size === 'md') {
    sizeClasses = 'px-4 py-2 text-base';
  } else if (size === 'lg') {
    sizeClasses = 'px-6 py-3 text-lg';
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses}`} {...props}>
      {children}
    </button>
  );
};

export default Button;