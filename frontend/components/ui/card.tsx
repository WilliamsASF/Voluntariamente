// components/ui/card.tsx
import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = ({ className, ...props }: CardProps) => (
  <div
    className={clsx(
      'rounded-xl border bg-white text-card-foreground shadow-md',
      className
    )}
    {...props}
  />
);

// Exportar CardHeader e CardContent
export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <header className="p-4 bg-gray-100 rounded-t-xl">{children}</header>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <main className="p-4">{children}</main>
);

export default Card;