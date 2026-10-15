import { describe, it, expect } from "vitest";
import {
  initialState,
  parseBackup,
  loadState,
  remainingSeconds,
} from "../src/lib/storage";
import { createAttempt, submitAttempt } from "../src/lib/attempts";
import { originalSets, questionById } from "../src/data/questions";
describe("진도·백업·시험 복원", () => {
  it("완료·북마크·오답·답안·현재 위치·절대 마감시간을 보존", () => {
    const a = createAttempt(
      originalSets[0].questions,
      "exam",
      "original-1",
      90,
      1000,
    );
    a.currentIndex = 20;
    a.answers["original-1-MC1"] = { value: "1" };
    a.answers["original-1-TF1"] = {
      value: "false",
      reason: "명목형 식별자이다.",
    };
    const s = {
      ...initialState(),
      completed: ["bernoulli"],
      lastLesson: "bernoulli",
      bookmarks: ["original-1-MC1"],
      weak: ["original-1-MC2"],
      activeAttempt: a,
    };
    const restored = parseBackup(JSON.stringify(s));
    expect(restored).toEqual(s);
    expect(restored.activeAttempt?.deadline).toBe(5401000);
    expect(restored.activeAttempt?.currentIndex).toBe(20);
  });
  it("마감시간 경과는 새로고침으로 늘어나지 않는다", () => {
    expect(remainingSeconds(61000, 1000)).toBe(60);
    expect(remainingSeconds(61000, 60500)).toBe(1);
    expect(remainingSeconds(61000, 62000)).toBe(0);
    expect(remainingSeconds(null)).toBeNull();
  });
  it("손상된 저장값은 오류를 알리고 자동 덮어쓰지 않는다", () => {
    let raw = "{bad json";
    const loaded = loadState({ getItem: () => raw });
    expect(loaded.error).toContain("덮어쓰지");
    expect(loaded.state).toEqual(initialState());
    expect(raw).toBe("{bad json");
  });
  it("알 수 없는 ID·상속 속성·잘못된 점수·중복 답안을 거절", () => {
    for (const id of ["unknown", "constructor", "__proto__"])
      expect(() =>
        parseBackup(JSON.stringify({ ...initialState(), completed: [id] })),
      ).toThrow();
    const a = createAttempt(
      originalSets[0].questions,
      "exam",
      "original-1",
      90,
      1000,
    );
    a.answers["original-1-C1-a"] = { value: "풀이", selfScore: 5 };
    expect(() =>
      parseBackup(JSON.stringify({ ...initialState(), activeAttempt: a })),
    ).toThrow();
    a.answers = {};
    a.currentIndex = 100;
    expect(() =>
      parseBackup(JSON.stringify({ ...initialState(), activeAttempt: a })),
    ).toThrow();
    a.currentIndex = 0;
    a.questionIds.push(a.questionIds[0]);
    expect(() =>
      parseBackup(JSON.stringify({ ...initialState(), activeAttempt: a })),
    ).toThrow();
  });
  it("다른 문항의 답안과 허용 범위 밖 자가점수를 거절", () => {
    const a = createAttempt(
      [questionById["original-1-MC1"]],
      "practice",
      "original-1",
      60,
      1000,
    );
    a.answers["original-1-MC2"] = { value: "0" };
    expect(() =>
      parseBackup(JSON.stringify({ ...initialState(), activeAttempt: a })),
    ).toThrow();
    const b = {
      ...createAttempt(
        [questionById["original-1-C1-a"]],
        "practice",
        "original-1",
        60,
        1000,
      ),
      submittedAt: 2000,
      answers: { "original-1-C1-a": { value: "풀이", selfScore: 6 } },
    };
    expect(() =>
      parseBackup(JSON.stringify({ ...initialState(), attempts: [b] })),
    ).toThrow();
  });
  it("제출은 오답을 기록하고 같은 문제의 정답 재풀이는 오답 목록에서 제거", () => {
    let s = initialState();
    const q = questionById["original-1-MC1"];
    s = {
      ...s,
      activeAttempt: createAttempt([q], "practice", "original-1", 60, 1000),
    };
    s.activeAttempt!.answers[q.questionId] = { value: "0" };
    s = submitAttempt(s, 2000);
    expect(s.weak).toEqual([q.questionId]);
    expect(s.attempts).toHaveLength(1);
    s = { ...s, activeAttempt: createAttempt([q], "weak", "weak", 60, 3000) };
    s.activeAttempt!.answers[q.questionId] = { value: String(q.correctAnswer) };
    s = submitAttempt(s, 4000);
    expect(s.weak).toEqual([]);
    expect(s.attempts).toHaveLength(2);
    expect(s.activeAttempt).toBeNull();
    expect(parseBackup(JSON.stringify(s))).toEqual(s);
  });
});
