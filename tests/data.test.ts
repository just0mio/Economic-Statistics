import { describe, it, expect } from "vitest";
import katex from "katex";
import {
  practiceSets,
  originalSets,
  supplementarySets,
  flattenQuestions,
  allQuestions,
  questionById,
} from "../src/data/questions";
import { lessons, lessonById } from "../src/data/lessons";
import { gradeQuestion, summarize } from "../src/lib/grading";
import sourceData from "../content/extracted-practice.json";
import reference from "../content/verification.json";
import * as math from "../src/lib/math";
describe("문항 수·배점·출처 무결성", () => {
  it("원본 5세트와 보충 5세트는 구별", () => {
    expect(originalSets).toHaveLength(5);
    expect(supplementarySets).toHaveLength(5);
    expect(practiceSets).toHaveLength(10);
    expect(originalSets.every((s) => s.original)).toBe(true);
  });
  it.each(practiceSets)("$title 형식은 10/10/3, 20/30/50, 100점", (s) => {
    expect(s.questions.filter((q) => q.part === "A")).toHaveLength(10);
    expect(s.questions.filter((q) => q.part === "B")).toHaveLength(10);
    expect(s.questions.filter((q) => q.part === "C")).toHaveLength(3);
    expect(s.questions.reduce((t, q) => t + q.points, 0)).toBe(100);
    for (const [part, total] of [
      ["A", 20],
      ["B", 30],
      ["C", 50],
    ] as const)
      expect(
        s.questions
          .filter((q) => q.part === part)
          .reduce((t, q) => t + q.points, 0),
      ).toBe(total);
    for (const q of s.questions.filter((q) => q.subquestions))
      expect(q.subquestions!.reduce((t, c) => t + c.points, 0)).toBe(q.points);
  });
  it("대문항·소문항 ID는 전역에서 유일하며 개념 연결은 유효", () => {
    const all = [
      ...allQuestions,
      ...allQuestions.flatMap((q) => q.subquestions ?? []),
    ];
    expect(new Set(all.map((q) => q.questionId)).size).toBe(all.length);
    for (const q of all) {
      expect(lessonById[q.topicId]).toBeDefined();
      expect(q.chapterId).toBe(lessonById[q.topicId].chapterId);
      expect(q.question.trim()).not.toBe("");
      expect(q.explanation.trim()).not.toBe("");
      if (q.type === "mcq")
        expect(q.options?.[Number(q.correctAnswer)]).toBeDefined();
    }
  });
  it("서술형 소문항을 복습해도 대문항의 자료·조건을 유지", () => {
    for (const parent of allQuestions.filter((q) => q.subquestions)) {
      for (const child of flattenQuestions([parent])) {
        expect(child.context?.question).toBe(parent.question);
        expect(child.context?.english).toBe(parent.english);
        expect(questionById[child.questionId].context).toEqual(child.context);
      }
    }
    expect(
      summarize(originalSets[0].questions, {}).rows.find(
        (r) => r.q.questionId === "original-1-C2-a",
      )?.q.context?.question,
    ).toContain("감염률 20%");
  });
  it.each(originalSets)("$title 영어 원문·선택지·원본 정답·배점 보존", (s) => {
    const src = sourceData[Number(s.id.at(-1)) - 1];
    for (const q of s.questions.filter((q) => q.part !== "C")) {
      const origin = src.objective.find((o) => q.questionId.endsWith(o.id))!;
      expect(q.english).toBe(origin.question);
      expect(q.correctAnswer).toBe(origin.answer);
      expect(q.sourcePage).toBe(origin.page);
      expect(q.sourceAnswer).toBe(origin.explanation);
      if (q.type === "mcq") expect(q.options).toEqual(origin.options);
    }
    for (const parent of s.questions.filter((q) => q.part === "C")) {
      const origin = src.written.find((o) => parent.questionId.endsWith(o.id))!;
      expect(parent.english).toBe(origin.question);
      parent.subquestions!.forEach((q, i) => {
        expect(q.english).toBe(origin.subs[i].question);
        expect(q.sourceAnswer).toBe(origin.subs[i].answer);
        expect(q.points).toBe(origin.subs[i].points);
      });
    }
  });
  it.each(originalSets)(
    "$title 원본 수치 정답은 독립 Python 계산과 일치",
    (s) => {
      for (const q of flattenQuestions(s.questions).filter(
        (q) => q.type === "numeric",
      )) {
        const refs = reference.originalC as Record<
          string,
          Record<string, number>
        >;
        expect(Number(q.correctAnswer)).toBeCloseTo(
          refs[q.questionId].probability,
          12,
        );
        expect(
          gradeQuestion(q, { value: Number(q.correctAnswer).toFixed(4) })
            .status,
        ).toBe("correct");
      }
    },
  );
  it("세트 1–5 객관식 키의 원문 대조", () => {
    const keys = [
      "BBCBCBBCBA",
      "CCCB BCC AAB".replaceAll(" ", ""),
      "BCCCDBBBCB",
      "BCBCBCABCC",
      "CDBCCCBCAB",
    ];
    originalSets.forEach((s, i) =>
      expect(
        s.questions
          .filter((q) => q.part === "A")
          .map((q) => "ABCD"[Number(q.correctAnswer)])
          .join(""),
      ).toBe(keys[i]),
    );
  });
  it("세트 1–5 참거짓 키의 원문 대조", () => {
    const keys = [
      "FTFTFTTFFT",
      "TFFTFTTFTF",
      "FFTFTFTTTT",
      "TFTFTFTFTF",
      "TFTFFTTTFT",
    ];
    originalSets.forEach((s, i) =>
      expect(
        s.questions
          .filter((q) => q.part === "B")
          .map((q) => (q.correctAnswer ? "T" : "F"))
          .join(""),
      ).toBe(keys[i]),
    );
  });
});
describe("원본 계산 답안의 재검산", () => {
  it.each([
    { i: 1, x: [0, 1, 2, 3], p: [0.1, 0.4, 0.4, 0.1] },
    { i: 2, x: [0, 1, 2, 3], p: [0.15, 0.35, 0.35, 0.15] },
    { i: 3, x: [-20, 0, 40, 100], p: [0.2, 0.3, 0.4, 0.1] },
  ])("Set $i C3 모멘트", ({ i, x, p }) => {
    const refs = reference.originalC as Record<string, Record<string, number>>;
    expect(math.expectedValue(x, p)).toBeCloseTo(
      refs[`original-${i}-C3-a`].mean,
      12,
    );
    expect(math.variance(x, p)).toBeCloseTo(
      refs[`original-${i}-C3-a`].variance,
      10,
    );
  });
  it("원본 정규 답안의 반올림표와 수치함수 차이는 표시 정밀도 차이", () => {
    expect(1 - math.normalCDF(1.5)).toBeCloseTo(0.06680720126885809, 6);
    expect(math.normalQuantile(0.9, 50, 8)).toBeCloseTo(60.25241252435681, 5);
    expect(reference.originalC["original-2-C3-d"].pdfTableQuantile).toBe(
      60.2528,
    );
  });
});
describe("학습 콘텐츠", () => {
  it("모든 개념에 11단계 학습 구조와 유효한 수식·퀴즈가 있다", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(55);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
    for (const l of lessons) {
      expect(l.summary).toBeTruthy();
      expect(l.explanation.join("").length).toBeGreaterThan(150);
      expect(l.definition).toBeTruthy();
      expect(l.symbols).toBeTruthy();
      expect(l.derivation.length).toBeGreaterThan(0);
      expect(l.example.steps.length).toBeGreaterThan(0);
      expect(l.application).toBeTruthy();
      expect(l.pitfalls.length).toBeGreaterThan(0);
      expect(l.quiz.options[l.quiz.answer]).toBeTruthy();
      expect(() =>
        katex.renderToString(l.formula, { throwOnError: true }),
      ).not.toThrow();
      expect(l.references?.length).toBeGreaterThan(0);
    }
  });
  it("확률분포와 손글씨 조건부기댓값의 실제 PDF 페이지를 연결", () => {
    expect(lessonById.quantiles.references?.[0].label).toContain("34장");
    expect(lessonById.quantiles.references?.[1].label).toContain("45장");
    expect(lessonById.quantiles.references?.[1].pages).toContain(99);
    expect(lessonById.bernoulli.references?.[0].pages).toContain(254);
    expect(lessonById.binomial.references?.[0].pages).toContain(255);
    expect(lessonById.poisson.references?.[0].pages).toContain(259);
    expect(lessonById["conditional-expectation"].sourcePage).toBe(242);
    expect(
      lessonById["total-expectation"].originalExamples?.[0].note,
    ).toContain("보충");
    expect(lessonById.normal.references?.[0].file).toBe(
      "L6_Continuous_Random_Variables.pdf",
    );
  });
  it("문항의 개념퀴즈와 수식문제가 모두 실제 개념에 연결", () => {
    expect(questionById["concept-bernoulli"].correctAnswer).toBe(1);
    expect(questionById["formula-binomial"].type).toBe("written");
  });
});
describe("채점", () => {
  it("설명형 답을 자동 정답 처리하지 않는다", () => {
    const q = questionById["original-1-C1-a"];
    expect(gradeQuestion(q, { value: String(q.correctAnswer) })).toEqual({
      earned: 0,
      possible: 5,
      pending: 5,
      status: "pending",
    });
    expect(gradeQuestion(q, { value: "풀이", selfScore: 4 }).status).toBe(
      "self",
    );
    expect(gradeQuestion(q, { value: "풀이", selfScore: 100 }).status).toBe(
      "pending",
    );
  });
  it("수치형 허용오차와 잘못된 문자열을 구분", () => {
    const q = questionById["original-1-C2-a"];
    expect(gradeQuestion(q, { value: ".2400" }).earned).toBe(5);
    expect(gradeQuestion(q, { value: ".25" }).earned).toBe(0);
    for (const value of ["", "0.24abc", "Infinity", "NaN", "0x0"])
      expect(gradeQuestion(q, { value }).earned).toBe(0);
  });
  it("완벽한 자동답안에도 미채점 배점을 남긴다", () => {
    const s = originalSets[0],
      flat = flattenQuestions(s.questions),
      answers = Object.fromEntries(
        flat.map((q) => [q.questionId, { value: String(q.correctAnswer) }]),
      );
    const result = summarize(s.questions, answers);
    expect(result.total).toBe(100);
    expect(result.autoEarned).toBe(70);
    expect(result.pending).toBe(30);
    expect(result.correct).toBe(24);
  });
});
