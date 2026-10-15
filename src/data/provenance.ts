import type { Lesson } from "./types";

// Physical PDF page numbers, including the handwritten insert at page 247.
export const lecturePageMap: Record<string, number[]> = {
  statistics: [8, 9, 10, 24, 46, 49],
  population: [22, 23],
  inference: [14, 15, 16, 191],
  causality: [11, 12, 13, 37, 39],
  bias: [23, 34, 38, 39, 46, 47],
  simpson: [40, 179, 180, 181],
  "data-types": [25, 26, 28, 29, 30, 31, 32, 33, 34, 35],
  frequency: [52, 53, 54, 86, 87, 88],
  center: [58, 59, 92, 93, 94, 95, 96],
  "weighted-mean": [60, 97],
  quantiles: [61, 70, 98, 99, 100, 113, 114, 115],
  "variance-sample": [64, 65, 103, 104, 105],
  standardization: [66, 67, 106, 107, 108, 109],
  bounds: [68, 110, 111],
  shape: [55, 69, 89, 95, 112],
  correlation: [75, 76, 77, 120, 121, 122],
  gini: [72, 73, 117, 118],
  "r-basics": [140, 141, 142, 143, 144, 145, 149],
  "r-import": [148, 150, 151, 152],
  "r-transform": [154, 155],
  "r-group": [156],
  "r-join": [157],
  "r-plots": [
    160, 161, 162, 163, 164, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175,
  ],
  weather: [177, 178, 179, 180, 181, 182],
  events: [189, 190, 192, 193, 194, 195, 196],
  axioms: [199, 200, 201, 202],
  addition: [196, 200, 202],
  conditional: [203, 204, 205, 206, 207, 208],
  independence: [198, 209, 210, 211, 212],
  "total-probability": [213, 214],
  bayes: [215, 216, 217, 218, 219],
  "conditional-expectation": [242],
  "random-variable": [231, 232, 233],
  "pmf-cdf": [234, 235, 236, 237, 238, 239],
  expectation: [240, 241, 243],
  linearity: [243, 244],
  "total-expectation": [242],
  "variance-rv": [246, 247, 248, 249],
  "linear-variance": [250, 251],
  bernoulli: [254],
  binomial: [255, 256, 257, 258, 266, 267],
  poisson: [259, 260, 268, 269],
  "discrete-uniform": [236, 261, 262],
  risk: [242, 245, 249, 252],
  "monty-hall": [17, 18, 19, 20],
  "math-toolkit": [42, 43, 44, 83, 128],
  "excel-workflow": [80, 81, 82, 99, 125, 126, 127],
  "r-types": [143, 144, 145, 146, 147, 148, 149],
  "r-workflow": [158, 166, 168, 172, 173, 174, 175, 184, 185, 186],
  "probability-tree": [197, 198, 209],
};
const ps1Pages: Record<string, number[]> = {
  "continuous-uniform": [2],
  normal: [7],
  "normal-cdf": [7],
  quantile: [7],
  exponential: [4],
  strategy: [1, 2, 4, 6, 7],
};
export const lecture6PageMap: Record<string, number[]> = {
  "continuous-density": [3, 4, 5, 6],
  "continuous-uniform": [7, 8, 9],
  normal: [10, 11, 13, 14],
  "normal-linear": [12],
  "normal-cdf": [13, 15, 16],
  quantile: [17],
  "normal-stock": [18],
};
export function lectureAtPage(page: number): string {
  if (page <= 49) return "Lecture 1";
  if (page <= 83) return "Lecture 2 · 34장 버전";
  if (page <= 128) return "Lecture 2 · 45장 확장본";
  if (page <= 186) return "Lecture 3";
  if (page <= 228) return "Lecture 4";
  return page === 247 ? "Lecture 5 구간 · 손글씨 삽입 페이지" : "Lecture 5";
}
const examples: Record<string, NonNullable<Lesson["originalExamples"]>> = {
  simpson: [
    {
      title: "원문 예제 · 학과별 입학률",
      page: 40,
      text: "남성은 A학과 400명 중 60%, B학과 100명 중 25% 합격하여 전체 53%. 여성은 A 100명 중 65%, B 400명 중 30%로 전체 37%. 각 학과에서는 여성 합격률이 높지만 지원 비중이 달라 집계에서는 반대다. 이 숫자는 강의가 작성한 예시이며 실제 Berkeley 원자료가 아니다.",
    },
  ],
  frequency: [
    {
      title: "원문 예제 · 소득 도수표",
      page: 87,
      text: "10가구 소득(만원): 180,220,250,260,280,310,330,380,450,940. 100–300 구간 5개(50%), 300–500 4개(40%), 500–700 0, 700–900 0, 900–1100 1개(10%). 누적 비율 .5,.9,.9,.9,1. 경계는 중복 없이 적용한다.",
    },
  ],
  center: [
    {
      title: "확장본 추가 예제 · 평균과 중앙값",
      page: 93,
      text: "5,7,9,12,15의 평균은 48/5=9.6, 중앙값은 9. 1000을 추가하면 평균 1048/6≈174.667. 5,7,9,12의 중앙값은 (7+9)/2=8.",
    },
    {
      title: "확장본 추가 예제 · 홀수·짝수 중앙값",
      page: 94,
      text: "13개 매출을 정렬하면 6,7,8,8,9,9,9,10,10,11,11,12,13이므로 중앙값은 7번째 9. 대기시간 8,9,10,11,12,13,14,15,16,17,18,20은 가운데 13과14의 평균 13.5분.",
    },
  ],
  quantiles: [
    {
      title: "확장본 추가 예제 · p(n+1) 보간",
      page: 99,
      text: "자동차 판매량 12,15,18,22,25,28,30,35,40,45: L30=.30×11=3.3, P30=18+.3(22−18)=19.2. 통근시간 15,20,25,30,35,40,45,50,60,70: L80=8.8, P80=50+.8(60−50)=58.",
    },
    {
      title: "확장본 추가 예제 · 다섯 수치와 이상치",
      page: 100,
      text: "동일 자동차 자료의 Q1=17.25, 중앙값=26.5, Q3=36.25, IQR=19. 최소12, 최대45. 위 경계64.75, 아래−11.25. 45를80으로 대체하면 사분위수는 유지되고 80이 이상치 후보가 된다(114쪽).",
    },
    {
      title: "확장본 추가 예제 · 치즈 나트륨",
      page: 115,
      text: "260,290,300,320,330,340,340,520에서 L25=2.25, Q1=292.5, Q2=325, Q3=340. IQR=47.5, 경계221.25와411.25. 520이 이상치 후보다.",
    },
  ],
  "variance-sample": [
    {
      title: "확장본 추가 예제 · 표본분산",
      page: 104,
      text: "5,12,6,8,14의 평균9. 편차제곱은16,9,9,1,25이고 합60. s²=60/(5−1)=15. 표준편차 √15≈3.872983.",
    },
    {
      title: "원문 예제 · 수확량의 산포",
      page: 105,
      text: "4,5,6,7,8 t/ha의 평균6, 편차제곱합10, 표본분산2.5, 표준편차√2.5≈1.581139 t/ha.",
    },
  ],
  standardization: [
    {
      title: "확장본 추가 예제 · 변동계수",
      page: 107,
      text: "주식 A 평균가격50·표준편차5 → CV10%. 주식 B 평균100·표준편차5 → CV5%. 절대 표준편차가 같아도 상대 산포는 다르다.",
    },
    {
      title: "확장본 추가 예제 · IQ 표준점수",
      page: 109,
      text: "μ=100, σ=15에서 X=121의 Z=(121−100)/15=1.4. σ>0일 때 표준화한 변수의 평균은0, 분산은1이다.",
    },
  ],
  bounds: [
    {
      title: "확장본 추가 예제 · 경험법칙",
      page: 111,
      text: "작업시간 평균12.8분, 표준편차1.7분, 대칭 종 모양의 근사. 16.2=12.8+2×1.7이므로 경험법칙상 오른쪽 꼬리는 약2.5%. 정확한 정규모형에서는 약2.275%로 근사 규칙과 구분한다.",
    },
  ],
  correlation: [
    {
      title: "원문 계산 오류 · 가격과 수량",
      page: 121,
      text: "원자료 X=10,11,12,13,14, Y=100,95,88,82,75. 원문은 편차곱합 −62, sxy=−15.5, sy=9.86, r≈−.995로 적혀 있다.",
      note: "검산: 평균12,88; 편차곱합 −24−7+0−6−26=−63, sxy=−15.75. Y 편차제곱합398 → sy=√99.5≈9.974969. r=−63/√(10×398)≈−0.998617134. 같은 오류가 PDF76쪽에도 있다. PDF 파일은 수정하지 않았다.",
    },
  ],
  weather: [
    {
      title: "원문 관찰 결과 · 기온과 옥수수",
      page: 180,
      text: "강의가 보고한 미국 county-year 표: 전체6945행, 북부3118행 r(GDD,yield)=+.42, 남부3827행 r=−.27, 전체 r=−.23. HDD와 수확량의 전체 상관은 −.40(182쪽). 집단 혼합과 비선형 고온 피해를 검토해야 한다.",
      note: "원본 CSV corn_yield_weather_2013_2017.csv는 미제공이다. 위 값은 슬라이드에 보고된 결과이며 앱에서 원자료로 재계산한 결과가 아니다. 아래 GDD/HDD 계산의 임계온도10·30은 앱 보충 예시다.",
    },
  ],
  "conditional-expectation": [
    {
      title: "손글씨 원문 · 작황 조건부 수입",
      page: 242,
      text: "좋은 작황100단위·나쁜 작황50단위, 고가격4·저가격1. 결합확률 (좋음,고가)=.1, (좋음,저가)=.3, (나쁨,고가)=.4, (나쁨,저가)=.2. 수입 지지는 {50,100,200,400}, E[X]=50×.2+100×.3+200×.4+400×.1=160. P(고가|좋음)=.1/.4=.25, E[X|좋음]=400×.25+100×.75=175. PDF 이미지에서 표와 필기를 확인했다.",
    },
  ],
  "total-expectation": [
    {
      title: "손글씨 예제에서 전기댓값으로 확장",
      page: 242,
      text: "동일 표에서 P(좋음)=.4, P(나쁨)=.6. E[X|나쁨]=200×(.4/.6)+50×(.2/.6)=150. 따라서 .4×175+.6×150=160=E[X].",
      note: "조건부 표는 원문 손글씨에 있다. 전기댓값 법칙으로 정리한 마지막 계산과 설명은 앱이 추가한 보충이다.",
    },
  ],
  "variance-rv": [
    {
      title: "원문 예제 · 커피 판매량",
      page: 248,
      text: "X=10,15,20,25,30, p=.1,.2,.4,.2,.1. E[X]=20, E[X²]=430, Var(X)=430−400=30, SD=√30≈5.477226.",
    },
    {
      title: "손글씨 삽입 페이지 · 표기와 계산 불일치",
      page: 247,
      text: "필기 상단에는 지지 {50,100,150,200}으로 보이는 표기가 있지만 계산은 {50,100,200,400}와 확률 .2,.4,.3,.1을 사용한다. 그 계산에서는 평균150, 2차모멘트32500, 분산10000, SD100이다.",
      note: "상단 지지집합과 후속 식이 일치하지 않아 필기 그대로를 채점용 문제로 사용하지 않는다. 242쪽의 다른 확률표(.2,.3,.4,.1)와 혼합하지 않는다.",
    },
  ],
  risk: [
    {
      title: "원문 예제 · 기대효용과 위험",
      page: 245,
      text: "확실한500과 공정 동전으로0 또는1000의 기대금액은 모두500이다. 오목 효용함수를 가진 위험회피자는 확실한500을 선호할 수 있다. St. Petersburg 게임의 무한 기대금액은 기대금액만으로 지불의사를 설명하는 한계를 보여 준다.",
    },
    {
      title: "원문 예제 · 보험금",
      page: 252,
      text: "손실10000이 확률.02로 발생: 기대보험금200, E[X²]=2000000, 분산1960000, 표준편차1400. 비용 없는 완전보장의 공정 보험료는200이다.",
    },
  ],
  binomial: [
    {
      title: "원문 예제 · 전구 불량",
      page: 256,
      text: "X~Bin(20,.05): P(X=2)=190×.05²×.95¹⁸≈.1886768. E[X]=1, Var(X)=.95, SD≈.974679. P(X≥1)=1−.95²⁰≈.6415141.",
    },
    {
      title: "원문 연습 · 사격",
      page: 266,
      text: "6번 독립 사격, 명중확률 .8. X~Bin(6,.8); P(X=4)=.24576, P(X>4)=.65536, P(X≥2)=.9984. 평균4.8, SD√.96≈.979796. 0회 명중확률 .000064로 매우 드물다. 원문 해설267쪽.",
    },
  ],
  poisson: [
    {
      title: "원문 예제 · 은행과 콜센터",
      page: 260,
      text: "은행15분 평균3명: P(X=2)≈.2240418, P(X≤2)≈.4231901, SD√3. 콜센터 하루평균4건: 0건확률 e⁻⁴≈.0183156, 8건 초과확률≈.0213634.",
    },
    {
      title: "원문 연습 · 교통사고",
      page: 268,
      text: "주당 평균2건, 일정률·독립. 한 주 P(X=1)=2e⁻²≈.2706706, P(X=0)=e⁻²≈.1353353. 두 주 λ=4, P(Y≤3)=e⁻⁴(1+4+8+64/6)≈.4334701. 원문 해설269쪽.",
    },
  ],
  "pmf-cdf": [
    {
      title: "원문 예제 · 룰렛의 14번 베팅",
      page: 238,
      text: "순이익 Y의 지지는 {−1,35}. P(Y=−1)=36/37, P(Y=35)=1/37. CDF는 x<−1에서0, −1≤x<35에서36/37, x≥35에서1이다. 경계의 점프 크기가 PMF다.",
    },
  ],
  expectation: [
    {
      title: "원문 예제 · 하루 판매량",
      page: 241,
      text: "X=10,20,30의 확률이 .3,.5,.2. E[X]=3+10+6=19로 지지집합에 없는 값이다. E[X²]=410, Var(X)=410−361=49. 이 분산은250쪽 선형 이익 예제로 이어진다.",
    },
  ],
  "linear-variance": [
    {
      title: "원문 예제 · 선형 이익",
      page: 250,
      text: "판매량 E[X]=19, Var(X)=49, Y=5X−40. E[Y]=55, Var(Y)=25×49=1225, SD(Y)=35. 고정비용40은 평균을 낮추지만 산포를 바꾸지 않는다.",
    },
  ],
  addition: [
    {
      title: "원문 연습 · 세제 선호",
      page: 221,
      text: "P(A)=.65,P(B)=.48,P(A∩B)=.25. 분할표: 둘다.25, A만.40, B만.23, 둘다아님.12. 적어도하나.88, 정확히하나.63. 교집합이 양수여서 배타적이지 않다. 해설222쪽.",
    },
  ],
  bayes: [
    {
      title: "원문 연습 · 신용점수와 부도",
      page: 223,
      text: "P(C)=.6, P(D|C)=.08, P(D|Cᶜ)=.25. P(D)=.048+.1=.148, P(Cᶜ|D)=.1/.148≈.675676. 원문224쪽은 .68로 반올림한다.",
    },
    {
      title: "원문 연습의 전제 모순 · 귀환 비행기",
      page: 227,
      text: "원문은 P(EngineHit)=.6, P(Return)=.8, P(EngineHit|Return)=.1을 제시한다. 원문228쪽의 단순 비율 .1×.8/.6≈.133333은 형식적 계산이다.",
      note: "세 확률은 동시에 성립할 수 없다. P(EngineHit∩Return)=.08이지만 Fréchet 하한 .6+.8−1=.4보다 작다. 이 전제로 유효한 결합분포를 만들 수 없으므로 앱은 이를 올바른 현실 확률모형이나 자동채점 문항으로 사용하지 않는다.",
    },
  ],
  "total-probability": [
    {
      title: "원문 연습 · craps Pass 베팅",
      page: 225,
      text: "첫 주사위 합이7 또는11이면 즉시 승리(8/36). 점수가4·10이면 이후 승률3/9, 5·9이면4/10, 6·8이면5/11. 전확률로 8/36+2[(3/36)(3/9)+(4/36)(4/10)+(5/36)(5/11)]=244/495≈.492929. 해설226쪽.",
    },
  ],
};
examples["variance-rv"].push({
  title: "원문 연습 · 노점상 이익",
  page: 264,
  text: "X=−10,20,50, p=.2,.5,.3. CDF는 해당 지지점에서 .2,.7,1. P(X>0)=.8, E[X]=23, E[X²]=970, Var=441, SD21. Y=.8X−5의 평균13.4, SD16.8. 원문 해설265쪽.",
});
export function attachProvenance(lesson: Lesson): Lesson {
  const l6pages = lecture6PageMap[lesson.id];
  const l6examples: Record<string, NonNullable<Lesson["originalExamples"]>> = {
    "continuous-density": [
      {
        title: "원문 예제 · 표준균등 CDF",
        page: 4,
        text: "X~U(0,1): F(x)=0(x<0), x(0≤x≤1), 1(x>1). P(.65<X<.70)=F(.70)−F(.65)=.05.",
      },
    ],
    "continuous-uniform": [
      {
        title: "원문 예제 · U(2,5)의 분위수와 모멘트",
        page: 8,
        text: "E(X)=3.5, Var(X)=.75, SD≈.866. 90백분위수=2+.9×3=4.7. 2X+2~U(6,12).",
      },
      {
        title: "원문 예제 · 배송 도착시간",
        page: 9,
        text: "9–11시 사이 균등 도착: X~U(0,120)분. 9:30 이전확률=.25, 10:00 정확히 도착할 확률=0. 평균60분, SD≈34.6분, 90백분위수108분(10:48).",
      },
    ],
    "normal-linear": [
      {
        title: "원문 예제 · 정규 선형변환",
        page: 12,
        text: "X~N(2,9): X+1~N(3,9), 2X~N(4,36), −2X~N(−4,36). X²는 음수가 될 수 없으므로 일반적으로 정규가 아니다.",
      },
    ],
    "normal-cdf": [
      {
        title: "원문 예제 · 표준정규 표",
        page: 15,
        text: "P(−1.5≤Z≤2)=.9772−.0668=.9104. P(Z≥1.75)=1−.9599=.0401. 표의 네 자리 반올림과 앱 수치함수 결과를 구분한다.",
      },
      {
        title: "원문 예제 · 주간 매출",
        page: 16,
        text: "X~N(25000,4000²). 20000 미만은 z=−1.25로 약.106; 30000 초과도 대칭으로 같다. 22000–28000은 z=±.75로 약.547.",
      },
    ],
    quantile: [
      {
        title: "원문 예제 · 역 CDF",
        page: 17,
        text: "N(100,15²)의 90백분위수는 원문 표 z≈1.28로 119.2. 정확 역CDF는 약119.2233. 중앙90% 구간은 μ±1.645σ로 근사한다.",
      },
    ],
    "normal-stock": [
      {
        title: "원문 예제 · 안전재고",
        page: 18,
        text: "수요 N(500,60²), 재고550의 부족확률≈.20. 부족 2% 목표는 98백분위수 500+2.054×60≈623개로 표시한다.",
        note: "원문은 반올림 근삿값이다. 정확한 연속 임계값≈623.2249이며, 정수 재고로 부족확률≤2%를 만족하려면 624개로 올려야 한다. PDF는 수정하지 않았다.",
      },
    ],
  };
  if (l6pages)
    return {
      ...lesson,
      source:
        "Lecture 6 원문 개념을 바탕으로 재구성 · 직접 작성한 예제·퀴즈는 별도 표시",
      sourcePage: l6pages[0],
      lecture: "Lecture 6",
      references: [
        {
          file: "L6_Continuous_Random_Variables.pdf",
          pages: l6pages,
          label: "Lecture 6 · 정규분포까지 (1–18쪽)",
        },
        ...(ps1Pages[lesson.id]
          ? [
              {
                file: "LESE152_PS1.pdf",
                pages: ps1Pages[lesson.id],
                label: "교수자 PS1 · 관련 문항",
              },
            ]
          : []),
      ],
      originalExamples: (l6examples[lesson.id] ?? []).map((e) => ({
        ...e,
        file: "L6_Continuous_Random_Variables.pdf",
      })),
    };
  const pages = lecturePageMap[lesson.id];
  const groups = new Map<string, number[]>();
  for (const page of pages ?? []) {
    const label = lectureAtPage(page);
    groups.set(label, [...(groups.get(label) ?? []), page]);
  }
  if (pages)
    return {
      ...lesson,
      source: "강의 개념을 바탕으로 재구성한 설명 · 예제·퀴즈는 별도 표시",
      sourcePage: pages[0],
      lecture: lectureAtPage(pages[0]),
      references: [...groups.entries()].map(([label, groupPages]) => ({
        file: "lecture.pdf",
        pages: groupPages,
        label,
      })),
      originalExamples: examples[lesson.id] ?? [],
    };
  const ps = ps1Pages[lesson.id];
  return {
    ...lesson,
    source:
      lesson.id === "exponential"
        ? "이번 시험범위 밖 보충 · PS1의 지수분포·무기억성"
        : "PS1 관련 보충 · 문제 풀이 전략",
    sourcePage: ps?.[0] ?? null,
    lecture: null,
    references: ps
      ? [
          {
            file: "LESE152_PS1.pdf",
            pages: ps,
            label: "교수자 PS1 · 추가 대비",
          },
        ]
      : [],
  };
}
