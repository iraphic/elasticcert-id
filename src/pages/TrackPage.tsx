import { Link, useParams } from "@tanstack/react-router";
import { Server, Activity, Shield, Clock, HelpCircle, Target, Info, GraduationCap } from "lucide-react";
import { getTrack } from "../data";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyState from "../components/EmptyState";
import ModuleListItem from "../components/ModuleListItem";
import ProgressBar from "../components/ProgressBar";
import { useProgress } from "../hooks/useProgress";
import { isModuleCompleted, moduleKey, trackCompletion } from "../lib/progress";
import { getAccent } from "../components/TrackCard";

const icons = { server: Server, activity: Activity, shield: Shield } as const;

export default function TrackPage() {
  const { trackSlug } = useParams({ from: "/track/$trackSlug" });
  const track = getTrack(trackSlug);
  const { state } = useProgress();

  if (!track) {
    return (
      <EmptyState
        title="Jalur tidak ditemukan"
        description="Jalur belajar yang Anda cari tidak tersedia. Silakan pilih salah satu dari tiga jalur sertifikasi di Beranda."
      />
    );
  }

  const pct = trackCompletion(state, track);
  const Icon = icons[track.icon];
  const accent = getAccent(track.color);
  const bestExam = state.examBestScores[track.slug];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Beranda", to: "/" }, { label: track.name }]} />

      <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${accent.chip}`}
          >
            <Icon className="h-7 w-7" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{track.name}</h1>
            <p className="mt-1 text-slate-600">{track.tagline}</p>
          </div>
        </div>
        <p className="max-w-3xl leading-relaxed text-slate-600">{track.description}</p>
        <p className="text-sm text-slate-500">{track.audience}</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <HelpCircle className="h-6 w-6 text-slate-400" aria-hidden />
            <div>
              <p className="text-lg font-bold text-slate-900">{track.examInfo.questionCount} soal</p>
              <p className="text-xs text-slate-500">Simulasi ujian</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Clock className="h-6 w-6 text-slate-400" aria-hidden />
            <div>
              <p className="text-lg font-bold text-slate-900">
                {track.examInfo.durationMinutes} menit
              </p>
              <p className="text-xs text-slate-500">Batas waktu</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <Target className="h-6 w-6 text-slate-400" aria-hidden />
            <div>
              <p className="text-lg font-bold text-slate-900">{track.examInfo.passingScore}%</p>
              <p className="text-xs text-slate-500">Skor kelulusan</p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">Progres jalur</span>
            {bestExam !== undefined && (
              <span className="font-semibold text-teal-700">
                Nilai simulasi terbaik: {bestExam}%
              </span>
            )}
          </div>
          <ProgressBar value={pct} colorClass={accent.bar} label={`Progres ${track.name}`} />
        </div>
      </div>

      <section aria-label="Daftar modul" className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Daftar Modul</h2>
        <p className="mt-1 text-sm text-slate-500">
          Pelajari berurutan dari level Dasar hingga Siap Ujian.
        </p>
        <ol className="mt-5 flex flex-col gap-3">
          {track.modules.map((m, i) => (
            <ModuleListItem
              key={m.slug}
              module={m}
              trackSlug={track.slug}
              index={i}
              completed={isModuleCompleted(state, track.slug, m.slug)}
              quizScore={state.quizScores[moduleKey(track.slug, m.slug)]}
            />
          ))}
        </ol>
      </section>

      <section
        aria-label="Simulasi ujian"
        className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
      >
        <h2 className="text-xl font-bold text-slate-900">Simulasi Ujian</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          Uji kesiapan Anda dengan {track.examInfo.questionCount} soal pilihan ganda dalam{" "}
          {track.examInfo.durationMinutes} menit. Lulus bila skor mencapai{" "}
          {track.examInfo.passingScore}%.
        </p>
        {pct < 100 && (
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Anda baru menyelesaikan {pct}% modul. Kami sarankan menyelesaikan semua modul terlebih
            dahulu untuk hasil terbaik.
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/track/$trackSlug/simulasi"
            params={{ trackSlug: track.slug }}
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Mulai Simulasi Ujian
          </Link>
          <Link
            to="/track/$trackSlug/simulasi-certified"
            params={{ trackSlug: track.slug }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-cyan-300 hover:bg-slate-800"
          >
            <GraduationCap className="h-4 w-4" aria-hidden />
            Simulasi Certified (EN)
          </Link>
        </div>
      </section>
    </div>
  );
}
