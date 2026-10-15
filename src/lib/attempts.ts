import type { Attempt, Question, StudyState } from "../data/types";
import { questionById } from "../data/questions";
import { summarize } from "./grading";
export function createAttempt(
  qs: Question[],
  mode: string,
  setId: string,
  minutes = 60,
  now = Date.now(),
): Attempt {
  if (!qs.length) throw new Error("선택된 문제가 없습니다.");
  return {
    id: crypto.randomUUID(),
    setId,
    mode,
    questionIds: qs.map((q) => q.questionId),
    currentIndex: 0,
    answers: {},
    startedAt: now,
    deadline: mode === "exam" ? now + minutes * 60000 : null,
    submittedAt: null,
  };
}
export function submitAttempt(s: StudyState, now = Date.now()): StudyState {
  const a = s.activeAttempt;
  if (!a) return s;
  const submitted = { ...a, submittedAt: now };
  const { rows } = summarize(
    a.questionIds.map((id) => questionById[id]),
    a.answers,
  );
  const attemptedIds = new Set(
    rows.filter((r) => r.grade.status !== "pending").map((r) => r.q.questionId),
  );
  const wrong = rows
    .filter((r) => r.grade.status === "incorrect")
    .map((r) => r.q.questionId);
  return {
    ...s,
    activeAttempt: null,
    attempts: [...s.attempts, submitted],
    weak: [
      ...new Set([...s.weak.filter((id) => !attemptedIds.has(id)), ...wrong]),
    ],
  };
}
