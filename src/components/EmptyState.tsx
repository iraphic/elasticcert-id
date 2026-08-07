import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export default function EmptyState({
  title,
  description,
  ctaLabel = "Kembali ke Beranda",
  ctaTo = "/",
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-20 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Compass className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{description}</p>
      <Link
        to={ctaTo}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
