import type { Question } from "../data/types";
// A subquestion must retain the givens from its parent when practiced on its own.
export function flattenQuestions(qs: Question[]): Question[] {
  return qs.flatMap((q) =>
    q.subquestions
      ? q.subquestions.map((child) => ({
          ...child,
          context: child.context ?? {
            question: q.question,
            english: q.english,
          },
        }))
      : [q],
  );
}
