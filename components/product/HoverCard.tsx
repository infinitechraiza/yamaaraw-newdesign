import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { ReactNode } from 'react';

interface HoverCardProps {
  children: ReactNode;
}

export function HoverCard({ children }: HoverCardProps) {
  return (
    <HoverCardPrimitive.Root>
      {children}
    </HoverCardPrimitive.Root>
  );
}

export function HoverCardTrigger({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <HoverCardPrimitive.Trigger asChild>
      <div className={className}>
        {children}
      </div>
    </HoverCardPrimitive.Trigger>
  );
}

export function HoverCardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        className={`z-50 w-64 rounded-md border bg-white p-4 shadow-md ${className}`}
        sideOffset={5}
      >
        {children}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
}

