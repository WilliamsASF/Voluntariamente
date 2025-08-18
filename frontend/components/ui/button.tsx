// components/ui/button.tsx
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
}

const Button = ({ children, variant = 'default', className, ...props }: ButtonProps) => {
  const classes = clsx(
    'px-4 py-2 font-semibold rounded-md transition-colors',
    {
      'bg-red-600 text-white hover:bg-red-700 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500': variant === 'primary',
      'bg-transparent text-red-600 border border-red-600 hover:bg-red-100':
        variant === 'default',
    },
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;