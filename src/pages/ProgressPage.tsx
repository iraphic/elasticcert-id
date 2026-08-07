import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Server, Activity, Shield, Trophy, Trash2, CheckCircle2, GraduationCap } from "lucide-react";
import { tracks } from "../data";
import Breadcrumbs from "../components/Breadcrumbs";
import ProgressBar from "../components/ProgressBar";
import { getAccent } from "../components/TrackCard";
import { useProgress } from "../hooks/useProgress";
import {
  isModuleCompleted,
  moduleKey,
  overallCompletion,
  trackCompletion,
} from "../lib/progress";

const icons = { server: Server, activity: Activity, shield: Shield } as const;

export default function ProgressPage() {
  const { state, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const overall = overallCompletion(state);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Beranda", to: "/" }, { label: "Progres Belajar" }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Progres Belajar</h1>
          <p className="mt-1 text-slate-600">
            Semua progres tersimpan di peramban Anda (localStorage), tanpa perlu akun.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          Atur Ulang Progres
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Progres Keseluruhan</h2>
          <span className="text-sm text-slate-500">
            {state.completedModules.length} modul selesai
          </span>
        </div>
        <ProgressBar value={overall} label="Progres keseluruhan" />
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {tracks.map((track) => {
          const pct = trackCompletion(state, track);
          const Icon = icons[track.icon];
          const accent = getAccent(track.color);
          const best = state.examBestScores[track.slug];
          const certBest = state.certExamBestScores[track.slug];
          return (
            <section
              key={track.slug}
              aria-label={`Progres ${track.name}`}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.chip}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900">{track.name}</h2>
                    <Link
                      to="/track/$trackSlug"
                      params={{ trackSlug: track.slug }}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Buka jalur →
                    </Link>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {best !== undefined ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      <Trophy className="h-3.5 w-3.5" aria-hidden />
                      Simulasi terbaik: {best}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Belum ada simulasi</span>
                  )}
                  {certBest !== undefined && (
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-cyan-300">
                      <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                      Certified (EN): {certBest}%
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <ProgressBar value={pct} colorClass={accent.bar} label={`Progres ${track.name}`} />
              </div>

              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {track.modules.map((m) => {
                  const done = isModuleCompleted(state, track.slug, m.slug);
                  const quiz = state.quizScores[moduleKey(track.slug, m.slug)];
                  return (
                    <li key={m.slug}>
                      <Link
                        to="/track/$trackSlug/modul/$moduleSlug"
                        params={{ trackSlug: track.slug, moduleSlug: m.slug }}
                        className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm hover:border-teal-200"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${
                              done ? "text-emerald-600" : "text-slate-300"
                            }`}
                            aria-hidden
                          />
                          <span className={`truncate ${done ? "font-medium text-slate-800" : "text-slate-500"}`}>
                            {m.title}
                          </span>
                        </span>
                        {quiz !== undefined && (
                          <span className="shrink-0 text-xs font-semibold text-teal-700">
                            {quiz}%
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="konfirmasi-reset"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="konfirmasi-reset" className="text-lg font-bold text-slate-900">
              Atur ulang semua progres?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Seluruh tanda selesai, nilai kuis, dan nilai simulasi terbaik akan dihapus permanen
              dari peramban ini. Tindakan tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setConfirming(false);
                }}
                className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
