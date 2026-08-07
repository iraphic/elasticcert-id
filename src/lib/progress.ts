import { tracks } from "../data";
import type { Track } from "../data/types";

export interface ProgressState {
  completedModules: string[]; // format "trackSlug/moduleSlug"
  quizScores: Record<string, number>; // key "trackSlug/moduleSlug" -> persen 0-100
  examBestScores: Record<string, number>; // key trackSlug -> persen 0-100
  certExamBestScores: Record<string, number>; // key trackSlug -> persen 0-100 (simulasi certified, EN)
}

const STORAGE_KEY = "elasticcert-progress-v1";

const EMPTY: ProgressState = {
  completedModules: [],
  quizScores: {},
  examBestScores: {},
  certExamBestScores: {},
};

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
      quizScores: parsed.quizScores ?? {},
      examBestScores: parsed.examBestScores ?? {},
      certExamBestScores: parsed.certExamBestScores ?? {},
    };
  } catch {
    return { ...EMPTY };
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // penyimpanan tidak tersedia; abaikan
  }
}

export function moduleKey(trackSlug: string, moduleSlug: string): string {
  return `${trackSlug}/${moduleSlug}`;
}

export function markModuleCompleted(
  state: ProgressState,
  trackSlug: string,
  moduleSlug: string,
): ProgressState {
  const key = moduleKey(trackSlug, moduleSlug);
  if (state.completedModules.includes(key)) return state;
  return { ...state, completedModules: [...state.completedModules, key] };
}

export function unmarkModuleCompleted(
  state: ProgressState,
  trackSlug: string,
  moduleSlug: string,
): ProgressState {
  const key = moduleKey(trackSlug, moduleSlug);
  return {
    ...state,
    completedModules: state.completedModules.filter((k) => k !== key),
  };
}

export function recordQuizScore(
  state: ProgressState,
  trackSlug: string,
  moduleSlug: string,
  percent: number,
): ProgressState {
  const key = moduleKey(trackSlug, moduleSlug);
  const prev = state.quizScores[key];
  if (prev !== undefined && prev >= percent) return state;
  return { ...state, quizScores: { ...state.quizScores, [key]: percent } };
}

export function recordExamScore(
  state: ProgressState,
  trackSlug: string,
  percent: number,
): ProgressState {
  const prev = state.examBestScores[trackSlug];
  if (prev !== undefined && prev >= percent) return state;
  return { ...state, examBestScores: { ...state.examBestScores, [trackSlug]: percent } };
}

export function recordCertExamScore(
  state: ProgressState,
  trackSlug: string,
  percent: number,
): ProgressState {
  const prev = state.certExamBestScores[trackSlug];
  if (prev !== undefined && prev >= percent) return state;
  return { ...state, certExamBestScores: { ...state.certExamBestScores, [trackSlug]: percent } };
}

export function isModuleCompleted(
  state: ProgressState,
  trackSlug: string,
  moduleSlug: string,
): boolean {
  return state.completedModules.includes(moduleKey(trackSlug, moduleSlug));
}

export function trackCompletion(state: ProgressState, track: Track): number {
  if (track.modules.length === 0) return 0;
  const done = track.modules.filter((m) => isModuleCompleted(state, track.slug, m.slug)).length;
  return Math.round((done / track.modules.length) * 100);
}

export function overallCompletion(state: ProgressState): number {
  const total = tracks.reduce((sum, t) => sum + t.modules.length, 0);
  if (total === 0) return 0;
  const done = tracks.reduce(
    (sum, t) => sum + t.modules.filter((m) => isModuleCompleted(state, t.slug, m.slug)).length,
    0,
  );
  return Math.round((done / total) * 100);
}

export function resetProgress(): ProgressState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // abaikan
  }
  return { ...EMPTY };
}
