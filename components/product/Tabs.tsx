import * as TabsPrimitive from '@radix-ui/react-tabs';
import { ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
  className?: string;
}

export function Tabs({ children, defaultValue, className = '' }: TabsProps) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue} className={className}>
      {children}
    </TabsPrimitive.Root>
  );
}

export function TabsList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <TabsPrimitive.List className={`inline-flex items-center justify-start gap-2 ${className}`}>
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ children, value, className = '' }: { children: ReactNode; value: string; className?: string }) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={`px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 ${className}`}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({ children, value, className = '' }: { children: ReactNode; value: string; className?: string }) {
  return (
    <TabsPrimitive.Content value={value} className={className}>
      {children}
    </TabsPrimitive.Content>
  );
}

