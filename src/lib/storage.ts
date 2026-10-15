import type { Attempt, StudyState } from "../data/types";
import { lessonById } from "../data/lessons";
import { flattenQuestions, questionById } from "../data/questions";
export const STORAGE_KEY = "lese152-studio-v1";
export function initialState(): StudyState {
  return {
    version: 1,
    completed: [],
    bookmarks: [],
    weak: [],
    lastLesson: null,
    attempts: [],
    activeAttempt: null,
    theme: "light",
  };
}
const object = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);
function ids(x: unknown, known: Record<string, unknown>): x is string[] {
  return (
    Array.isArray(x) &&
    x.length < 10000 &&
    x.every((v) => typeof v === "string" && Object.hasOwn(known, v)) &&
    new Set(x).size === x.length
  );
}
function validAttempt(a: unknown): a is Attempt {
  if (
    !object(a) ||
    typeof a.id !== "string" ||
    a.id.length > 100 ||
    typeof a.setId !== "string" ||
    typeof a.mode !== "string" ||
    !["practice", "exam", "chapter", "weak", "formula", "identify"].includes(
      a.mode,
    )
  )
    return false;
  if (
    !ids(a.questionIds, questionById) ||
    a.questionIds.length === 0 ||
    !object(a.answers)
  )
    return false;
  if (
    a.currentIndex !== undefined &&
    (typeof a.currentIndex !== "number" ||
      !Number.isInteger(a.currentIndex) ||
      a.currentIndex < 0 ||
      a.currentIndex >= a.questionIds.length)
  )
    return false;
  if (
    typeof a.startedAt !== "number" ||
    !Number.isFinite(a.startedAt) ||
    a.startedAt < 0
  )
    return false;
  if (
    a.deadline !== null &&
    (typeof a.deadline !== "number" ||
      !Number.isFinite(a.deadline) ||
      a.deadline < a.startedAt)
  )
    return false;
  if (a.mode === "exam" && a.deadline === null) return false;
  if (
    a.submittedAt !== null &&
    (typeof a.submittedAt !== "number" ||
      !Number.isFinite(a.submittedAt) ||
      a.submittedAt < a.startedAt)
  )
    return false;
  const flat = flattenQuestions(a.questionIds.map((id) => questionById[id]));
  if (new Set(flat.map((q) => q.questionId)).size !== flat.length) return false;
  const allowed = new Set(flat.map((q) => q.questionId));
  return Object.entries(a.answers).every(([id, r]) => {
    if (
      !allowed.has(id) ||
      !object(r) ||
      typeof r.value !== "string" ||
      r.value.length > 50000 ||
      (r.reason !== undefined &&
        (typeof r.reason !== "string" || r.reason.length > 50000))
    )
      return false;
    return (
      r.selfScore === undefined ||
      (a.submittedAt !== null &&
        questionById[id].type === "written" &&
        typeof r.selfScore === "number" &&
        Number.isFinite(r.selfScore) &&
        r.selfScore >= 0 &&
        r.selfScore <= questionById[id].points)
    );
  });
}
export function parseBackup(raw: string): StudyState {
  if (raw.length > 5_000_000) throw new Error("백업은 5MB 이하여야 합니다.");
  const s: unknown = JSON.parse(raw);
  if (
    !object(s) ||
    s.version !== 1 ||
    !ids(s.completed, lessonById) ||
    !ids(s.bookmarks, questionById) ||
    !ids(s.weak, questionById) ||
    !(
      s.lastLesson === null ||
      (typeof s.lastLesson === "string" &&
        Object.hasOwn(lessonById, s.lastLesson))
    ) ||
    !["light", "dark"].includes(String(s.theme)) ||
    !Array.isArray(s.attempts) ||
    s.attempts.length > 2000 ||
    !s.attempts.every((a) => validAttempt(a) && a.submittedAt !== null) ||
    !(
      s.activeAttempt === null ||
      (validAttempt(s.activeAttempt) && s.activeAttempt.submittedAt === null)
    )
  )
    throw new Error(
      "올바른 LESE152 v1 백업 파일이 아닙니다. 기존 데이터는 유지됩니다.",
    );
  const attemptIds = s.attempts.map((a) => a.id);
  if (
    new Set(attemptIds).size !== attemptIds.length ||
    (s.activeAttempt && attemptIds.includes((s.activeAttempt as Attempt).id))
  )
    throw new Error("시험 기록 ID가 중복되어 있습니다.");
  // Pick supported fields. Unknown backup metadata never enters application state.
  return {
    version: 1,
    completed: s.completed,
    bookmarks: s.bookmarks,
    weak: s.weak,
    lastLesson: s.lastLesson as string | null,
    attempts: s.attempts as Attempt[],
    activeAttempt: s.activeAttempt as Attempt | null,
    theme: s.theme as StudyState["theme"],
  };
}
export function loadState(storage: Pick<Storage, "getItem">): {
  state: StudyState;
  error: string;
} {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return { state: raw ? parseBackup(raw) : initialState(), error: "" };
  } catch {
    return {
      state: initialState(),
      error:
        "저장된 데이터를 읽지 못했습니다. 기존 저장값은 덮어쓰지 않았습니다. 설정에서 올바른 백업을 복원하거나 초기화하세요.",
    };
  }
}
export function remainingSeconds(
  deadline: number | null,
  now = Date.now(),
): number | null {
  return deadline === null
    ? null
    : Math.max(0, Math.ceil((deadline - now) / 1000));
}
