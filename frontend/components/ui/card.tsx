import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-2xl shadow p-4 bg-white ${className || ""}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={`mb-2 ${className || ""}`}>{children}</div>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={`${className || ""}`}>{children}</div>;
}