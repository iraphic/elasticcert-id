export type Level = "Dasar" | "Menengah" | "Lanjutan" | "Siap Ujian";

export interface CodeExample {
  title: string;
  lang: "json" | "bash" | "yaml";
  code: string;
}

export interface Section {
  heading: string;
  paragraphs: string[];
  codeExample?: CodeExample;
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Module {
  slug: string;
  title: string;
  level: Level;
  durationMinutes: number;
  intro: string;
  sections: Section[];
  keyPoints: string[];
  quiz: Question[];
}

export interface ExamInfo {
  questionCount: number;
  durationMinutes: number;
  passingScore: number;
}

export interface CertQuestion {
  id: string;
  scenario: string;
  contextCode?: CodeExample;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface CertExam {
  slug: string;
  trackSlug: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  questions: CertQuestion[];
}

export interface Track {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  audience: string;
  color: "teal" | "amber" | "rose";
  icon: "server" | "activity" | "shield";
  examInfo: ExamInfo;
  modules: Module[];
  examQuestions: Question[];
}
