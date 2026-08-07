import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import type { Question } from "../data/types";
import { useProgress } from "../hooks/useProgress";
import { shuffleQuestions, type ShuffledQuestion } from "../lib/shuffle";

export default function Quiz({
  questions,
  trackSlug,
  moduleSlug,
}: {
  questions: Question[];
  trackSlug: string;
  moduleSlug: string;
}) {
  const { saveQuizScore } = useProgress();
  const [shuffled, setShuffled] = useState<ShuffledQuestion[]>(() =>
    shuffleQuestions(questions),
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const question = shuffled[index];

  function handleCheck() {
    if (selected === null) return;
    const isCorrect = selected === question.answerIndex;
    setCorrectCount((c) => c + (isCorrect ? 1 : 0));
    setChecked(true);
  }

  function handleNext() {
    if (index === shuffled.length - 1) {
      const pct = Math.round((correctCount / shuffled.length) * 100);
      setFinalScore(pct);
      saveQuizScore(trackSlug, moduleSlug, pct);
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  function handleRestart() {
    setShuffled(shuffleQuestions(questions));
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setCorrectCount(0);
    setFinished(false);
    setFinalScore(0);
  }

  if (finished) {
    const passed = finalScore >= 70;
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-8" role="status">
        <span
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            passed ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
          }`}
        >
          {passed ? <CheckCircle2 className="h-8 w-8" aria-hidden /> : <XCircle className="h-8 w-8" aria-hidden />}
        </span>
        <h3 className="text-xl font-bold text-slate-900">Kuis Selesai</h3>
        <p className="mt-2 text-4xl font-extrabold text-slate-900">{finalScore}%</p>
        <p className="mt-2 text-sm text-slate-600">
          Anda menjawab {correctCount} dari {shuffled.length} soal dengan benar.{" "}
          {passed
            ? "Selamat! Modul ini otomatis ditandai selesai."
            : "Skor minimal 70% untuk menandai modul selesai otomatis. Coba lagi!"}
        </p>
        <button
          type="button"
          onClick={handleRestart}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Ulangi Kuis
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
        <span className="font-semibold">
          Soal {index + 1} dari {shuffled.length}
        </span>
        <span>Benar sejauh ini: {correctCount}</span>
      </div>

      <fieldset>
        <legend className="text-base font-semibold leading-relaxed text-slate-900">
          {question.prompt}
        </legend>
        <div className="mt-4 flex flex-col gap-2">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const showResult = checked;
            const isCorrectOption = i === question.answerIndex;
            let optionClass =
              "border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/50";
            if (isSelected && !showResult) optionClass = "border-teal-500 bg-teal-50";
            if (showResult && isCorrectOption) optionClass = "border-emerald-500 bg-emerald-50";
            if (showResult && isSelected && !isCorrectOption)
              optionClass = "border-rose-400 bg-rose-50";
            return (
              <label
                key={i}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${optionClass}`}
              >
                <input
                  type="radio"
                  name={`quiz-${question.id}`}
                  value={i}
                  checked={isSelected}
                  disabled={checked}
                  onChange={() => setSelected(i)}
                  className="h-4 w-4 shrink-0 accent-teal-600"
                />
                <span className="text-slate-800">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {checked && (
        <div
          role="status"
          className={`mt-4 rounded-xl border p-4 text-sm ${
            selected === question.answerIndex
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <p className="font-semibold">
            {selected === question.answerIndex ? "Benar!" : "Kurang tepat."}
          </p>
          <p className="mt-1 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        {!checked ? (
          <button
            type="button"
            onClick={handleCheck}
            disabled={selected === null}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Periksa Jawaban
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            {index === shuffled.length - 1 ? "Lihat Hasil" : "Soal Berikutnya"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
