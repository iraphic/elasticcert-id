import { Link } from "@tanstack/react-router";
import { ArrowDown, BookOpen, ClipboardCheck, GraduationCap, Target, TrendingUp } from "lucide-react";
import { tracks } from "../data";
import TrackCard from "../components/TrackCard";
import ProgressBar from "../components/ProgressBar";
import { useProgress } from "../hooks/useProgress";
import { overallCompletion } from "../lib/progress";

const steps = [
  {
    icon: BookOpen,
    title: "Pilih Jalur",
    text: "Tentukan sertifikasi yang Anda incar: Engineer, Observability, atau Detection.",
  },
  {
    icon: TrendingUp,
    title: "Pelajari Modul Bertahap",
    text: "Ikuti materi dari level Dasar hingga Siap Ujian, lengkap dengan contoh query nyata.",
  },
  {
    icon: ClipboardCheck,
    title: "Kerjakan Kuis",
    text: "Uji pemahaman tiap modul dengan kuis pilihan ganda dan umpan balik langsung.",
  },
  {
    icon: Target,
    title: "Simulasi Ujian",
    text: "Ukur kesiapan Anda dengan simulasi ujian berwaktu di setiap jalur.",
  },
];

export default function HomePage() {
  const { state } = useProgress();
  const overall = overallCompletion(state);
  const totalModules = tracks.reduce((s, t) => s + t.modules.length, 0);
  const doneModules = state.completedModules.length;

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-teal-50 to-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-700">
            Portal Belajar Elasticsearch Berbahasa Indonesia
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Siapkan Diri Anda untuk Sertifikasi Elastic
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Materi bertingkat, contoh query nyata, kuis interaktif, dan simulasi ujian — semuanya
            dalam Bahasa Indonesia, untuk tiga jalur sertifikasi Elastic.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#jalur"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Mulai Belajar
              <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
            <Link
              to="/progres"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Lihat Progres Saya
            </Link>
          </div>

          {overall > 0 && (
            <div className="mx-auto mt-10 max-w-md rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Progres keseluruhan Anda: {doneModules} dari {totalModules} modul selesai
              </p>
              <ProgressBar value={overall} label="Progres keseluruhan" />
            </div>
          )}
        </div>
      </section>

      <section id="jalur" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Tiga Jalur Sertifikasi</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Setiap jalur berisi modul bertingkat dari dasar hingga siap ujian, beserta kuis per modul
          dan simulasi ujian berwaktu.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <TrackCard key={t.slug} track={t} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
              <GraduationCap className="h-4 w-4" aria-hidden />
              Baru — English Exam Mode
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Simulasi Ujian Certified
            </h2>
            <p className="mt-2 leading-relaxed text-slate-300">
              Rasakan format ujian sertifikasi Elastic yang sesungguhnya: soal skenario berbasis
              tugas dalam Bahasa Inggris, timer berjalan mundur, penilaian otomatis, dan hasil
              Lulus/Tidak untuk ketiga jalur sertifikasi.
            </p>
          </div>
          <Link
            to="/simulasi-certified"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Buka Simulasi Certified
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Cara Belajar</h2>
          <ol className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <step.icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Langkah {i + 1}
                </p>
                <h3 className="mt-1 font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
