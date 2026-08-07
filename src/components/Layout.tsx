import { useState } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { BookOpen, Menu, X, Server, Activity, Shield, GraduationCap } from "lucide-react";
import { tracks } from "../data";
import { useProgress } from "../hooks/useProgress";
import { overallCompletion } from "../lib/progress";

const trackIcons = { server: Server, activity: Activity, shield: Shield } as const;

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { state } = useProgress();
  const overall = overallCompletion(state);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
              <BookOpen className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg">ElasticCert ID</span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
            {tracks.map((t) => {
              const Icon = trackIcons[t.icon];
              return (
                <Link
                  key={t.slug}
                  to="/track/$trackSlug"
                  params={{ trackSlug: t.slug }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 [&.active]:bg-slate-100 [&.active]:text-slate-900"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {t.name.replace("Elastic Certified ", "")}
                </Link>
              );
            })}
            <Link
              to="/simulasi-certified"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 [&.active]:bg-slate-100 [&.active]:text-slate-900"
            >
              <GraduationCap className="h-4 w-4" aria-hidden />
              Simulasi Certified
            </Link>
            <Link
              to="/progres"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 [&.active]:bg-slate-100 [&.active]:text-slate-900"
            >
              Progres
            </Link>
          </nav>

          <div className="hidden items-center gap-2 lg:flex" aria-label="Progres keseluruhan">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-teal-600 transition-all"
                style={{ width: `${overall}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-700">{overall}%</span>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>

        {menuOpen && (
          <nav aria-label="Navigasi seluler" className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Beranda
                </Link>
              </li>
              {tracks.map((t) => (
                <li key={t.slug}>
                  <Link
                    to="/track/$trackSlug"
                    params={{ trackSlug: t.slug }}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/simulasi-certified"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Simulasi Ujian Certified
                </Link>
              </li>
              <li>
                <Link
                  to="/progres"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Progres Belajar ({overall}%)
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} ElasticCert ID — Portal belajar independen berbahasa
            Indonesia.
          </p>
          <p className="max-w-md">
            Portal ini bukan produk resmi dan tidak berafiliasi dengan Elastic. Elasticsearch dan
            Kibana adalah merek dagang Elastic N.V.
          </p>
        </div>
      </footer>
    </div>
  );
}
