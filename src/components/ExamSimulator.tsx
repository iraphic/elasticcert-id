import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Timer, AlertTriangle } from "lucide-react";
import type { Track } from "../data/types";
import { useProgress } from "../hooks/useProgress";
import { sampleQuestions, type ShuffledQuestion } from "../lib/shuffle";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamSimulator({
  track,
  onRestart,
}: {
  track: Track;
  onRestart: () => void;
}) {
  const { saveExamScore } = useProgress();
  const [questions] = useState<ShuffledQuestion[]>(() =>
    sampleQuestions(track.examQuestions, track.examInfo.questionCount),
  );
  const totalSeconds = track.examInfo.durationMinutes * 60;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<{ correct: number; percent: number } | null>(null);
  const savedRef = useRef(false);

  const answeredCount = Object.keys(answers).length;
  const emptyCount = questions.length - answeredCount;

  const finish = useMemo(
    () => () => {
      const correct = questions.reduce(
        (sum, q, i) => sum + (answers[i] === q.answerIndex ? 1 : 0),
        0,
      );
      const percent = Math.round((correct / questions.length) * 100);
      setResult({ correct, percent });
      if (!savedRef.current) {
        savedRef.current = true;
        saveExamScore(track.slug, percent);
      }
    },
    [answers, questions, saveExamScore, track.slug],
  );

  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    if (result) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          finishRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [result]);

  if (result) {
    const passed = result.percent >= track.examInfo.passingScore;
    return (
      <div className="flex flex-col gap-6">
        <div
          className={`rounded-2xl border p-6 text-center sm:p-8 ${
            passed ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
          }`}
          role="status"
        >
          <span
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
              passed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
            }`}
          >
            {passed ? (
              <CheckCircle2 className="h-8 w-8" aria-hidden />
            ) : (
              <XCircle className="h-8 w-8" aria-hidden />
            )}
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            {passed ? "Selamat, Anda Lulus!" : "Belum Lulus — Terus Berlatih!"}
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-slate-900">{result.percent}%</p>
          <p className="mt-2 text-sm text-slate-600">
            {result.correct} dari {questions.length} soal benar · Ambang kelulusan{" "}
            {track.examInfo.passingScore}%
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Coba Lagi
          </button>
        </div>

        <section aria-label="Ulasan jawaban">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Ulasan Jawaban</h2>
          <ol className="flex flex-col gap-4">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const correct = userAnswer === q.answerIndex;
              return (
                <li
                  key={q.id}
                  className={`rounded-xl border p-4 sm:p-5 ${
                    correct ? "border-emerald-200 bg-white" : "border-rose-200 bg-white"
                  }`}
                >
                  <p className="flex items-start gap-2 font-semibold text-slate-900">
                    {correct ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" aria-hidden />
                    )}
                    <span>
                      {i + 1}. {q.prompt}
                    </span>
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5 text-sm">
                    <p className="text-slate-600">
                      Jawaban Anda:{" "}
                      <span className={correct ? "font-semibold text-emerald-700" : "font-semibold text-rose-700"}>
                        {userAnswer !== undefined ? q.options[userAnswer] : "Tidak dijawab"}
                      </span>
                    </p>
                    {!correct && (
                      <p className="text-slate-600">
                        Jawaban benar:{" "}
                        <span className="font-semibold text-emerald-700">
                          {q.options[q.answerIndex]}
                        </span>
                      </p>
                    )}
                    <p className="mt-1 rounded-lg bg-slate-50 p-3 leading-relaxed text-slate-700">
                      {q.explanation}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    );
  }

  const question = questions[index];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <span
          className={`flex items-center gap-2 font-mono text-lg font-bold ${
            timeLeft <= 60 ? "text-rose-600" : "text-slate-900"
          }`}
          role="timer"
          aria-label="Sisa waktu"
        >
          <Timer className="h-5 w-5" aria-hidden />
          {formatTime(timeLeft)}
        </span>
        <span className="text-sm text-slate-500">
          Terjawab {answeredCount} dari {questions.length}
        </span>
      </div>

      <nav aria-label="Navigasi soal" className="flex flex-wrap gap-2">
        {questions.map((q, i) => {
          const answered = answers[i] !== undefined;
          const active = i === index;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Soal ${i + 1}${answered ? ", sudah dijawab" : ", belum dijawab"}`}
              aria-current={active ? "true" : undefined}
              className={`h-10 w-10 rounded-lg border text-sm font-semibold transition ${
                active
                  ? "border-teal-600 bg-teal-600 text-white"
                  : answered
                    ? "border-teal-300 bg-teal-50 text-teal-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </nav>

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <legend className="sr-only">Soal nomor {index + 1}</legend>
        <p className="text-base font-semibold leading-relaxed text-slate-900">
          <span className="mr-1 text-slate-400">{index + 1}.</span>
          {question.prompt}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {question.options.map((option, i) => (
            <label
              key={i}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                answers[index] === i
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/50"
              }`}
            >
              <input
                type="radio"
                name={`exam-${question.id}`}
                value={i}
                checked={answers[index] === i}
                onChange={() => setAnswers((a) => ({ ...a, [index]: i }))}
                className="h-4 w-4 shrink-0 accent-teal-600"
              />
              <span className="text-slate-800">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={index === questions.length - 1}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            if (emptyCount > 0) {
              setConfirming(true);
            } else {
              finish();
            }
          }}
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Selesai &amp; Nilai
        </button>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="konfirmasi-selesai"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" aria-hidden />
              <div>
                <h2 id="konfirmasi-selesai" className="text-lg font-bold text-slate-900">
                  Masih ada soal kosong
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Ada {emptyCount} soal yang belum dijawab dan akan dinilai salah. Yakin ingin
                  menyelesaikan simulasi sekarang?
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Kembali Mengerjakan
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  finish();
                }}
                className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
