const probability = (p: number) => {
  if (!Number.isFinite(p) || p < 0 || p > 1)
    throw new RangeError("확률은 0과 1 사이여야 합니다.");
};
const integer = (n: number) => {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError("0 이상의 정수가 필요합니다.");
};
const positive = (x: number) => {
  if (!Number.isFinite(x) || x <= 0) throw new RangeError("양수가 필요합니다.");
};
export function factorial(n: number): number {
  integer(n);
  if (n > 170) throw new RangeError("계승은 170 이하만 지원합니다.");
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
export function combination(n: number, k: number): number {
  integer(n);
  integer(k);
  if (k > n) return 0;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 1; i <= k; i++) r *= (n - k + i) / i;
  return r;
}
export function bernoulliPMF(x: number, p: number): number {
  probability(p);
  return x === 0 ? 1 - p : x === 1 ? p : 0;
}
export function bernoulliCDF(x: number, p: number): number {
  probability(p);
  return x < 0 ? 0 : x < 1 ? 1 - p : 1;
}
export function binomialPMF(x: number, n: number, p: number): number {
  integer(n);
  probability(p);
  if (!Number.isInteger(x) || x < 0 || x > n) return 0;
  if (p === 0) return x === 0 ? 1 : 0;
  if (p === 1) return x === n ? 1 : 0;
  let log = 0;
  for (let i = 1; i <= Math.min(x, n - x); i++)
    log += Math.log(n - i + 1) - Math.log(i);
  return Math.exp(log + x * Math.log(p) + (n - x) * Math.log1p(-p));
}
export function binomialCDF(x: number, n: number, p: number): number {
  integer(n);
  probability(p);
  if (x < 0) return 0;
  if (x >= n) return 1;
  let sum = 0;
  for (let k = 0; k <= Math.floor(x); k++) sum += binomialPMF(k, n, p);
  return Math.min(1, sum);
}
export function poissonPMF(x: number, lambda: number): number {
  if (!Number.isFinite(lambda) || lambda < 0)
    throw new RangeError("λ는 0 이상이어야 합니다.");
  if (!Number.isInteger(x) || x < 0) return 0;
  if (lambda === 0) return x === 0 ? 1 : 0;
  let log = -lambda + x * Math.log(lambda);
  for (let i = 2; i <= x; i++) log -= Math.log(i);
  return Math.exp(log);
}
export function poissonCDF(x: number, lambda: number): number {
  poissonPMF(0, lambda);
  if (x < 0) return 0;
  if (x === Infinity) return 1;
  if (!Number.isFinite(x)) throw new RangeError("유효한 x가 필요합니다.");
  if (x > 100000) throw new RangeError("x는 100000 이하만 지원합니다.");
  let sum = 0;
  for (let k = 0; k <= Math.floor(x); k++) sum += poissonPMF(k, lambda);
  return Math.min(1, sum);
}
export function expectedValue(values: number[], weights: number[]): number {
  validateDistribution(values, weights);
  return values.reduce((s, v, i) => s + v * weights[i], 0);
}
function validateDistribution(v: number[], p: number[]) {
  if (!v.length || v.length !== p.length || v.some((x) => !Number.isFinite(x)))
    throw new RangeError("유효한 값과 확률 배열이 필요합니다.");
  p.forEach(probability);
  if (Math.abs(p.reduce((a, b) => a + b, 0) - 1) > 1e-9)
    throw new RangeError("확률의 합은 1이어야 합니다.");
}
export function variance(values: number[], weights: number[]): number {
  const m = expectedValue(values, weights);
  return values.reduce((s, v, i) => s + (v - m) ** 2 * weights[i], 0);
}
export function linearVariance(a: number, v: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(v) || v < 0)
    throw new RangeError("유효한 계수와 음이 아닌 분산이 필요합니다.");
  return a * a * v;
}
export function conditionalProbability(joint: number, given: number): number {
  probability(joint);
  probability(given);
  if (given === 0 || joint > given)
    throw new RangeError(
      "조건 사건은 양의 확률이고 결합확률 이상이어야 합니다.",
    );
  return joint / given;
}
export function bayes(
  prior: number,
  likelihood: number,
  falsePositive: number,
): number {
  probability(prior);
  probability(likelihood);
  probability(falsePositive);
  const evidence = prior * likelihood + (1 - prior) * falsePositive;
  if (evidence === 0) throw new RangeError("증거의 확률이 0입니다.");
  return (prior * likelihood) / evidence;
}
export function normalPDF(x: number, mu = 0, sigma = 1): number {
  positive(sigma);
  return (
    Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI))
  );
}
// Abramowitz & Stegun 7.1.26; CDF absolute error is below 7.5e-8.
export function normalCDF(x: number, mu = 0, sigma = 1): number {
  positive(sigma);
  const z = (x - mu) / sigma;
  if (z === Infinity) return 1;
  if (z === -Infinity) return 0;
  if (z === 0) return 0.5;
  const a = Math.abs(z) / Math.sqrt(2),
    t = 1 / (1 + 0.3275911 * a);
  const erf =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-a * a);
  return 0.5 * (1 + Math.sign(z) * erf);
}
export function normalQuantile(p: number, mu = 0, sigma = 1): number {
  probability(p);
  positive(sigma);
  if (p === 0) return -Infinity;
  if (p === 1) return Infinity;
  let low = -40,
    high = 40;
  for (let i = 0; i < 90; i++) {
    const mid = (low + high) / 2;
    if (normalCDF(mid) < p) low = mid;
    else high = mid;
  }
  return mu + (sigma * (low + high)) / 2;
}
export function uniformCDF(x: number, a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a)
    throw new RangeError("b > a인 유한 구간이 필요합니다.");
  return Math.max(0, Math.min(1, (x - a) / (b - a)));
}
export function exponentialCDF(x: number, rate: number): number {
  positive(rate);
  return x <= 0 ? 0 : -Math.expm1(-rate * x);
}
function observations(values: number[], min = 1) {
  if (values.length < min || values.some((v) => !Number.isFinite(v)))
    throw new RangeError(`유한한 관측값 ${min}개 이상이 필요합니다.`);
}
export function mean(values: number[]): number {
  observations(values);
  return values.reduce((s, x) => s + x, 0) / values.length;
}
export function sampleVariance(values: number[]): number {
  observations(values, 2);
  const m = mean(values);
  return values.reduce((s, x) => s + (x - m) ** 2, 0) / (values.length - 1);
}
export function sampleCovariance(x: number[], y: number[]): number {
  observations(x, 2);
  observations(y, 2);
  if (x.length !== y.length)
    throw new RangeError("대응하는 관측 수가 같아야 합니다.");
  const mx = mean(x),
    my = mean(y);
  return x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0) / (x.length - 1);
}
export function correlation(x: number[], y: number[]): number {
  const v = Math.sqrt(sampleVariance(x) * sampleVariance(y));
  positive(v);
  return sampleCovariance(x, y) / v;
}
export function percentile(
  values: number[],
  p: number,
  method: 6 | 7 = 6,
): number {
  observations(values);
  probability(p);
  const sorted = [...values].sort((a, b) => a - b);
  const position =
    method === 6 ? p * (sorted.length + 1) : 1 + p * (sorted.length - 1);
  if (position <= 1) return sorted[0];
  if (position >= sorted.length) return sorted.at(-1)!;
  const k = Math.floor(position),
    d = position - k;
  return sorted[k - 1] + d * (sorted[k] - sorted[k - 1]);
}
export function distributionMoments(
  type: "bernoulli" | "binomial" | "poisson",
  n: number,
  p: number,
) {
  probability(p);
  if (type === "poisson") {
    if (!Number.isFinite(n) || n < 0)
      throw new RangeError("유효한 λ가 필요합니다.");
    return { mean: n, variance: n };
  }
  if (type === "bernoulli") return { mean: p, variance: p * (1 - p) };
  integer(n);
  return { mean: n * p, variance: n * p * (1 - p) };
}
