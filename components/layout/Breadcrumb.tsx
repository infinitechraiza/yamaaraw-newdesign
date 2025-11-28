import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center text-sm" aria-label="Breadcrumb">
      {items.map((it, idx) => (
        <span key={idx} className="flex items-center">
          {it.href ? (
            <Link href={it.href} className="text-blue-600 hover:text-blue-700 font-medium">
              {it.label}
            </Link>
          ) : (
            <span className={idx === items.length - 1 ? "bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold" : "text-gray-900 font-bold"}>
              {it.label}
            </span>
          )}
          {idx < items.length - 1 && (
            <span className="mx-2 text-blue-300">›</span>
          )}
        </span>
      ))}
    </nav>
  );
}
