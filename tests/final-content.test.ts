import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  originalSets,
  flattenQuestions,
  questionById,
} from "../src/data/questions";
import { lessons, examLessons, lessonById } from "../src/data/lessons";
import { lecture6PageMap } from "../src/data/provenance";
import { isExamQuestion } from "../src/data/scope";
import { gradeQuestion, summarize } from "../src/lib/grading";
import {
  normalSafetyStock,
  normalCDF,
  normalQuantile,
  expectedValue,
  variance,
  binomialPMF,
  bayes,
} from "../src/lib/math";
import { initialState, parseBackup } from "../src/lib/storage";
import { createAttempt, submitAttempt } from "../src/lib/attempts";
import ref from "../content/verification.json";
import manifest from "../content/materials.json";

describe("최종 자료와 Lecture 6 범위", () => {
  it("8개 원본과 명시된 3개 발췌본의 해시가 일치", () => {
    expect(manifest).toHaveLength(11);
    expect(manifest.filter((m) => "derivedFrom" in m)).toHaveLength(3);
    for (const m of manifest)
      expect(
        createHash("sha256")
          .update(readFileSync(`public/materials/${m.file}`))
          .digest("hex"),
      ).toBe(m.sha256);
    expect(manifest.find((m) => m.file === "L4_Probability.pdf")?.pages).toBe(
      42,
    );
    expect(
      manifest.find((m) => m.file === "L5_Discrete_Random_Variables.pdf")
        ?.pages,
    ).toBe(41);
    expect(
      manifest.find((m) => m.file === "L6_Exam_Scope_Through_Normal.pdf")
        ?.pages,
    ).toBe(18);
  });
  it("L6 학습 출처는 1–18쪽, 지수분포는 별도 보충, 예제 링크는 실제 파일", () => {
    for (const id of Object.keys(lecture6PageMap)) {
      const l = lessonById[id];
      expect(l.lecture).toBe("Lecture 6");
      expect(l.references?.[0].file).toBe("L6_Continuous_Random_Variables.pdf");
      expect(l.references?.[0].pages.every((p) => p >= 1 && p <= 18)).toBe(
        true,
      );
      for (const example of l.originalExamples ?? [])
        expect(existsSync(`public/materials/${example.file}`)).toBe(true);
    }
    expect(lessons).toHaveLength(59);
    expect(examLessons).toHaveLength(58);
    expect(examLessons.some((l) => l.id === "exponential")).toBe(false);
    expect(lessonById.exponential.source).toContain("범위 밖");
  });
  it.each(originalSets)(
    "$title 범위 내 소문항 연습은 원문 ID·조건·배점을 보존",
    (s) => {
      const scoped = flattenQuestions(s.questions).filter(isExamQuestion);
      expect(scoped.length).toBeGreaterThan(20);
      expect(
        scoped.every(
          (q) => q.topicId !== "exponential" && q.autoGrade !== false,
        ),
      ).toBe(true);
      for (const q of scoped) {
        expect(q.points).toBe(questionById[q.questionId].points);
        if (q.questionId.includes("-C"))
          expect(q.context?.english).toBeTruthy();
      }
    },
  );
});

describe("추가 원본의 계산 및 기호 누락 처리", () => {
  it("Set4 표본분산과 Set5 보완 지지집합의 모멘트를 독립값과 대조", () => {
    expect(ref.originalC["original-4-C1-c"].variance).toBeCloseTo(506 / 7, 12);
    const xs = [-30, 10, 50, 90],
      ps = [0.1, 0.4, 0.3, 0.2];
    expect(expectedValue(xs, ps)).toBe(ref.originalC["original-5-C3-a"].mean);
    expect(variance(xs, ps)).toBe(ref.originalC["original-5-C3-a"].variance);
    expect(lessonById[questionById["original-5-C3-a"].topicId]).toBeDefined();
    expect(questionById["original-5-C3-a"].sourceIssue).toBeTruthy();
  });
  it("Set5 이항과 두 양성 후 베이즈를 독립 계산과 대조", () => {
    expect(binomialPMF(2, 12, 0.1)).toBeCloseTo(
      ref.originalC["original-5-C1-a"].probability,
      12,
    );
    expect(bayes(0.04, 0.92 ** 2, 0.07 ** 2)).toBeCloseTo(
      ref.originalC["original-5-C2-c"].probability,
      12,
    );
  });
  it("Set4 MC10의 변환과 Set5 MC6의 부호 누락은 산포 결과에 영향 없음", () => {
    expect(
      questionById["original-4-MC10"].options?.[
        Number(questionById["original-4-MC10"].correctAnswer)
      ],
    ).toBe("18");
    expect(ref.objective45["5"].MC[5]).toBe(4 * 3 ** 2 + 4 ** 2);
  });
  it("Set4 모든 객관식·참거짓과 Set5 유효 문항은 독립값과 일치", () => {
    for (const n of [4, 5] as const) {
      const s = originalSets[n - 1];
      for (const q of s.questions.filter(
        (q) => q.part !== "C" && q.autoGrade !== false,
      )) {
        const i = Number(q.questionId.match(/(?:MC|TF)(\d+)$/)![1]) - 1;
        const r = ref.objective45[String(n) as "4" | "5"];
        if (q.type === "tf") expect(q.correctAnswer).toBe(r.TF[i]);
        else {
          const option = q.options![Number(q.correctAnswer)];
          const value = option.includes("/")
            ? option
                .split("/")
                .map(Number)
                .reduce((a, b) => a / b)
            : Number(option);
          expect(Math.abs(value-r.MC[i])).toBeLessThanOrEqual(.000051);
        }
      }
    }
  });
  it.each(["original-5-MC4", "original-5-TF10"])(
    "%s 원본 키로 자동 정답 처리하지 않고 보류",
    (id) => {
      const q = questionById[id];
      expect(q.autoGrade).toBe(false);
      expect(gradeQuestion(q, { value: String(q.correctAnswer) }).status).toBe(
        "pending",
      );
      expect(gradeQuestion(q, { value: String(q.correctAnswer) }).pending).toBe(
        q.points,
      );
    },
  );
  it("보류 배점을 자동점수에서 제외하고 자가평가·백업 복원을 지원", () => {
    const qs = [
      questionById["original-5-MC4"],
      questionById["original-5-TF10"],
    ];
    const summary = summarize(qs, {});
    expect(summary).toMatchObject({
      total: 5,
      pending: 5,
      autoPossible: 0,
      autoCount: 0,
    });
    const state = initialState();
    state.activeAttempt = createAttempt(qs, "practice", "original-5");
    const saved = submitAttempt(state);
    saved.attempts[0].answers[qs[0].questionId] = { value: "2", selfScore: 1 };
    const restored = parseBackup(JSON.stringify(saved));
    expect(summarize(qs, restored.attempts[0].answers)).toMatchObject({
      autoEarned: 0,
      selfEarned: 1,
      pending: 3,
    });
  });
});

describe("Lecture 6 정규 계산", () => {
  it("역 CDF의 중앙·꼬리 근사는 Python NormalDist 14개 값과 일치", () => {
    for (const [p, z] of Object.entries(ref.lecture6.inverseReferences))
      expect(normalQuantile(Number(p))).toBeCloseTo(z, 7);
  });
  it("주간 매출 확률과 역 CDF는 독립 NormalDist 값과 일치", () => {
    expect(normalCDF(20000, 25000, 4000)).toBeCloseTo(
      ref.lecture6.weeklyRevenue.below20000,
      6,
    );
    expect(
      normalCDF(28000, 25000, 4000) - normalCDF(22000, 25000, 4000),
    ).toBeCloseTo(ref.lecture6.weeklyRevenue.between22000and28000, 6);
    expect(normalQuantile(0.9, 100, 15)).toBeCloseTo(
      ref.lecture6.normalQuantile.q90,
      4,
    );
  });
  it("원문의 근사623과 목표를 만족하는 정수624를 구분", () => {
    const answer = normalSafetyStock(500, 60, 0.02);
    expect(answer.continuous).toBeCloseTo(ref.lecture6.stock.continuous, 4);
    expect(answer.integer).toBe(624);
    expect(answer.shortage).toBeLessThan(0.02);
    expect(1 - normalCDF(answer.integer - 1, 500, 60)).toBeGreaterThan(0.02);
    expect(normalSafetyStock(500, 60, 0.5).integer).toBe(500);
    expect(normalSafetyStock(0, 1, 0.9).integer).toBe(0);
  });
  it("무효한 재고 입력은 계산하지 않음", () => {
    for (const [mu, sd, a] of [
      [500, 0, 0.02],
      [-1, 60, 0.02],
      [500, 60, 0],
      [500, 60, 1],
      [NaN, 60, 0.02],
    ])
      expect(() => normalSafetyStock(mu, sd, a)).toThrow();
  });
});
