import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Timer,
  AlertTriangle,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { CertExam } from "../data/types";
import { useProgress } from "../hooks/useProgress";
import { shuffleQuestions, type ShuffledQuestion } from "../lib/shuffle";
import CodeBlock from "./CodeBlock";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CertExamSimulator({
  exam,
  onRestart,
}: {
  exam: CertExam;
  onRestart: () => void;
}) {
  const { saveCertExamScore } = useProgress();
  const [questions] = useState<ShuffledQuestion[]>(() => shuffleQuestions(exam.questions));
  const totalSeconds = exam.durationMinutes * 60;

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
        saveCertExamScore(exam.trackSlug, percent);
      }
    },
    [answers, questions, saveCertExamScore, exam.trackSlug],
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
    const passed = result.percent >= exam.passingScore;
    return (
      <div className="flex flex-col gap-6">
        <div
          className={`rounded-2xl border p-6 text-center sm:p-8 ${
            passed ? "border-emerald-700 bg-emerald-950/40" : "border-rose-700 bg-rose-950/40"
          }`}
          role="status"
        >
          <span
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
              passed ? "bg-emerald-900 text-emerald-300" : "bg-rose-900 text-rose-300"
            }`}
          >
            {passed ? (
              <Award className="h-8 w-8" aria-hidden />
            ) : (
              <XCircle className="h-8 w-8" aria-hidden />
            )}
          </span>
          <p
            className={`text-sm font-bold uppercase tracking-widest ${
              passed ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {passed ? "Result: Pass" : "Result: Fail"}
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            {passed
              ? "Congratulations — you passed the simulation!"
              : "Not yet — review the tasks below and try again."}
          </h2>
          <p className="mt-3 text-4xl font-extrabold text-white">{result.percent}%</p>
          <p className="mt-2 text-sm text-slate-300">
            {result.correct} of {questions.length} tasks correct · Passing score {exam.passingScore}
            %
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Retake Simulation
          </button>
        </div>

        <section aria-label="Answer review">
          <h2 className="mb-3 text-lg font-bold text-white">Answer Review</h2>
          <ol className="flex flex-col gap-4">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const correct = userAnswer === q.answerIndex;
              return (
                <li
                  key={q.id}
                  className={`rounded-xl border p-4 sm:p-5 ${
                    correct ? "border-emerald-800 bg-slate-900" : "border-rose-800 bg-slate-900"
                  }`}
                >
                  <p className="flex items-start gap-2 font-semibold text-slate-100">
                    {correct ? (
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                        aria-hidden
                      />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden />
                    )}
                    <span>
                      Task {i + 1}. {q.prompt}
                    </span>
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5 text-sm">
                    <p className="text-slate-400">
                      Your answer:{" "}
                      <span
                        className={correct ? "font-semibold text-emerald-300" : "font-semibold text-rose-300"}
                      >
                        {userAnswer !== undefined ? q.options[userAnswer] : "Not answered"}
                      </span>
                    </p>
                    {!correct && (
                      <p className="text-slate-400">
                        Correct answer:{" "}
                        <span className="font-semibold text-emerald-300">
                          {q.options[q.answerIndex]}
                        </span>
                      </p>
                    )}
                    <p className="mt-1 rounded-lg bg-slate-800 p-3 leading-relaxed text-slate-300">
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
      <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 shadow-lg">
        <span
          className={`flex items-center gap-2 font-mono text-lg font-bold ${
            timeLeft <= 120 ? "text-rose-400" : "text-cyan-300"
          }`}
          role="timer"
          aria-label="Time remaining"
        >
          <Timer className="h-5 w-5" aria-hidden />
          {formatTime(timeLeft)}
        </span>
        <span className="text-sm text-slate-400">
          Task {index + 1} of {questions.length} · Answered {answeredCount}/{questions.length}
        </span>
      </div>

      <nav aria-label="Task navigation" className="flex flex-wrap gap-2">
        {questions.map((q, i) => {
          const answered = answers[i] !== undefined;
          const active = i === index;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Task ${i + 1}${answered ? ", answered" : ", unanswered"}`}
              aria-current={active ? "true" : undefined}
              className={`h-10 w-10 rounded-lg border text-sm font-semibold transition ${
                active
                  ? "border-cyan-400 bg-cyan-400 text-slate-950"
                  : answered
                    ? "border-cyan-700 bg-cyan-950 text-cyan-300"
                    : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-slate-700 bg-slate-900">
        <div className="border-b border-slate-700 bg-slate-800/60 px-5 py-4 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Task {index + 1} — Scenario
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-200">
            {question.scenario}
          </p>
          {question.contextCode && (
            <div className="mt-4">
              <CodeBlock example={question.contextCode} />
            </div>
          )}
        </div>

        <fieldset className="p-5 sm:p-7">
          <legend className="text-base font-semibold leading-relaxed text-white">
            {question.prompt}
          </legend>
          <div className="mt-4 flex flex-col gap-2">
            {question.options.map((option, i) => (
              <label
                key={i}
                className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  answers[index] === i
                    ? "border-cyan-400 bg-cyan-950/60"
                    : "border-slate-700 bg-slate-800/40 hover:border-cyan-600 hover:bg-slate-800"
                }`}
              >
                <input
                  type="radio"
                  name={`cert-${question.id}`}
                  value={i}
                  checked={answers[index] === i}
                  onChange={() => setAnswers((a) => ({ ...a, [index]: i }))}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
                />
                <span className="whitespace-pre-line text-slate-200">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Previous
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={index === questions.length - 1}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
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
          className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Submit Exam
        </button>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-submit"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" aria-hidden />
              <div>
                <h2 id="confirm-submit" className="text-lg font-bold text-white">
                  Unanswered tasks
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  You still have {emptyCount} unanswered {emptyCount === 1 ? "task" : "tasks"},
                  which will be scored as incorrect. Submit the exam now?
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700"
              >
                Keep Working
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  finish();
                }}
                className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
