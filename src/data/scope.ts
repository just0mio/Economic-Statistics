export const examScopeLabel = "Lecture 1–5 · Lecture 6 정규분포까지 (1–18쪽)";
export function isExamTopic(topic: string): boolean {
  return topic !== "exponential";
}
export function isExamQuestion(q: {
  topicId: string;
  autoGrade?: boolean;
}): boolean {
  return isExamTopic(q.topicId) && q.autoGrade !== false;
}
