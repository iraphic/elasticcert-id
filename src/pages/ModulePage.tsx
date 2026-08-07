import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  KeyRound,
  Undo2,
} from "lucide-react";
import { getAdjacentModules, getModule, getTrack } from "../data";
import Breadcrumbs from "../components/Breadcrumbs";
import Badge from "../components/Badge";
import CodeBlock from "../components/CodeBlock";
import EmptyState from "../components/EmptyState";
import Quiz from "../components/Quiz";
import { useProgress } from "../hooks/useProgress";
import { isModuleCompleted } from "../lib/progress";

export default function ModulePage() {
  const { trackSlug, moduleSlug } = useParams({ from: "/track/$trackSlug/modul/$moduleSlug" });
  const { state, completeModule, uncompleteModule } = useProgress();

  const track = getTrack(trackSlug);
  const found = getModule(trackSlug, moduleSlug);

  if (!track || !found) {
    return (
      <EmptyState
        title="Modul tidak ditemukan"
        description="Modul yang Anda cari tidak tersedia pada jalur ini."
        ctaLabel={track ? `Kembali ke ${track.name}` : "Kembali ke Beranda"}
        ctaTo={track ? `/track/${track.slug}` : "/"}
      />
    );
  }

  const { module } = found;
  const { prev, next } = getAdjacentModules(track, module.slug);
  const completed = isModuleCompleted(state, track.slug, module.slug);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Beranda", to: "/" },
          { label: track.name, to: "/track/$trackSlug", params: { trackSlug: track.slug } },
          { label: module.title },
        ]}
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Badge level={module.level} />
        <span className="flex items-center gap-1 text-sm text-slate-500">
          <Clock className="h-4 w-4" aria-hidden />
          ±{module.durationMinutes} menit membaca
        </span>
        {completed && (
          <span className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Sudah selesai
          </span>
        )}
      </div>

      <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
        {module.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600">{module.intro}</p>

      <article className="mt-10 flex flex-col gap-10">
        {module.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-slate-700">
                {p}
              </p>
            ))}
            {section.codeExample && (
              <div className="mt-4">
                <CodeBlock example={section.codeExample} />
              </div>
            )}
          </section>
        ))}
      </article>

      <aside className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-teal-900">
          <KeyRound className="h-5 w-5" aria-hidden />
          Poin Penting
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {module.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-teal-900">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </aside>

      <section aria-label="Kuis modul" className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Kuis Latihan</h2>
        <Quiz
          key={`${track.slug}/${module.slug}`}
          questions={module.quiz}
          trackSlug={track.slug}
          moduleSlug={module.slug}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {completed ? (
            <button
              type="button"
              onClick={() => uncompleteModule(track.slug, module.slug)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Undo2 className="h-4 w-4" aria-hidden />
              Batalkan Tanda Selesai
            </button>
          ) : (
            <button
              type="button"
              onClick={() => completeModule(track.slug, module.slug)}
              className="inline-flex items-center gap-2 rounded-lg border border-teal-600 bg-white px-5 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Tandai Selesai
            </button>
          )}
          <p className="text-xs text-slate-500">
            Skor kuis ≥ 70% juga menandai modul selesai secara otomatis.
          </p>
        </div>
      </section>

      <nav aria-label="Navigasi modul" className="mt-12 grid grid-cols-1 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            to="/track/$trackSlug/modul/$moduleSlug"
            params={{ trackSlug: track.slug, moduleSlug: prev.slug }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-300"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
            <span>
              <span className="block text-xs text-slate-500">Modul Sebelumnya</span>
              <span className="block font-semibold text-slate-900">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/track/$trackSlug/modul/$moduleSlug"
            params={{ trackSlug: track.slug, moduleSlug: next.slug }}
            className="flex items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 text-right transition hover:border-teal-300"
          >
            <span>
              <span className="block text-xs text-slate-500">Modul Berikutnya</span>
              <span className="block font-semibold text-slate-900">{next.title}</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
          </Link>
        ) : (
          <Link
            to="/track/$trackSlug/simulasi"
            params={{ trackSlug: track.slug }}
            className="flex items-center justify-end gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4 text-right transition hover:border-teal-400"
          >
            <span>
              <span className="block text-xs text-teal-700">Langkah Terakhir</span>
              <span className="block font-semibold text-teal-900">Mulai Simulasi Ujian</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-teal-500" aria-hidden />
          </Link>
        )}
      </nav>

      <div className="mt-6">
        <Link
          to="/track/$trackSlug"
          params={{ trackSlug: track.slug }}
          className="text-sm font-semibold text-teal-700 hover:underline"
        >
          ← Kembali ke daftar modul {track.name}
        </Link>
      </div>
    </div>
  );
}
