import { Link } from "@tanstack/react-router";
import {
  Server,
  Activity,
  Shield,
  Clock,
  HelpCircle,
  Target,
  Award,
  Globe,
  ArrowRight,
} from "lucide-react";
import { tracks, certExams } from "../data";
import Breadcrumbs from "../components/Breadcrumbs";
import { useProgress } from "../hooks/useProgress";

const icons = { server: Server, activity: Activity, shield: Shield } as const;

export default function CertHubPage() {
  const { state } = useProgress();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[{ label: "Beranda", to: "/" }, { label: "Simulasi Ujian Certified" }]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Simulasi Ujian Certified
          </h1>
          <p className="mt-2 leading-relaxed text-slate-600">
            Simulasi bergaya ujian sertifikasi Elastic asli: soal skenario berbasis tugas dalam{" "}
            <strong className="font-semibold text-slate-800">Bahasa Inggris</strong>, dengan timer
            berjalan mundur, penilaian otomatis, dan hasil Lulus/Tidak. Terpisah dari simulasi ujian
            berbahasa Indonesia di setiap jalur.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-300">
          <Globe className="h-4 w-4" aria-hidden />
          English Exam Mode
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {certExams.map((exam) => {
          const track = tracks.find((t) => t.slug === exam.trackSlug);
          const Icon = track ? icons[track.icon] : Server;
          const best = state.certExamBestScores[exam.trackSlug];
          const passed = best !== undefined && best >= exam.passingScore;
          return (
            <article
              key={exam.slug}
              className="flex flex-col rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-cyan-400">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="text-lg font-bold leading-snug text-white">{exam.title}</h2>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-800 p-2.5">
                  <HelpCircle className="mx-auto h-4 w-4 text-slate-500" aria-hidden />
                  <p className="mt-1 text-sm font-bold text-white">{exam.questions.length}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">tasks</p>
                </div>
                <div className="rounded-lg bg-slate-800 p-2.5">
                  <Clock className="mx-auto h-4 w-4 text-slate-500" aria-hidden />
                  <p className="mt-1 text-sm font-bold text-white">{exam.durationMinutes}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">minutes</p>
                </div>
                <div className="rounded-lg bg-slate-800 p-2.5">
                  <Target className="mx-auto h-4 w-4 text-slate-500" aria-hidden />
                  <p className="mt-1 text-sm font-bold text-white">{exam.passingScore}%</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">to pass</p>
                </div>
              </div>

              <div className="mt-4 min-h-6">
                {best !== undefined ? (
                  <p
                    className={`flex items-center gap-1.5 text-sm font-semibold ${
                      passed ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    <Award className="h-4 w-4" aria-hidden />
                    Nilai terbaik: {best}% {passed ? "— Lulus" : "— Belum lulus"}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">Belum pernah dikerjakan</p>
                )}
              </div>

              <Link
                to="/track/$trackSlug/simulasi-certified"
                params={{ trackSlug: exam.trackSlug }}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Mulai Simulasi
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">Tentang format simulasi ini</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-slate-600">
          <li>
            • Soal berupa skenario tugas (task-based) seperti pada ujian sertifikasi Elastic
            sesungguhnya, ditulis sepenuhnya dalam Bahasa Inggris.
          </li>
          <li>
            • Setiap simulasi memiliki batas waktu; simulasi otomatis dinilai saat waktu habis atau
            saat Anda menekan tombol Submit.
          </li>
          <li>
            • Hasil akhir menampilkan status Pass/Fail, skor, dan ulasan jawaban lengkap dengan
            penjelasan.
          </li>
          <li>
            • Nilai terbaik Anda tersimpan di peramban dan muncul di halaman{" "}
            <Link to="/progres" className="font-semibold text-teal-700 hover:underline">
              Progres Belajar
            </Link>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
