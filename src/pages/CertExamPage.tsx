import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  Clock,
  HelpCircle,
  Target,
  Award,
  Play,
  MonitorSmartphone,
  BookOpen,
} from "lucide-react";
import { getTrack, getCertExam } from "../data";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyState from "../components/EmptyState";
import CertExamSimulator from "../components/CertExamSimulator";
import { useProgress } from "../hooks/useProgress";

export default function CertExamPage() {
  const { trackSlug } = useParams({ from: "/track/$trackSlug/simulasi-certified" });
  const track = getTrack(trackSlug);
  const exam = getCertExam(trackSlug);
  const { state } = useProgress();
  const [session, setSession] = useState(0); // 0 = instruction screen

  if (!track || !exam) {
    return (
      <EmptyState
        title="Simulasi tidak ditemukan"
        description="Simulasi Ujian Certified hanya tersedia untuk tiga jalur sertifikasi di portal ini."
        ctaLabel="Kembali ke Simulasi Ujian Certified"
        ctaTo="/simulasi-certified"
      />
    );
  }

  const best = state.certExamBestScores[track.slug];

  return (
    <div className="bg-slate-950 text-slate-200">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Beranda", to: "/" },
            { label: "Simulasi Ujian Certified", to: "/simulasi-certified" },
            { label: exam.title },
          ]}
        />

        {session === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Exam Simulation — English
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{exam.title}</h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">{exam.description}</p>

            <p className="mt-4 flex items-start gap-2 rounded-lg bg-slate-800 p-3 text-sm text-slate-300">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden />
              Seluruh soal, skenario, dan instruksi simulasi ini disajikan dalam Bahasa Inggris,
              menyerupai format ujian sertifikasi Elastic yang sesungguhnya.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-4">
                <HelpCircle className="h-6 w-6 text-slate-500" aria-hidden />
                <div>
                  <p className="text-lg font-bold text-white">{exam.questions.length} tasks</p>
                  <p className="text-xs text-slate-400">Scenario-based</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-4">
                <Clock className="h-6 w-6 text-slate-500" aria-hidden />
                <div>
                  <p className="text-lg font-bold text-white">{exam.durationMinutes} minutes</p>
                  <p className="text-xs text-slate-400">Countdown timer</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-4">
                <Target className="h-6 w-6 text-slate-500" aria-hidden />
                <div>
                  <p className="text-lg font-bold text-white">{exam.passingScore}%</p>
                  <p className="text-xs text-slate-400">Passing score</p>
                </div>
              </div>
            </div>

            <h2 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
              <MonitorSmartphone className="h-4 w-4" aria-hidden />
              Candidate Instructions
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-slate-300">
              <li>• Read each scenario carefully, then select the best answer for the task.</li>
              <li>
                • Question and option order is randomized from a pool of {exam.questions.length}{" "}
                tasks on every attempt, so each session is different.
              </li>
              <li>• Answers are not graded immediately — scoring happens after submission.</li>
              <li>• You may navigate freely between tasks using the number buttons.</li>
              <li>• When the timer reaches zero, the exam is submitted and scored automatically.</li>
              <li>• The final report shows Pass/Fail and a full answer review with explanations.</li>
            </ul>

            {best !== undefined && (
              <p className="mt-6 flex items-center gap-2 rounded-lg bg-amber-950/60 p-3 text-sm font-semibold text-amber-300">
                <Award className="h-4 w-4" aria-hidden />
                Your best score so far: {best}%
                {best >= exam.passingScore ? " (Pass)" : " (Fail)"}
              </p>
            )}

            <button
              type="button"
              onClick={() => setSession((s) => s + 1)}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
            >
              <Play className="h-4 w-4" aria-hidden />
              Start Exam
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Exam Simulation — English
              </p>
              <h1 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">{exam.title}</h1>
            </div>
            <CertExamSimulator key={session} exam={exam} onRestart={() => setSession(0)} />
          </div>
        )}

        {session === 0 && (
          <p className="mt-6">
            <Link
              to="/simulasi-certified"
              className="text-sm font-semibold text-cyan-400 hover:underline"
            >
              ← Back to all certified simulations
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
