import type { Question, Response } from "../data/types";
import { flattenQuestions } from "./questionTree";
export interface Grade {
  earned: number;
  possible: number;
  pending: number;
  status: "correct" | "incorrect" | "pending" | "self";
}
export function gradeQuestion(q: Question, r?: Response): Grade {
  if (q.type === "written") {
    if (
      r?.selfScore !== undefined &&
      Number.isFinite(r.selfScore) &&
      r.selfScore >= 0 &&
      r.selfScore <= q.points
    )
      return {
        earned: r.selfScore,
        possible: q.points,
        pending: 0,
        status: "self",
      };
    return {
      earned: 0,
      possible: q.points,
      pending: q.points,
      status: "pending",
    };
  }
  const v = r?.value.trim() ?? "";
  let correct = false;
  if (v) {
    if (q.type === "numeric") {
      const valid = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(v);
      correct =
        valid &&
        Number.isFinite(Number(v)) &&
        Math.abs(Number(v) - Number(q.correctAnswer)) <= (q.tolerance ?? 1e-6);
    } else if (q.type === "tf") correct = v === String(q.correctAnswer);
    else correct = v === String(q.correctAnswer);
  }
  return {
    earned: correct ? q.points : 0,
    possible: q.points,
    pending: 0,
    status: correct ? "correct" : "incorrect",
  };
}
export function summarize(qs: Question[], answers: Record<string, Response>) {
  const flat = flattenQuestions(qs);
  const rows = flat.map((q) => ({
    q,
    grade: gradeQuestion(q, answers[q.questionId]),
  }));
  return {
    rows,
    total: rows.reduce((s, r) => s + r.q.points, 0),
    earned: rows.reduce((s, r) => s + r.grade.earned, 0),
    pending: rows.reduce((s, r) => s + r.grade.pending, 0),
    autoPossible: rows
      .filter((r) => r.q.type !== "written")
      .reduce((s, r) => s + r.q.points, 0),
    autoEarned: rows
      .filter((r) => r.q.type !== "written")
      .reduce((s, r) => s + r.grade.earned, 0),
    selfEarned: rows
      .filter((r) => r.grade.status === "self")
      .reduce((s, r) => s + r.grade.earned, 0),
    correct: rows.filter((r) => r.grade.status === "correct").length,
    autoCount: rows.filter((r) => r.q.type !== "written").length,
  };
}
