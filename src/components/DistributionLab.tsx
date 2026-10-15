import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import { Maximize2, SlidersHorizontal, Info } from "lucide-react";
import {
  bernoulliPMF,
  bernoulliCDF,
  binomialPMF,
  binomialCDF,
  poissonPMF,
  poissonCDF,
  normalCDF,
  normalPDF,
  normalQuantile,
  uniformCDF,
  exponentialCDF,
} from "../lib/math";
import { Modal, MathBlock } from "./ui";
export type Distribution =
  "bernoulli" | "binomial" | "poisson" | "uniform" | "normal" | "exponential";
export const distributionNames: Record<Distribution, string> = {
  bernoulli: "Bernoulli",
  binomial: "Binomial",
  poisson: "Poisson",
  uniform: "Uniform",
  normal: "Normal",
  exponential: "Exponential",
};
function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <label className="slider-label">
      <span>
        {label}
        <strong>{value}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <span className="slider-range">
        <small>{min}</small>
        <small>{max}</small>
      </span>
    </label>
  );
}
export function DistributionLab({
  initial = "binomial",
  fixed = false,
}: {
  initial?: Distribution;
  fixed?: boolean;
}) {
  const [type, setType] = useState<Distribution>(initial),
    [n, setN] = useState(10),
    [p, setP] = useState(0.5),
    [lambda, setLambda] = useState(3),
    [x, setX] = useState(3),
    [mu, setMu] = useState(0),
    [sigma, setSigma] = useState(1),
    [a, setA] = useState(0),
    [b, setB] = useState(10),
    [q, setQ] = useState(0.95),
    [expanded, setExpanded] = useState(false),
    [view, setView] = useState<"pmf" | "cdf">("pmf");
  const discrete = ["bernoulli", "binomial", "poisson"].includes(type);
  const [includeExtras, setIncludeExtras] = useState(initial === "exponential");
  const max =
    type === "bernoulli"
      ? 1
      : type === "binomial"
        ? n
        : Math.ceil(lambda + 6 * Math.sqrt(lambda) + 5);
  const selected = discrete ? Math.min(Math.round(x), max) : x;
  const pmf = (k: number) =>
    type === "bernoulli"
      ? bernoulliPMF(k, p)
      : type === "binomial"
        ? binomialPMF(k, n, p)
        : poissonPMF(k, lambda);
  const cdf = (k: number) =>
    type === "bernoulli"
      ? bernoulliCDF(k, p)
      : type === "binomial"
        ? binomialCDF(k, n, p)
        : type === "poisson"
          ? poissonCDF(k, lambda)
          : type === "normal"
            ? normalCDF(k, mu, sigma)
            : type === "uniform"
              ? uniformCDF(k, a, b)
              : exponentialCDF(k, lambda);
  const lo =
      type === "normal" ? mu - 4 * sigma : type === "uniform" ? a - 1 : 0,
    hi =
      type === "normal"
        ? mu + 4 * sigma
        : type === "uniform"
          ? b + 1
          : 6 / lambda;
  const data = discrete
    ? [
        ...(view === "cdf" ? [{ x: -0.5, y: 0 }] : []),
        ...Array.from({ length: max + 1 }, (_, k) => ({
          x: k,
          y: view === "cdf" ? cdf(k) : pmf(k),
        })),
        ...(view === "cdf" ? [{ x: max + 0.5, y: cdf(max) }] : []),
      ]
    : type === "uniform"
      ? view === "cdf"
        ? [
            { x: a - 1, y: 0 },
            { x: a, y: 0 },
            { x: b, y: 1 },
            { x: b + 1, y: 1 },
          ]
        : [
            { x: a - 1, y: 0 },
            { x: a, y: 1 / (b - a) },
            { x: b, y: 0 },
            { x: b + 1, y: 0 },
          ]
      : Array.from({ length: 161 }, (_, i) => {
          const k = lo + ((hi - lo) * i) / 160;
          return {
            x: Number(k.toFixed(5)),
            y:
              view === "cdf"
                ? cdf(k)
                : type === "normal"
                  ? normalPDF(k, mu, sigma)
                  : lambda * Math.exp(-lambda * k),
          };
        });
  const mean =
    type === "bernoulli"
      ? p
      : type === "binomial"
        ? n * p
        : type === "poisson"
          ? lambda
          : type === "normal"
            ? mu
            : type === "uniform"
              ? (a + b) / 2
              : 1 / lambda;
  const variance =
    type === "bernoulli"
      ? p * (1 - p)
      : type === "binomial"
        ? n * p * (1 - p)
        : type === "poisson"
          ? lambda
          : type === "normal"
            ? sigma * sigma
            : type === "uniform"
              ? (b - a) ** 2 / 12
              : 1 / lambda ** 2;
  const fmt = (v: number) =>
    v !== 0 && Math.abs(v) < 0.000001
      ? v.toExponential(2)
      : Number(v.toFixed(6)).toString();
  const graph = (
    <div
      className="chart-wrap"
      role="img"
      aria-label={`${distributionNames[type]} ${view === "cdf" ? "누적분포" : "확률분포"} 그래프. 평균 ${fmt(mean)}, 분산 ${fmt(variance)}. 정확한 수치는 아래 표에서 확인하세요.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        {discrete && view === "pmf" ? (
          <BarChart
            data={data}
            margin={{ top: 15, right: 15, bottom: 15, left: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 5" />
            <XAxis
              dataKey="x"
              tickLine={false}
              axisLine={false}
              label={{
                value: "x · 사건의 횟수",
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis
              width={45}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
            />
            <Tooltip
              formatter={(v) => fmt(Number(v))}
              labelFormatter={(v) => `x = ${v}`}
            />
            <Bar
              dataKey="y"
              name="P(X=x)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell
                  key={d.x}
                  fill={d.x === selected ? "#1f6556" : "#b7d5c6"}
                />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <AreaChart
            data={data}
            margin={{ top: 15, right: 15, bottom: 15, left: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 5" />
            <XAxis
              dataKey="x"
              type="number"
              domain={discrete ? [-0.5, max + 0.5] : [lo, hi]}
              tickFormatter={(v) => Number(v).toFixed(1)}
              tickLine={false}
            />
            <YAxis
              width={45}
              tickFormatter={(v) => Number(v).toFixed(2)}
              tickLine={false}
            />
            <Tooltip
              formatter={(v) => fmt(Number(v))}
              labelFormatter={(v) => `x = ${Number(v).toFixed(3)}`}
            />
            <Area
              type={
                discrete || (type === "uniform" && view === "pmf")
                  ? "stepAfter"
                  : type === "uniform"
                    ? "linear"
                    : "monotone"
              }
              dataKey="y"
              name={view === "cdf" ? "F(x)" : "f(x)"}
              stroke="#438c75"
              strokeWidth={2}
              fill="#b7d5c6"
              fillOpacity={0.45}
              isAnimationActive={false}
            />
            <ReferenceLine
              x={selected}
              stroke="#d18a52"
              strokeDasharray="5 4"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
  return (
    <section className="lab-widget">
      {!fixed && (
        <label className="scope-toggle">
          <input
            type="checkbox"
            checked={includeExtras}
            onChange={(e) => {
              setIncludeExtras(e.target.checked);
              if (!e.target.checked && type === "exponential")
                setType("normal");
            }}
          />
          범위 밖 지수분포 포함
        </label>
      )}
      {type === "exponential" && (
        <p className="audit-note">
          지수분포는 이번 시험범위 밖 PS1 보충입니다.
        </p>
      )}
      <div className="lab-toolbar">
        <div>
          <span className="eyebrow">
            <SlidersHorizontal size={14} /> INTERACTIVE LAB
          </span>
          <h2>확률을 직접 움직여 보세요</h2>
        </div>
        {!fixed && (
          <label className="sr-only" htmlFor="distribution-select">
            분포 선택
          </label>
        )}
        {!fixed && (
          <select
            id="distribution-select"
            value={type}
            onChange={(e) => {
              setType(e.target.value as Distribution);
              setX(1);
            }}
          >
            {Object.entries(distributionNames)
              .filter(([v]) => includeExtras || v !== "exponential")
              .map(([v, name]) => (
                <option value={v} key={v}>
                  {name}
                </option>
              ))}
          </select>
        )}
      </div>
      <div className="lab-grid">
        <div className="lab-controls">
          <span className="pill">{distributionNames[type]} distribution</span>
          {(type === "bernoulli" || type === "binomial") && (
            <Slider
              label="성공확률 p"
              value={p}
              onChange={setP}
              min={0}
              max={1}
              step={0.01}
            />
          )}{" "}
          {type === "binomial" && (
            <Slider
              label="시행 횟수 n"
              value={n}
              onChange={setN}
              min={1}
              max={50}
            />
          )}{" "}
          {(type === "poisson" || type === "exponential") && (
            <Slider
              label={type === "poisson" ? "평균 발생 수 λ" : "발생률 λ"}
              value={lambda}
              onChange={setLambda}
              min={0.1}
              max={20}
              step={0.1}
            />
          )}{" "}
          {type === "normal" && (
            <>
              <Slider
                label="평균 μ"
                value={mu}
                onChange={setMu}
                min={-10}
                max={10}
              />
              <Slider
                label="표준편차 σ"
                value={sigma}
                onChange={setSigma}
                min={0.2}
                max={5}
                step={0.1}
              />
            </>
          )}{" "}
          {type === "uniform" && (
            <>
              <Slider
                label="왼쪽 경계 a"
                value={a}
                onChange={(v) => {
                  setA(v);
                  if (v >= b) setB(v + 1);
                }}
                min={0}
                max={9}
              />
              <Slider
                label="오른쪽 경계 b"
                value={b}
                onChange={setB}
                min={a + 1}
                max={20}
              />
            </>
          )}
          <Slider
            label="확인할 값 x"
            value={selected}
            onChange={setX}
            min={discrete ? 0 : type === "normal" ? -30 : 0}
            max={
              discrete
                ? max
                : type === "normal"
                  ? 30
                  : type === "uniform"
                    ? 21
                    : 60
            }
            step={discrete ? 1 : 0.1}
          />
          <div className="moment-grid">
            <div>
              <small>기댓값 E[X]</small>
              <strong data-testid="lab-mean">{fmt(mean)}</strong>
            </div>
            <div>
              <small>분산 Var(X)</small>
              <strong data-testid="lab-variance">{fmt(variance)}</strong>
            </div>
          </div>
        </div>
        <div className="lab-visual">
          <div className="chart-heading">
            <div className="segmented">
              <button
                className={view === "pmf" ? "selected" : ""}
                onClick={() => setView("pmf")}
              >
                {discrete ? "PMF" : "PDF"}
              </button>
              <button
                className={view === "cdf" ? "selected" : ""}
                onClick={() => setView("cdf")}
              >
                CDF
              </button>
            </div>
            <button
              className="icon-button"
              aria-label="그래프 확대"
              onClick={() => setExpanded(true)}
            >
              <Maximize2 size={17} />
            </button>
          </div>
          {graph}
          <div className="probability-results">
            <div>
              <small>P(X = {selected})</small>
              <b>{discrete ? fmt(pmf(selected)) : "0"}</b>
            </div>
            <div>
              <small>P(X ≤ {selected})</small>
              <b>{fmt(cdf(selected))}</b>
            </div>
            <div>
              <small>P(X ≥ {selected})</small>
              <b>{fmt(1 - cdf(discrete ? selected - 1 : selected))}</b>
            </div>
          </div>
        </div>
      </div>
      <p className="lab-hint">
        <Info size={15} />
        {discrete
          ? "막대의 높이는 확률입니다. ≥의 경계를 포함하려면 1 − F(x−1)을 사용해요."
          : "곡선의 높이는 밀도, 면적은 확률입니다. 연속분포에서 한 점의 확률은 0이에요."}
        {type === "poisson" &&
          ` 그래프는 x=${max}까지 표시합니다. 생략된 꼬리 확률 ${fmt(1 - cdf(max))}.`}
      </p>
      {type === "normal" && (
        <div className="quantile-calculator">
          <h3>역 CDF · 분위수 계산</h3>
          <Slider
            label="왼쪽 누적확률 q"
            value={q}
            onChange={setQ}
            min={0.001}
            max={0.999}
            step={0.001}
          />
          <MathBlock
            formula={String.raw`x_q=\mu+\sigma\Phi^{-1}(q)=${normalQuantile(q, mu, sigma).toFixed(5)}`}
          />
          <p>
            P(X ≤ {normalQuantile(q, mu, sigma).toFixed(5)}) ≈ {q}
          </p>
        </div>
      )}
      <details className="data-table">
        <summary>정확한 수치 표 보기 · 그래프 대체 설명</summary>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>
                  {view === "cdf" ? "CDF" : discrete ? "PMF" : "PDF (밀도)"}
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((_, i) => discrete || i % 8 === 0)
                .map((d) => (
                  <tr key={d.x}>
                    <td>{d.x}</td>
                    <td>{fmt(d.y)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
      {expanded && (
        <Modal
          title={`${distributionNames[type]} · ${view.toUpperCase()}`}
          onClose={() => setExpanded(false)}
        >
          {graph}
        </Modal>
      )}
    </section>
  );
}
