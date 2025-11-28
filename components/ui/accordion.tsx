"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  openValues: string[];
  toggle: (value: string) => void;
  type: AccordionType;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function Accordion({
  children,
  className,
  type = "single",
  collapsible = false,
  defaultValue,
}: React.PropsWithChildren<{
  className?: string;
  type?: AccordionType;
  collapsible?: boolean;
  defaultValue?: string | string[];
}>) {
  const initial = React.useMemo(() => {
    if (!defaultValue) return [] as string[];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  }, [defaultValue]);

  const [openValues, setOpenValues] = useState<string[]>(initial);

  const toggle = useCallback(
    (value: string) => {
      setOpenValues((prev) => {
        const exists = prev.includes(value);
        if (type === "single") {
          if (exists) {
            return collapsible ? [] : prev;
          }
          return [value];
        }
        // multiple
        if (exists) return prev.filter((v) => v !== value);
        return [...prev, value];
      });
    },
    [type, collapsible]
  );

  return (
    <AccordionContext.Provider value={{ openValues, toggle, type }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  children,
  value,
  className,
}: React.PropsWithChildren<{ value: string; className?: string }>) {
  return (
    <div data-accordion-value={value} className={className}>
      {children}
    </div>
  );
}

export function AccordionTrigger({
  children,
  value,
  className,
}: React.PropsWithChildren<{ value?: string; className?: string }>) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionTrigger must be used within an Accordion");

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Determine value: prefer provided value, otherwise read from nearest parent data-accordion-value
  const resolveValue = useCallback((): string | undefined => {
    if (value) return value;
    const el = buttonRef.current;
    const parent = el?.closest('[data-accordion-value]') as HTMLElement | null;
    return parent?.getAttribute("data-accordion-value") || undefined;
  }, [value]);

  const resolved = resolveValue();
  const open = resolved ? ctx.openValues.includes(resolved) : false;

  // Make whole item clickable: attach a click handler to the parent container (data-accordion-value)
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const parent = el.closest('[data-accordion-value]') as HTMLElement | null;
    if (!parent || !resolved) return;

    const handler = (e: MouseEvent) => {
      // Ignore clicks on interactive controls inside the parent
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (el.contains(target)) return; // button click will handle
      if (target.closest('button, a, input, textarea, select')) return;
      ctx.toggle(resolved);
    };

    parent.addEventListener('click', handler);
    return () => parent.removeEventListener('click', handler);
  }, [resolved, ctx]);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={open}
      onClick={() => resolved && ctx.toggle(resolved)}
      className={className}
    >
      {children}
    </button>
  );
}

export function AccordionContent({
  children,
  value,
  className,
}: React.PropsWithChildren<{ value: string; className?: string }>) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionContent must be used within an Accordion");

  const open = ctx.openValues.includes(value);

  return (
    <div
      hidden={!open}
      aria-hidden={!open}
      className={className}
    >
      {children}
    </div>
  );
}

export default Accordion;
