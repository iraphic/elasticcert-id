import type { CodeExample } from "../data/types";

export interface ShuffledQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  scenario?: string;
  contextCode?: CodeExample;
}

interface Shuffleable {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  scenario?: string;
  contextCode?: CodeExample;
}

/** Fisher-Yates shuffle (returns a new array; does not mutate input). */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Shuffle question order and each question's options, remapping the correct answer index. */
export function shuffleQuestions<T extends Shuffleable>(
  questions: readonly T[],
): ShuffledQuestion[] {
  return shuffleArray(questions).map((q) => {
    const order = shuffleArray(q.options.map((_, i) => i));
    const result: ShuffledQuestion = {
      id: q.id,
      prompt: q.prompt,
      options: order.map((i) => q.options[i]),
      answerIndex: order.indexOf(q.answerIndex),
      explanation: q.explanation,
    };
    if (q.scenario !== undefined) result.scenario = q.scenario;
    if (q.contextCode !== undefined) result.contextCode = q.contextCode;
    return result;
  });
}

/** Take a random subset of `count` questions (shuffled, with shuffled options). */
export function sampleQuestions<T extends Shuffleable>(
  questions: readonly T[],
  count: number,
): ShuffledQuestion[] {
  return shuffleQuestions(shuffleArray(questions).slice(0, Math.min(count, questions.length)));
}
