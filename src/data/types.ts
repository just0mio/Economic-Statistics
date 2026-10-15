export type Difficulty = "basic" | "intermediate" | "advanced";
export type QuestionType = "mcq" | "tf" | "numeric" | "written";
export interface Lesson {
  id: string;
  chapterId: number;
  title: string;
  english: string;
  summary: string;
  explanation: string[];
  definition: string;
  formula: string;
  symbols: string;
  derivation: string[];
  example: { question: string; steps: string[]; answer: string };
  application: string;
  pitfalls: string[];
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  source: string;
  sourcePage: number | null;
  lecture: string | null;
  references?: { file: string; pages: number[]; label: string }[];
  originalExamples?: {
    title: string;
    page: number;
    text: string;
    note?: string;
  }[];
  code?: { program: string; output: string; explanation: string };
  distribution?:
    "bernoulli" | "binomial" | "poisson" | "uniform" | "normal" | "exponential";
}
export interface Chapter {
  id: number;
  title: string;
  english: string;
  description: string;
  color: string;
  icon: string;
}
export interface Question {
  context?: { question: string; english: string };
  questionId: string;
  setId: string;
  chapterId: number;
  topicId: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  english: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  points: number;
  source: string;
  sourcePage: number | null;
  sourceFile?: string;
  sourceAnswer?: string;
  answerPage?: number;
  requiresExplanation?: boolean;
  part: "A" | "B" | "C";
  tolerance?: number;
  subquestions?: Question[];
  rubric?: string[];
}
export interface PracticeSet {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  minutes: number;
  questions: Question[];
  original?: boolean;
}
export interface Response {
  value: string;
  reason?: string;
  selfScore?: number;
}
export interface Attempt {
  id: string;
  setId: string;
  mode: string;
  questionIds: string[];
  currentIndex?: number;
  answers: Record<string, Response>;
  startedAt: number;
  deadline: number | null;
  submittedAt: number | null;
}
export interface StudyState {
  version: 1;
  completed: string[];
  bookmarks: string[];
  weak: string[];
  lastLesson: string | null;
  attempts: Attempt[];
  activeAttempt: Attempt | null;
  theme: "light" | "dark";
}
