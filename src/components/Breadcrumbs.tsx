import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Navigasi lokasi" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />}
            {item.to ? (
              <Link
                to={item.to}
                params={item.params}
                className="rounded px-1 py-0.5 hover:text-teal-700 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="px-1 py-0.5 font-medium text-slate-800" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
