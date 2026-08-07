import { Link } from "@tanstack/react-router";
import { Server, Activity, Shield, ArrowRight, Clock } from "lucide-react";
import type { Track } from "../data/types";
import { useProgress } from "../hooks/useProgress";
import { trackCompletion } from "../lib/progress";
import ProgressBar from "./ProgressBar";

const icons = { server: Server, activity: Activity, shield: Shield } as const;

const accents = {
  teal: {
    chip: "bg-teal-100 text-teal-700",
    bar: "bg-teal-600",
    ring: "hover:border-teal-300",
    text: "text-teal-700",
  },
  amber: {
    chip: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
    ring: "hover:border-amber-300",
    text: "text-amber-700",
  },
  rose: {
    chip: "bg-rose-100 text-rose-700",
    bar: "bg-rose-600",
    ring: "hover:border-rose-300",
    text: "text-rose-700",
  },
} as const;

export function getAccent(color: Track["color"]) {
  return accents[color];
}

export default function TrackCard({ track }: { track: Track }) {
  const { state } = useProgress();
  const pct = trackCompletion(state, track);
  const Icon = icons[track.icon];
  const accent = accents[track.color];
  const totalMinutes = track.modules.reduce((s, m) => s + m.durationMinutes, 0);

  return (
    <Link
      to="/track/$trackSlug"
      params={{ trackSlug: track.slug }}
      className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md ${accent.ring}`}
    >
      <span
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${accent.chip}`}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="text-lg font-bold text-slate-900">{track.name}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">{track.tagline}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        <span>{track.modules.length} modul</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          ±{Math.round(totalMinutes / 60)} jam belajar
        </span>
      </div>
      <div className="mt-3">
        <ProgressBar value={pct} colorClass={accent.bar} label={`Progres ${track.name}`} />
      </div>
      <span
        className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${accent.text}`}
      >
        Jelajahi jalur
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
