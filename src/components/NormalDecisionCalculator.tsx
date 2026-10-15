import { useState } from "react";
import { normalCDF, normalSafetyStock } from "../lib/math";

export function NormalDecisionCalculator() {
  const [mu, setMu] = useState("500"),
    [sigma, setSigma] = useState("60"),
    [target, setTarget] = useState("2"),
    [current, setCurrent] = useState("550");
  let result: ReturnType<typeof normalSafetyStock> | null = null;
  if ([mu, sigma, target, current].every((x) => x.trim() !== "")) {
    try {
      result = normalSafetyStock(
        Number(mu),
        Number(sigma),
        Number(target) / 100,
      );
    } catch {
      /* Show input guidance below. */
    }
  }
  const shortage =
    result && Number.isFinite(Number(current))
      ? 1 - normalCDF(Number(current), Number(mu), Number(sigma))
      : null;
  return (
    <section
      className="decision-calculator settings-section"
      aria-label="안전재고 계산기"
    >
      <span className="eyebrow">LECTURE 6 · 18쪽 · 직접 계산</span>
      <h2>부족확률을 재고량으로 바꿔 보세요</h2>
      <div className="decision-inputs">
        {[
          ["수요 평균 μ", mu, setMu],
          ["수요 표준편차 σ", sigma, setSigma],
          ["허용 부족확률 (%)", target, setTarget],
          ["현재 재고", current, setCurrent],
        ].map(([label, value, setter]) => (
          <label key={String(label)}>
            {String(label)}
            <input
              aria-label={String(label)}
              type="number"
              value={String(value)}
              onChange={(e) => (setter as (x: string) => void)(e.target.value)}
            />
          </label>
        ))}
      </div>
      {result ? (
        <div className="decision-results" aria-live="polite">
          <p>
            현재 재고의 부족확률{" "}
            <strong data-testid="stock-current-shortage">
              {shortage === null ? "—" : `${(shortage * 100).toFixed(4)}%`}
            </strong>
          </p>
          <p>
            연속 임계값{" "}
            <strong data-testid="stock-continuous">
              {result.continuous.toFixed(4)}
            </strong>
          </p>
          <p>
            최소 음이 아닌 정수 재고{" "}
            <strong data-testid="stock-integer">{result.integer}</strong>
          </p>
          <p>
            이 재고의 부족확률{" "}
            <strong data-testid="stock-shortage">
              {(result.shortage * 100).toFixed(4)}%
            </strong>
          </p>
        </div>
      ) : (
        <p role="status">
          평균은 0 이상, 표준편차는 양수, 부족확률은 0%와 100% 사이의 숫자를
          입력하세요.
        </p>
      )}
      <p>
        계산은 정규 수요모형과 수치 CDF 근사를 사용합니다. 정수 목표에는 올림을
        적용합니다. 원문의 약623개와 엄밀한 2% 목표의 624개를 구분하세요.
      </p>
    </section>
  );
}
