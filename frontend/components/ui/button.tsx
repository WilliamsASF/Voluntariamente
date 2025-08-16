// components/ui/button.tsx
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
}

const Button = ({ children, variant = 'default', ...props }: ButtonProps) => {
  const classes = clsx(
    'px-4 py-2 font-semibold rounded-md transition-colors',
    {
      'bg-red-600 text-white hover:bg-red-700': variant === 'primary',
      'bg-transparent text-red-600 border border-red-600 hover:bg-red-100':
        variant === 'default',
    }
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;