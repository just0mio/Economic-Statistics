import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { lessons, chapters } from "../src/data/lessons";
import { lecture6PageMap, lectureAtPage } from "../src/data/provenance";
import {
  originalSets,
  supplementarySets,
  flattenQuestions,
} from "../src/data/questions";
import verification from "../content/verification.json";
import manifest from "../content/materials.json";
const md = (x: unknown) =>
  String(x).replaceAll("|", "\\|").replaceAll("\n", " ");
const fmt = (x: number) => Number(x.toPrecision(11)).toString();
const values = (x: Record<string, number>) =>
  Object.entries(x)
    .map(([k, v]) => `${k}=${fmt(v)}`)
    .join(", ");
const pages = readFileSync("content/source-text/lecture.pdf.txt", "utf8")
  .split("\f")
  .slice(0, 269);
const titleOverrides: Record<number, string> = {
  1: "Introduction: Statistics and Economic Data",
  50: "Describing Economic Data (34장)",
  84: "Describing Economic Data (45장 확장본)",
  129: "Introduction to R and Data Visualization",
  187: "Probability and Random Events",
  229: "Discrete Random Variables",
  181: "Step 3: What the Single Number Was Hiding (그림)",
  190: "Assigning Probabilities",
  193: "Outcomes and the Sample Space",
  204: "Contingency Table: An Example",
  205: "Contingency Table: Cable Services",
  206: "Conditional Probability",
  207: "Conditional Probability: Examples",
  208: "Multiplication Rule",
  213: "Law of Total Probability",
  221: "Practice Question 1: Dish Detergent",
  223: "Practice Question 2: Credit Score and Loan Default",
  231: "Random Variables",
  233: "Discrete and Continuous Random Variables",
  235: "PMF: Two Coin Tosses",
  242: "The House Advantage + 손글씨 작황 조건부기댓값",
  244: "Properties of Expected Values",
  245: "Expected Value and Decisions",
  247: "손글씨 삽입: 분산·조건부 표 (인쇄 슬라이드 번호 없음)",
  250: "Variance of a Linear Function",
};
function pageTitle(p: string, i: number) {
  if (titleOverrides[i + 1]) return titleOverrides[i + 1];
  const ls = p
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x && !x.includes("Jisang Yu") && !/^LESE152$/.test(x));
  if (ls.length < 2) return ls[0] ?? "그림·목차";
  return ls[1] === "Statistics for Economists" ? ls[0] : ls[1];
}
function coverage(page: number) {
  const mapped = lessons.filter(
    (l) =>
      l.references?.some(
        (r) => r.file === "lecture.pdf" && r.pages.includes(page),
      ) ||
      l.originalExamples?.some(
        (e) => e.page === page && (e.file ?? "lecture.pdf") === "lecture.pdf",
      ),
  );
  const exerciseMap: Record<number, string> = {
    222: "addition",
    224: "bayes",
    226: "total-probability",
    228: "bayes",
    265: "variance-rv",
  };
  if (exerciseMap[page] && !mapped.some((l) => l.id === exerciseMap[page]))
    mapped.push(lessons.find((l) => l.id === exerciseMap[page])!);
  return mapped;
}
let content = `# LESE152 콘텐츠 감사\n\n검토 기준: 2026-10-15. 기존 합본 269쪽과 새 Lecture 6 원본 32쪽 전체를 텍스트로 읽고, 손글씨·표 해석이 필요한 76·242·247쪽은 이미지도 확인했다. PDF 페이지는 파일마다 **물리적 1부터 시작하는 페이지**다. 합본 lecture.pdf와 독립 L6 파일의 페이지를 혼동하지 않는다. Lecture 4·5 발췌본은 합본187–228,229–269쪽에서 추출했다. 새 원본4·5의 기호 누락은 PDF 렌더링 이미지에서도 확인했다.\n\n## 실제 자료\n\n| 자료 | 페이지 | 앱 처리 | SHA-256 |\n|---|---:|---|---|\n`;
for (const m of manifest) {
  const derived = "derivedFrom" in m;
  const treatment = derived
    ? `발췌본 · ${m.derivedFrom}의 ${m.sourcePages?.join("–")}쪽 · 원문 내용 유지`
    : m.file === "lecture.pdf"
      ? "합본 전체 분석·개념 출처·원문 예제"
      : m.file.startsWith("L6_")
        ? "전체 원본 보존 · 시험범위1–18쪽만 학습에 추가"
        : m.file === "LESE152_PS1.pdf"
          ? "교수자 과제 참고"
          : "원문 영어·배점·키 보존 · 기호 누락 별도 검산";
  content += `| ${m.file === "lecture.pdf" ? "경제통계학.pdf (앱 보관명 lecture.pdf)" : m.file} | ${m.pages} | ${treatment} | ${m.sha256} |\n`;
}
content += `\n새 Practice Set 4·5는 각8쪽으로 실제 제공되어 원본 세트에 추가했다. 기존 앱 초안과 corn_yield_weather_2013_2017.csv는 미제공이다. **창작 보충 연습 1–5는 별도 세트**다. 기존 앱이 없으므로 이전 요약본과의 직접 차집합 비교는 불가능하다. 최초5개에 새3개를 합쳐 원본 PDF8개와 명시적 발췌본3개를 보관한다.\n\n## Lecture별 목차와 실제 범위\n\n| Lecture | 합본 PDF | 내용 |\n|---|---|---|\n| 1 (49장) | 1–49 | 강의 운영(1–6), 통계·계량경제와 질문(7–13), 확률 해석(14–16), Monty Hall(17–20), 모집단·표본·자료(21–26), 변수·측정척도(27–35), 수집·편향·Simpson(36–40), Σ·로그·집합(41–44), 연구절차·윤리·활동(45–49) |\n| 2 기본본 (34장) | 50–83 | 도수표·그래프(50–56), 중심·가중평균·분위수(57–61), 산포·CV·Z·Chebyshev·왜도·상자그림(62–70), Lorenz·Gini(71–73), 공분산·상관·조건부평균(74–78), Excel·정리·활동(79–83) |\n| 2 확장본 (45장) | 84–128 | 공통 내용에 평균·중앙값·최빈값 예제(93–95), p(n+1) 보간·다섯 수치(99–100), 분산 예제(104), CV 비교(107), Z 예제(109), 경험법칙(111), 자동차·치즈 이상치(114–115)를 추가 |\n| 3 (58장) | 129–186 | 설치(131–138), 언어·벡터·타입·요인·결측·리스트·입출력(139–152), dplyr·조인·재구조화(153–158), 시각화 원칙(159–164), ggplot 문법·그룹·빈·겹침·facet·저장(165–175), 옥수수·기상·지역(176–182), 재현성과 R 확률함수(183–186) |\n| 4 (42장) | 187–228 | 확률해석·결과·사건·집합·확률나무(189–198), 공리·여사건·합집합(199–202), 결합·주변·조건부·곱셈(203–209), 독립(210–212), 전확률·Bayes(213–220), 원문 연습4개와 해설(221–228) |\n| 5 (40개 인쇄 슬라이드 + 손글씨 삽입1쪽) | 229–269 | 확률변수·지지(231–233), PMF·CDF·경계(234–239), 기댓값·함수·선형성·의사결정(240–245), 분산·선형변환·표준화·보험(246–252), Bernoulli·Binomial·Poisson·이산균등(253–263), 원문 연습3개와 해설(264–269). PDF247쪽은 슬라이드 번호가 없는 손글씨 페이지다. |\n\n## Lecture 6 범위 확정\n\nL6_Continuous_Random_Variables.pdf는32쪽이다. 사용자 지정 **normal distribution까지**는 본문의 정규분포가 끝나는18쪽으로 해석했다. 1–2쪽(표지·목차)과3–6쪽(연속형·CDF·PDF·분위수·모멘트),7–9쪽(연속균등),10–18쪽(정규분포·선형변환·표준화·경험법칙·꼬리·역CDF·안전재고)을 포함했다. 19–26쪽의 다변량·요약과27–32쪽의 뒤쪽 연습문제는 전체 원본으로만 보존하고 학습범위에 추가하지 않았다. 27–30쪽에 균등·정규 연습이 있더라도 이번 요청에서는 페이지 경계를 넘겨 추가하지 않았다. 목차와26쪽은 지수분포를 언급하지만 별도 상세 지수분포 슬라이드는 이 파일에 없다.\n\n지수분포 모듈은 기존 PS1 보충으로 보존하며 **이번 시험범위 밖**으로 표시했다. 챕터·공식·오답 연습과 분포 실험실에서는 기본 제외한다. 원본 전체100점 시험에는 원문 범위 밖 문항이 남아 있으므로 개수·표시를 제공한다. 별도의 **시험범위 연습**은 소문항 단위로 지수·원문 오류 보류를 제외하며 원점수 합을 사용하고100점으로 환산하지 않는다.\n\nLecture 4·5는 독립된 새 파일을 제공받은 것이 아니라 기존 합본에서42쪽·41쪽을 추출했다. 발췌 텍스트와 순서가 원본 해당 구간과 일치함을 전수 비교했다.\n\n## Lecture 2 중복 통합\n\n기본본 50–83쪽과 확장본 84–128쪽은 같은 Lecture 2의 두 버전이다. 공통 개념은 한 모듈로 통합하고 양쪽 페이지를 연결했다. 실제 추가된 **11장: 93,94,95,99,100,104,107,109,111,114,115**를 별도 원문 예제로 반영했다. 127쪽 활동은 기본본의 정리된 자료 처리 과제를 공공 경제자료 다운로드 활동으로 변경했다. 103쪽은 64쪽의 계산 단축식 설명 대신 자유도 설명을 강조한다. 두 버전에서 삭제되거나 바뀐 설명도 기본본 출처를 유지해 확인 가능하다.\n\n## 핵심 범위와 보충의 구별\n\n- 확률분포 단원은 Lecture 5에 실제로 존재한다: Bernoulli 254, Binomial 255–258, Poisson 259–260, Discrete uniform 261–262쪽. 각 분포의 상세 모듈, 계산 예제, PMF/CDF 실험을 구현했다.\n- 조건부기댓값은 PDF242쪽 손글씨 작황·가격 표에 있다. 이를 이미지로 확인했다. 전기댓값 법칙을 명시적으로 정리한 설명은 앱 보충이며 원문에서 인쇄된 정리처럼 표현하지 않는다.\n- 선형변환의 분산은 250쪽, 표준화는251쪽, 보험 기대손실은252쪽에 있다.\n- 새 Lecture 6에 실제 연속균등·정규 상세 단원이 있어 Chapter6의 출처를 갱신했다. PS1 참고 출처도 유지하되 실제 강의에 없는 내용처럼 표시하지 않는다. 안전재고·정규 선형변환·연속밀도 모듈을 추가했다. 지수분포는 별도 범위 밖 보충이다.\n- 한국어 설명·영어 정의의 재표현·유도·확인 퀴즈·일부 계산 예제는 앱이 새로 작성했다. 원문 예제는 개별 물리적 PDF 페이지와 함께 별도로 표시한다. R 출력은 예상 결과이며 R 런타임에서 실행한 로그가 아니다.\n\n## 검산에서 발견한 오류·주의점\n\n| 출처 | 원문 상태 | 검산·처리 |\n|---|---|---|\n| L2 PDF76·121 | 편차곱합−62, 공분산−15.5, sy9.86, r≈−.995 | 원자료로 재계산하면 합−63, 공분산−15.75, sy√99.5≈9.974969, r≈−.998617134. 원문을 보존하고 개념 페이지에 오류와 근거를 함께 표시. |\n| L4 PDF227–228 귀환 비행기 | P(E)=.6, P(R)=.8, P(E\|R)=.1, 단순 역조건 비율≈.13 | 결합 .08 < Fréchet 하한 .4이므로 전제가 모순. 타당한 확률모형으로 사용할 수 없어 자동채점 문제에서 제외. 원문 공식 계산과 전제 오류를 구별. |\n| L5 PDF247 손글씨 | 상단 지지 표기와 후속 계산의 지지값이 서로 달라 보임 | 계산이 쓰는 {50,100,200,400}, 확률{.2,.4,.3,.1}일 때 평균150, 분산10000, SD100. 손글씨를 그대로 채점 문항으로 쓰지 않고 불일치 기록. |\n| L2 PDF61·98 | Excel PERCENTILE.INC와 R 기본값이 다를 수 있다는 설명 | 두 기본 규칙은 type7로 일치한다. 시험 p(n+1)는 R type6/Excel EXC. 지정 규칙과 소프트웨어 기본값 차이를 설명하고 원본 숫자를 보존. |\n| L2 PDF58·92·95 | 대칭에서 평균=중앙값=최빈값으로 요약 | 일반 대칭분포가 다봉형이면 최빈값이 중심과 같지 않을 수 있다. 대표적인 단봉형의 직관으로 읽어야 함. |\n| L2 PDF75·120 | 상관은 선형 재척도에 불변 | 양의 배율에는 불변, 한 변수의 음의 배율은 부호를 반전. 절대 강도와 방향을 구별. |\n| L4 PDF218 | 중간 결합확률 .04·.06으로 반올림해 결과 .6 | 원래 입력 .49,.51,.08,.12를 유지하면 .0612/.1004≈.609562. 거친 반올림과 정확 계산을 구별. |\n| L1 PDF15 | 7/10 예의 p-value .17, 평탄 사전 posterior .89 | 단측 Bin(10,.5) 꼬리 .171875, Beta(8,4)의 P(p>.5)=.88671875로 근삿값과 일치. 검정 방향·사전분포 가정을 명시해야 함. |\n| L1 PDF18–19 | 특정 문 공개 후 2/3 | 항상 바꾸기의 무조건 승률은2/3. 특정 문에 조건부인 결과는 사회자가 두 염소 중 선택 가능한 경우의 선택 규칙(보통 균등)을 추가로 정해야 함. |\n| L5 PDF257 | n이 커지면 모든 이항이 종 모양으로 설명 | 고정0<p<1 등의 정규근사 조건이 필요. np가 작은 희귀사건에서는 무조건 정규근사하지 않음. |\n| PS1 C2c, PDF6 | second independent trap | 일반적인 풀이에는 감염 여부에 조건부인 독립을 해석상 가정한다. 무조건부 검사 결과는 공동 원인 때문에 독립이 아닐 수 있다. |\n\nL6 18쪽 안전재고는 반올림값 약623개다. Python NormalDist로 계산한98백분위수는623.2249346…이며 정수로 부족확률≤.02를 만족하려면624개가 필요하다. 앱은 원문623을 수정하지 않고 근삿값과 엄밀한 정수 결정을 구별한다. 정규 역CDF는 Acklam 유리근사로 개선하여 CDF근사 오차가 꼬리 분위수에 증폭되는 것을 줄였고 독립 NormalDist14개 값과 대조한다.\n\n새 Set4·5에는 화면상 음수·여사건·지수 누락이 있다. Set5 MC4는 선택지의 음수 지수가 없어 원본키C를 자동채점할 수 없고, TF10은 P(X=5)=.2라는 표시와 TRUE키가 모순이다(정확식.2⁵=.00032). 원문키를 보존하고 자동채점을 보류한다. Set5 C3의 지지 −30과 비용 차감은 원문 해설의 평균34·순이익53을 근거로 앱 한국어 조건에 명시적으로 보완했다. 문자 그대로+30이면 평균40·분산900으로 원문 해설과 다르다. Set4 C3b도 해설의 평균37을 근거로 Y=25X−8로 보완했으며 원문 영어는 보존한다. 자세한 문항별 사항은 QUESTION_AUDIT.md에 기록한다.\n\nPDF의 SHA-256을 보관했고 원문 파일을 변경하지 않았다. 검산 코드: scripts/verify_sources.py, 독립 참고값: content/verification.json.\n\n## 앱에서 독립 기능으로 구현하지 않은 원문 내용\n\n강의 운영·평가 비중·인물 역사·커리어 안내는 PDF 참고로 남겼다. 실제 옥수수 CSV의 지도·회귀·loess 결과는 데이터 미제공으로 재실행하지 않았다. 원문에는 RStudio·PositCloud·Excel 사용법이 있으며 앱에서는 설명과 예제 코드를 제공하지만 해당 프로그램을 브라우저에 내장하지 않는다. 강의 활동과 일부 그림은 원문 링크로 확인하며 모든 슬라이드 그림을 웹으로 복제하지 않았다. St. Petersburg/유틸리티와 craps 등의 원문 문제는 읽기 예제·풀이로 반영하고 별도 시험문항으로는 등록하지 않았다. 이 제한들은 누락을 숨기지 않기 위해 아래 페이지별 목록에서도 구분한다.\n\n## 개념별 공식·계산 예제·반영 현황\n`;
for (const c of chapters) {
  content += `\n### Chapter ${c.id}. ${c.english}\n\n`;
  for (const l of lessons.filter((l) => l.chapterId === c.id))
    content += `- **${l.title} (${l.id})**: ${l.summary}\n  - 세부 설명: ${l.explanation.join(" ")}\n  - 주요 공식: \`${l.formula}\`\n  - 계산 예제: ${l.example.question} → ${l.example.answer} (직접 작성한 보충 예제)\n  - 원문: ${l.references?.map((r) => `${r.label}, ${r.file} ${r.pages.join(",")}쪽`).join("; ")}\n  - 반영: 11단계 개념 학습·영어 정의·공식·유도·경제 응용·오개념·퀴즈${l.distribution ? "·인터랙티브 분포" : ""}; 원문 예제 ${l.originalExamples?.length ?? 0}개.\n`;
}
content += `\n## 269페이지 전수 목록\n\n“개념·예제 반영”은 연결된 모듈에서 재구성한 설명 또는 원문 예제로 제공함을 뜻한다. “원문 참고”는 자료실 PDF로 제공하며 독립 웹 모듈로 재현하지 않았음을 뜻한다.\n\n| PDF쪽 | Lecture | 원문 제목 | 앱 연결·상태 |\n|---:|---|---|---|\n`;
pages.forEach((p, i) => {
  const links = coverage(i + 1);
  content += `| ${i + 1} | ${lectureAtPage(i + 1)} | ${md(pageTitle(p, i))} | ${links.length ? links.map((l) => `${l.title} (${l.id})`).join("; ") + " · 개념·예제 반영" : "자료실 원문 참고 (목차·운영·그림·활동 등)"} |\n`;
});
const l6Pages = readFileSync(
  "content/source-text/L6_Continuous_Random_Variables.pdf.txt",
  "utf8",
)
  .split("\f")
  .slice(0, 32);
const l6Titles = [
  "표지",
  "목차",
  "Continuous Random Variables",
  "Cumulative Distribution Function",
  "Probability Density Function",
  "Quantiles and Expected Values",
  "Uniform Distribution",
  "Uniform: Quantiles and Moments",
  "Uniform: Delivery Example",
  "Normal Distribution",
  "Normal Shapes",
  "Linear Functions of a Normal",
  "The Standard Normal",
  "The Empirical Rule",
  "Finding Standard Normal Probabilities",
  "Weekly Revenue",
  "Percentiles: Working Backwards",
  "Safety Stock",
  "Joint Distribution",
  "Marginal and Conditional Distributions",
  "Independence",
  "Covariance",
  "Correlation",
  "Linear Combinations",
  "Diversification",
  "Summary",
  "Coffee Orders",
  "Coffee Orders: Answers",
  "Household Debt",
  "Household Debt: Answers",
  "Two Projects",
  "Two Projects: Answers",
];
content += `\n## Lecture 6 32페이지 전수 목록\n\n| L6 PDF쪽 | 제목 | 범위·앱 반영 |\n|---:|---|---|\n`;
l6Pages.forEach((_, i) => {
  const p = i + 1;
  const linked = Object.entries(lecture6PageMap)
    .filter(([, ps]) => ps.includes(p))
    .map(([id]) => id);
  content += `| ${p} | ${l6Titles[i]} | ${p > 18 ? "이번 범위 밖 · 전체 원본 참고만 제공" : linked.length ? linked.join(", ") + " · 11단계 학습/원문 예제/계산 반영" : "표지·목차 · 범위본에 포함"} |\n`;
});
writeFileSync("CONTENT_AUDIT.md", content);
let questions = `# LESE152 문항 감사\n\n검토 기준: 2026-10-15. 원본 Practice Set 1–5의 객관식50, 참거짓50, 서술형50개 소문항을 대조했다. 각 세트는 23개 대문항, 실제 응답 단위30개(10+10+10), 100점이다. Set1–3의 해설은5–6쪽, Set4–5의 해설은6–8쪽이다. 문항별 sourcePage와 answerPage를 따로 기록한다. 원문 영어·선택지·배점 대조를 자동 테스트하고, 수치 계산은 앱과 독립된 Python statistics/NormalDist/math로 재검산했다. 참거짓 해설의 논리는 수동으로 확인했다.\n\n## 원본 보존과 채점 원칙\n\n- 원본 Set1–5: 10 MCQ×2=20, 10 T/F×3=30, C1=15, C2=15, C3=20. 모든 C 소문항은5점. 소문항을 임의로 나누거나 배점을 바꾸지 않았다.\n- 원문 T/F는 짧은 설명을 요구한다. 앱의3점 자동점수는 진위 선택 기준의 학습용 점수이며 작성 설명은 별도 저장·해설 비교. 교수자 평가 점수와 같다고 보장하지 않는다.\n- 수치 하나만 요구하는 C 문항은 자동채점한다. 원문이4자리 근삿값을 제시하므로 절대오차 ±0.00006을 허용한다. 여러 값·설명·조건이 필요한 문항은 자가평가 전까지 미채점. 정확한 계산값과 원문 표의 반올림값을 구별한다.\n- 원문에 세부 부분점수표가 없어 원문 소문항5점 범위의 보충 자가평가 가이드를 표시했다. 교수자 부분점수표로 표현하지 않는다.\n- 새 원본 Set4–5를 추가했고 창작 보충1–5(각100점)는 별도로 보존했다. 지수분포 문항은 범위 밖으로 표시한다. 원본 전체 형식·배점은 유지한다.\n- Set5 MC4와 TF10은 원본 기호 누락으로 자동채점에서 제외한다. 원본키와 배점을 바꾸지 않으며 미채점으로 남기거나 명시적 자가평가를 받는다. 자동점수 분모와 정답률에서 제외하고 자가점수는 별도로 집계한다.\n- PS1에는 교수자 공식 답안이 없다. 원문은 참고자료로 별도 제공하고 아래 값은 독립적으로 작성한 검산 메모이며 공식 정답지가 아니다.\n\n## 원본 문항별 검증\n`;
for (const set of originalSets) {
  questions += `\n### ${set.title}\n\n| ID | 원문 페이지 | 배점 | 원문 정답·해설 | 검증 |\n|---|---:|---:|---|---|\n`;
  for (const q of flattenQuestions(set.questions)) {
    const ref = (
      verification.originalC as Record<string, Record<string, number>>
    )[q.questionId];
    const answer =
      q.type === "mcq"
        ? `${"ABCD"[Number(q.correctAnswer)]}: ${q.options?.[Number(q.correctAnswer)]}`
        : q.type === "tf"
          ? q.correctAnswer
            ? "TRUE"
            : "FALSE"
          : q.sourceAnswer;
    questions += `| ${q.questionId} | ${q.sourcePage} (해설${q.answerPage}) | ${q.points} | ${md(answer)} | ${ref ? (q.sourceIssue ? "원문 주의: " + q.sourceIssue + "; " : "") + "독립 재계산: " + values(ref) : q.autoGrade === false ? "원문 기호 누락 · 자동채점 보류. " + q.sourceIssue : q.sourceIssue ? "앱 보완 근거 별도 표시: " + q.sourceIssue : q.type === "mcq" ? "원문 선택지·키 대조, 수식·개념 검토" : "원문 키·설명 대조, 논리 확인"} |\n`;
  }
}
questions += `\n## 원본 답안의 오류 여부·반올림\n\nPractice Set1–3에서 정답 선택·실질적 계산 오류는 발견하지 않았다. 정상적인 반올림을 원본 오류로 처리하지 않았다. Set1 C1c s=√88≈9.3808315 → 원문9.381; CV49.37%. Set2 C3d의90분위수는 PDF 제공 z=1.2816 사용 시60.2528, 정확 CDF 역산은60.2524125. Set3 C3d의95분위수는 z=1.645 사용 시49.87, 정확 역산은49.8691218. 영어 문제와 원문 모범답안을 그대로 두고 검산 수치는 별도로 기록했다.\n\n## 새 원본 Set4·5의 기호 누락과 검산\n\n- 두 PDF를 텍스트뿐 아니라 렌더링 이미지로 확인했다. 음수·차감·여사건·일부 지수가 원본 화면에서도 빠져 있다. 텍스트 추출만의 문제라고 단정하지 않는다. 원본 파일과 영어·선택지·키는 유지한다.\n- **Set5 MC4 (2점)**: 30분 λ=1, 올바른 확률 exp(−1)≈.367879. 원본키C지만 선택지의 지수 부호가 누락되어 자동채점 보류.\n- **Set5 TF10 (3점)**: 원문 P(X=5)=.2, 키TRUE. 정확한 확률은.2⁵=.00032. 키를 FALSE로 임의 변경하지 않고 자동채점 보류. 풀이 맥락상 지수 누락으로 추정하되 실제 제시문과 구분한다.\n- Set4 C3b의 Y=25X−8은 원문 해설 E(Y)=37을 근거로 명시적으로 보완했다. Set5 C3의 지지−30과 비용 차감도 해설(E(X)=34,E(Z)=53)을 근거로 보완했다. 문자 그대로+30이면 평균40, 분산900이어서 원문 해설과 맞지 않는다. 이 서술형은 자동 정답 처리하지 않는다.\n- Set4 C1: 평균20, 중앙값18, Q1=14.25,Q3=22.5,위 경계34.875,분산506/7≈72.285714,SD≈8.502101,CV≈42.5105%.\n- Set5 C2: 첫 양성.104, 한 양성 후.3538461538, 두 양성 후.8780082988. 질병 상태별 조건부 독립을 사용한다. 원본의5자리 근삿값과 일치한다.\n\n## 교수자 PS1 검산 메모 (공식 정답 아님)\n\n- 객관식 자체 계산 기준 키: B C B B B A C B B B. 예: MC3=.6+.3−.18=.72, MC8=180/420≈.428571, MC9분산20×.1×.9=1.8, MC10표준편차√(36+64)=10.\n- 참거짓 검토: F F T F F F T F T T. TF7의CV 비교는 양의 평균과 의미 있는 비율척도라는 조건이 필요하다. TF8은 독립이 주어지지 않아 곱을 보장할 수 없다.\n`;
for (const [id, v] of Object.entries(verification.PS1))
  questions += `- ${id}: ${values(v)}.\n`;
questions += `\nC2의 두 검사 계산은 감염 상태에 조건부인 독립을 가정한다. 원문 조건을 바꾸지 않고 이 해석상 전제를 표시한다. 과제 PDF와 연습 기록을 분리했다.\n\n## 창작 보충 세트\n\n`;
for (const s of supplementarySets)
  questions += `- ${s.title}: 10 MCQ, 10 T/F, 3대문항; 20/30/50=100점. ${flattenQuestions(s.questions).length}개 응답 단위, 모든 ID·개념 연결·배점 합 검증. 직접 작성한 문제이며 원본 Set${s.id.at(-1)}를 대체한 것으로 표시하지 않는다.\n`;
questions += `\n## 검증 코드\n\n- scripts/extract_practice.py: 실제 PDF 텍스트 추출 및 원문 문항·해설 구조화\n- scripts/build_original_sets.py: 영어 원문과 명시적으로 작성한 한국어 번역·메타데이터 결합\n- scripts/verify_sources.py: 원본50개 C 소문항·PS1·L6·강의 오류의 독립 계산\n- tests/math.test.ts: PMF/CDF·모멘트·Bayes·정규·분위수·원본 예제\n- tests/data.test.ts: 세트 수·문항 수·원문 키·영어·소문항 배점·미채점 구분·개념 수식\n- tests/storage.test.ts: 백업 유효성·시험 위치/마감시간·오답 복습\n- tests/browser/app.spec.ts: 데스크톱·태블릿·모바일의 실행, 답안·진도·시험·백업 복원과 시간 종료\n\n실행 결과는 VALIDATION.md를 참고한다. 테스트를 작성했다는 사실과 실제 통과했다는 결과는 구별한다.\n`;
writeFileSync("QUESTION_AUDIT.md", questions);
for (const file of ["CONTENT_AUDIT.md", "QUESTION_AUDIT.md"])
  copyFileSync(file, `public/${file}`);
console.log(
  `Audits generated: ${pages.length} PDF pages, ${lessons.length} concepts, ${originalSets.length} original sets, ${supplementarySets.length} supplementary sets.`,
);
