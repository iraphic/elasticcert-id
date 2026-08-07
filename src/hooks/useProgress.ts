import { useSyncExternalStore, useCallback } from "react";
import {
  loadProgress,
  saveProgress,
  markModuleCompleted,
  unmarkModuleCompleted,
  recordQuizScore,
  recordExamScore,
  recordCertExamScore,
  resetProgress as resetStoredProgress,
  type ProgressState,
} from "../lib/progress";

let current: ProgressState = loadProgress();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ProgressState {
  return current;
}

function update(next: ProgressState) {
  current = next;
  saveProgress(next);
  listeners.forEach((l) => l());
}

export function useProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot);

  const completeModule = useCallback((trackSlug: string, moduleSlug: string) => {
    update(markModuleCompleted(current, trackSlug, moduleSlug));
  }, []);

  const uncompleteModule = useCallback((trackSlug: string, moduleSlug: string) => {
    update(unmarkModuleCompleted(current, trackSlug, moduleSlug));
  }, []);

  const saveQuizScore = useCallback(
    (trackSlug: string, moduleSlug: string, percent: number) => {
      let next = recordQuizScore(current, trackSlug, moduleSlug, percent);
      if (percent >= 70) {
        next = markModuleCompleted(next, trackSlug, moduleSlug);
      }
      update(next);
    },
    [],
  );

  const saveExamScore = useCallback((trackSlug: string, percent: number) => {
    update(recordExamScore(current, trackSlug, percent));
  }, []);

  const saveCertExamScore = useCallback((trackSlug: string, percent: number) => {
    update(recordCertExamScore(current, trackSlug, percent));
  }, []);

  const reset = useCallback(() => {
    update(resetStoredProgress());
  }, []);

  return {
    state,
    completeModule,
    uncompleteModule,
    saveQuizScore,
    saveExamScore,
    saveCertExamScore,
    reset,
  };
}
