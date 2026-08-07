import type { Module, Track } from "./types";
import { engineerTrack } from "./tracks/engineer";
import { observabilityTrack } from "./tracks/observability";
import { detectionTrack } from "./tracks/detection";

export const tracks: Track[] = [engineerTrack, observabilityTrack, detectionTrack];

export { certExams, getCertExam } from "./certExams";

export function getTrack(slug: string): Track | undefined {
  return tracks.find((t) => t.slug === slug);
}

export function getModule(
  trackSlug: string,
  moduleSlug: string,
): { track: Track; module: Module } | undefined {
  const track = getTrack(trackSlug);
  if (!track) return undefined;
  const module = track.modules.find((m) => m.slug === moduleSlug);
  if (!module) return undefined;
  return { track, module };
}

export function getAdjacentModules(
  track: Track,
  moduleSlug: string,
): { prev?: Module; next?: Module } {
  const idx = track.modules.findIndex((m) => m.slug === moduleSlug);
  return {
    prev: idx > 0 ? track.modules[idx - 1] : undefined,
    next: idx >= 0 && idx < track.modules.length - 1 ? track.modules[idx + 1] : undefined,
  };
}
