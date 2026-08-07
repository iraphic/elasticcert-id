import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock } from "lucide-react";
import type { Module } from "../data/types";
import Badge from "./Badge";

export default function ModuleListItem({
  module,
  trackSlug,
  index,
  completed,
  quizScore,
}: {
  module: Module;
  trackSlug: string;
  index: number;
  completed: boolean;
  quizScore?: number;
}) {
  return (
    <li>
      <Link
        to="/track/$trackSlug/modul/$moduleSlug"
        params={{ trackSlug, moduleSlug: module.slug }}
        className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-sm"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}
          aria-hidden
        >
          {completed ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-slate-900">{module.title}</span>
          <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Badge level={module.level} />
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {module.durationMinutes} menit
            </span>
            {quizScore !== undefined && (
              <span className="font-medium text-teal-700">Kuis terbaik: {quizScore}%</span>
            )}
          </span>
        </span>
        {completed && (
          <span className="hidden shrink-0 text-xs font-semibold text-emerald-700 sm:block">
            Selesai
          </span>
        )}
      </Link>
    </li>
  );
}
