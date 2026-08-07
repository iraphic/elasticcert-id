import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Clock, HelpCircle, Target, Trophy, Play } from "lucide-react";
import { getTrack } from "../data";
import Breadcrumbs from "../components/Breadcrumbs";
import EmptyState from "../components/EmptyState";
import ExamSimulator from "../components/ExamSimulator";
import { useProgress } from "../hooks/useProgress";

export default function ExamPage() {
  const { trackSlug } = useParams({ from: "/track/$trackSlug/simulasi" });
  const track = getTrack(trackSlug);
  const { state } = useProgress();
  const [session, setSession] = useState(0); // 0 = layar pembuka

  if (!track) {
    return (
      <EmptyState
        title="Jalur tidak ditemukan"
        description="Simulasi ujian hanya tersedia untuk tiga jalur sertifikasi resmi di portal ini."
      />
    );
  }

  const best = state.examBestScores[track.slug];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Beranda", to: "/" },
          { label: track.name, to: "/track/$trackSlug", params: { trackSlug: track.slug } },
          { label: "Simulasi Ujian" },
        ]}
      />

      {session === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Simulasi Ujian: {track.name}
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
            Simulasi ini menguji pemahaman Anda atas seluruh modul jalur {track.name}. Kerjakan
            dengan jujur untuk mengukur kesiapan Anda menghadapi ujian sesungguhnya.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <HelpCircle className="h-6 w-6 text-slate-400" aria-hidden />
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {track.examInfo.questionCount} soal
                </p>
                <p className="text-xs text-slate-500">Pilihan ganda</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Clock className="h-6 w-6 text-slate-400" aria-hidden />
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {track.examInfo.durationMinutes} menit
                </p>
                <p className="text-xs text-slate-500">Timer berjalan mundur</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <Target className="h-6 w-6 text-slate-400" aria-hidden />
              <div>
                <p className="text-lg font-bold text-slate-900">{track.examInfo.passingScore}%</p>
                <p className="text-xs text-slate-500">Skor untuk lulus</p>
              </div>
            </div>
          </div>

          <ul className="mt-6 flex flex-col gap-2 text-sm text-slate-600">
            <li>• Jawaban tidak langsung dinilai — penilaian dilakukan di akhir.</li>
            <li>
              • Urutan soal dan opsi jawaban diacak dari bank {track.examQuestions.length} soal
              setiap sesi, sehingga tiap percobaan berbeda.
            </li>
            <li>• Anda dapat berpindah soal lewat navigasi nomor.</li>
            <li>• Waktu habis akan otomatis menyelesaikan dan menilai simulasi.</li>
            <li>• Hasil akhir menyertakan ulasan per soal beserta penjelasan.</li>
          </ul>

          {best !== undefined && (
            <p className="mt-6 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800">
              <Trophy className="h-4 w-4" aria-hidden />
              Nilai terbaik Anda sejauh ini: {best}%
              {best >= track.examInfo.passingScore ? " (Lulus)" : " (Belum lulus)"}
            </p>
          )}

          <button
            type="button"
            onClick={() => setSession((s) => s + 1)}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Play className="h-4 w-4" aria-hidden />
            Mulai Simulasi
          </button>
        </div>
      ) : (
        <div>
          <h1 className="mb-6 text-xl font-extrabold text-slate-900 sm:text-2xl">
            Simulasi Ujian: {track.name}
          </h1>
          <ExamSimulator
            key={session}
            track={track}
            onRestart={() => setSession(0)}
          />
        </div>
      )}

      {session === 0 && (
        <p className="mt-6">
          <Link
            to="/track/$trackSlug"
            params={{ trackSlug: track.slug }}
            className="text-sm font-semibold text-teal-700 hover:underline"
          >
            ← Kembali ke jalur {track.name}
          </Link>
        </p>
      )}
    </div>
  );
}
