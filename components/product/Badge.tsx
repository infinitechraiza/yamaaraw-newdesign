import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export default function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded ${className}`}>
      {children}
    </span>
  );
}

