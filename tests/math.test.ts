import { describe, it, expect } from "vitest";
import * as m from "../src/lib/math";
import reference from "../content/verification.json";

describe("확률 계산과 분포", () => {
  it("계승과 조합의 알려진 값과 경계", () => {
    expect(m.factorial(0)).toBe(1);
    expect(m.factorial(6)).toBe(720);
    expect(m.combination(20, 2)).toBe(190);
    expect(m.combination(6, 7)).toBe(0);
    expect(() => m.factorial(-1)).toThrow();
  });
  it.each([0, 0.1, 0.5, 0.9, 1])("베르누이 p=%s의 PMF와 모멘트", (p) => {
    const probs = [m.bernoulliPMF(0, p), m.bernoulliPMF(1, p)];
    expect(probs[0] + probs[1]).toBeCloseTo(1, 14);
    expect(m.expectedValue([0, 1], probs)).toBeCloseTo(p, 14);
    expect(m.variance([0, 1], probs)).toBeCloseTo(p * (1 - p), 14);
    expect(m.bernoulliCDF(0.5, p)).toBeCloseTo(1 - p, 14);
  });
  it.each([
    [4, 0.5],
    [20, 0.05],
    [50, 0.9],
  ])("이항 n=%s,p=%s의 전체 질량·모멘트", (n, p) => {
    const x = Array.from({ length: n + 1 }, (_, i) => i),
      probs = x.map((k) => m.binomialPMF(k, n, p));
    expect(probs.reduce((s, x) => s + x, 0)).toBeCloseTo(1, 12);
    expect(m.expectedValue(x, probs)).toBeCloseTo(n * p, 10);
    expect(m.variance(x, probs)).toBeCloseTo(n * p * (1 - p), 10);
  });
  it("이항 PMF/CDF와 포함 경계를 구별", () => {
    expect(m.binomialPMF(2, 4, 0.5)).toBeCloseTo(0.375, 14);
    expect(m.binomialCDF(2, 4, 0.5)).toBeCloseTo(0.6875, 14);
    expect(1 - m.binomialCDF(1, 4, 0.5)).toBeCloseTo(0.6875, 14);
    expect(1 - m.binomialCDF(2, 4, 0.5)).toBeCloseTo(0.3125, 14);
    expect(m.binomialPMF(0, 5, 0)).toBe(1);
    expect(m.binomialPMF(5, 5, 1)).toBe(1);
    expect(m.binomialCDF(-1, 5, 0.5)).toBe(0);
  });
  it.each([0.1, 1, 3, 20])("포아송 λ=%s의 질량과 모멘트", (lambda) => {
    const xs = Array.from({ length: 100 }, (_, i) => i),
      p = xs.map((x) => m.poissonPMF(x, lambda));
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
    expect(m.expectedValue(xs, p)).toBeCloseTo(lambda, 10);
    expect(m.variance(xs, p)).toBeCloseTo(lambda, 10);
  });
  it("포아송 알려진 값·경계·0 평균", () => {
    expect(m.poissonPMF(2, 3)).toBeCloseTo(0.22404180765538775, 12);
    expect(m.poissonCDF(3, 4)).toBeCloseTo(0.43347012036670896, 12);
    expect(m.poissonPMF(0, 0)).toBe(1);
    expect(m.poissonPMF(-1, 3)).toBe(0);
    expect(m.poissonCDF(-1, 3)).toBe(0);
  });
  it("베이즈와 조건부확률은 조건 방향을 보존", () => {
    expect(m.conditionalProbability(0.18, 0.3)).toBeCloseTo(0.6, 12);
    expect(m.conditionalProbability(0.18, 0.4)).toBeCloseTo(0.45, 12);
    expect(m.bayes(0.01, 0.9, 0.05)).toBeCloseTo(0.15384615384615385, 12);
    expect(() => m.conditionalProbability(0.1, 0)).toThrow();
    expect(() => m.conditionalProbability(0.3, 0.2)).toThrow();
  });
  it("기댓값, 함수의 기댓값, 분산과 선형변환", () => {
    expect(m.expectedValue([0, 2], [0.5, 0.5])).toBe(1);
    expect(m.expectedValue([0, 4], [0.5, 0.5])).toBe(2);
    expect(m.variance([0, 2], [0.5, 0.5])).toBe(1);
    expect(m.linearVariance(-3, 4)).toBe(36);
  });
  it.each([
    [-2, 0.02275013194817921],
    [-1, 0.15865525393145707],
    [0, 0.5],
    [1, 0.8413447460685429],
    [2, 0.9772498680518208],
  ])("정규 CDF z=%s의 독립 참고값", (z, p) => {
    expect(Math.abs(m.normalCDF(z) - p)).toBeLessThan(7.5e-8);
  });
  it("정규 PDF·분위수·원래 단위 복원", () => {
    expect(m.normalPDF(0)).toBeCloseTo(0.3989422804014327, 12);
    expect(m.normalQuantile(0.95)).toBeCloseTo(1.6448536269514715, 5);
    expect(m.normalQuantile(0.9, 50, 8)).toBeCloseTo(
      reference.originalC["original-2-C3-d"].quantile,
      5,
    );
    for (const p of [0.001, 0.05, 0.5, 0.95, 0.999])
      expect(m.normalCDF(m.normalQuantile(p))).toBeCloseTo(p, 8);
  });
  it("연속균등과 지수의 경계·단위", () => {
    expect(m.uniformCDF(5, 0, 10) - m.uniformCDF(2, 0, 10)).toBeCloseTo(
      0.3,
      14,
    );
    expect(m.uniformCDF(-5, 0, 10)).toBe(0);
    expect(m.uniformCDF(20, 0, 10)).toBe(1);
    expect(1 - m.exponentialCDF(0.5, 2)).toBeCloseTo(Math.exp(-1), 14);
    expect(
      (1 - m.exponentialCDF(3, 2)) / (1 - m.exponentialCDF(1, 2)),
    ).toBeCloseTo(1 - m.exponentialCDF(2, 2), 12);
  });
  it("유효하지 않은 모수·분포를 거절", () => {
    expect(() => m.binomialPMF(2, 4, 1.1)).toThrow();
    expect(() => m.binomialPMF(2, 4.5, 0.5)).toThrow();
    expect(() => m.poissonPMF(1, -1)).toThrow();
    expect(() => m.normalCDF(0, 0, 0)).toThrow();
    expect(() => m.exponentialCDF(2, 0)).toThrow();
    expect(() => m.uniformCDF(1, 2, 2)).toThrow();
    expect(() => m.variance([1, 2], [0.1, 0.1])).toThrow();
  });
});

describe("원문 기술통계와 강의 오류 검산", () => {
  const datasets = [
    [10, 12, 14, 16, 18, 20, 22, 40],
    [15, 18, 20, 22, 25, 27, 30, 43],
    [11, 12, 13, 13, 15, 16, 18, 19, 21, 48],
  ];
  it.each(datasets.map((x, i) => ({ x, i: i + 1 })))(
    "Practice Set $i의 C1 전체 계산",
    ({ x, i }) => {
      const data = reference.originalC as Record<
        string,
        Record<string, number>
      >;
      expect(m.mean(x)).toBeCloseTo(data[`original-${i}-C1-a`].mean, 12);
      expect(m.percentile(x, 0.5)).toBeCloseTo(
        data[`original-${i}-C1-a`].median,
        12,
      );
      expect(m.percentile(x, 0.25)).toBeCloseTo(
        data[`original-${i}-C1-b`].Q1,
        12,
      );
      expect(m.percentile(x, 0.75)).toBeCloseTo(
        data[`original-${i}-C1-b`].Q3,
        12,
      );
      expect(m.sampleVariance(x)).toBeCloseTo(
        data[`original-${i}-C1-c`].variance,
        10,
      );
    },
  );
  it("시험 type 6와 R 기본 type 7을 구분", () => {
    expect(m.percentile([10, 20, 30, 40, 50, 60, 70], 0.75)).toBe(60);
    expect(m.percentile([10, 20, 30, 40, 50, 60, 70], 0.75, 7)).toBe(55);
    expect(m.percentile([1, 2, 3, 4, 9], 0.25)).toBe(1.5);
  });
  it("강의 76·121쪽의 공분산 오류를 재현하고 교정", () => {
    const x = [10, 11, 12, 13, 14],
      y = [100, 95, 88, 82, 75];
    expect(m.sampleCovariance(x, y)).toBe(-15.75);
    expect(m.correlation(x, y)).toBeCloseTo(
      reference.lecture.correlation.correlation,
      12,
    );
    expect(m.sampleCovariance(x, y)).not.toBe(-15.5);
  });
  it("귀환 비행기 예제의 결합확률은 Fréchet 하한을 위반", () => {
    expect(reference.lecture.returningPlanes.givenJoint).toBeLessThan(
      reference.lecture.returningPlanes.minimumJoint,
    );
  });
});
