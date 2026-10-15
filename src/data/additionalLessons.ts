import { L } from "./lessonBuilder";
export const additionalLessons = [
  L(
    1,
    "monty-hall",
    "몬티 홀과 정보의 생성 규칙",
    "Monty Hall & Information",
    "정보를 제공하는 사람이 어떤 규칙으로 행동하는지에 따라 조건부확률이 달라진다.",
    "Under the standard informed-host protocol, switching wins whenever the initial choice is wrong.",
    [
      "Lecture 1 PDF 17–20쪽의 사회자는 자동차 위치를 알고, 참가자가 고르지 않은 염소 문을 반드시 열고, 항상 교환 기회를 준다. 처음 선택이 맞을 확률 1/3, 틀릴 확률 2/3이므로 항상 바꾸는 전략은 2/3 확률로 이긴다.",
      "“사회자가 특정 문 3을 열었다”는 정보에 조건부인 2/3을 주장하려면, 사회자가 두 염소 중 선택할 수 있을 때 어떤 규칙으로 고르는지도 명시해야 한다. 보통 각 문을 반반 선택한다고 가정한다. 단순히 임의 문을 열었는데 우연히 염소였다는 다른 실험과 구별한다.",
    ],
    String.raw`P(\text{switch wins})=P(\text{initial choice wrong})=\frac23`,
    "초기 선택: 세 문 중 한 문, 진행 규칙: 정보를 가진 사회자가 염소를 공개",
    [
      "자동차가 초기 문에 있으면 바꾸기는 실패한다(1/3).",
      "다른 두 문에 있으면 사회자가 남긴 문이 자동차여서 바꾸기는 성공한다(2/3).",
    ],
    [
      "초기 문 1, 자동차 위치가 1·2·3으로 균등하면 바꾸기의 승리 경우는?",
      ["위치 1: 바꾸면 패배", "위치 2 또는 3: 바꾸면 승리"],
      "세 경우 중 두 경우, 2/3",
    ],
    "관측 데이터도 조사·공개 규칙에 조건부로 해석해야 한다. 정보 선택은 데이터 생성 과정의 일부다.",
    [
      "문이 두 개 남았다고 무조건 1/2이라고 결론 내리지 않는다.",
      "특정 문 공개의 조건부 계산에는 사회자의 선택 규칙이 중요하다.",
    ],
    [
      "표준 규칙에서 항상 바꾸는 전략의 승률은?",
      ["1/3", "1/2", "2/3"],
      2,
      "처음 선택이 틀린 2/3의 경우 모두 바꾸면 이긴다.",
    ],
  ),
  L(
    1,
    "math-toolkit",
    "합 기호, 로그와 성장률",
    "Summation, Logs & Growth Rates",
    "합의 선형성과 로그의 차이는 경제 데이터 계산의 기본 도구다.",
    "A log difference approximates a proportional change when the change is small.",
    [
      "Lecture 1 PDF 42–44쪽에서 Σ(axi+b)=aΣxi+nb를 사용한다. 상수 b가 각 관측에 한 번씩 등장하므로 합에는 nb가 붙는다. Σ(xi−x̄)=Σxi−nx̄=0이다. 그러나 Σxiyi를 (Σxi)(Σyi)로 바꾸면 불필요한 교차항이 생긴다.",
      "양수에 대해 log(ab)=log a+log b, log(a/b)=log a−log b다. 성장률 g=(x1−x0)/x0이면 로그차 log(x1/x0)=log(1+g)≈g이며 작은 변화에서만 좋은 근사다. 여러 기간 평균 성장률은 기하평균 [∏(1+gt)]^(1/T)−1을 사용한다.",
    ],
    String.raw`\sum_i(ax_i+b)=a\sum_ix_i+nb,\quad \log(x_1)-\log(x_0)\approx\frac{x_1-x_0}{x_0}`,
    "n: 관측 수, log: 자연로그, x0,x1>0: 이전·이후 수준",
    [
      "log(1+g)의 0 근방 테일러 전개는 g−g²/2+…다.",
      "g가 작으면 2차 이상 항을 생략할 수 있다.",
    ],
    [
      "100에서 105로 늘어난 변수의 성장률과 로그차는?",
      [
        "성장률=(105−100)/100=.05",
        "log(105/100)≈.048790",
        "로그차에 100을 곱하면 약 4.879%로 정확한 5%와 구별된다.",
      ],
      "정확한 성장률 5%, 로그차 약 0.048790",
    ],
    "연도별 가격·GDP 성장률과 로그 회귀 계수의 해석을 연결한다.",
    [
      "로그차는 변화율의 근사이며 항상 정확하지 않다.",
      "음수나 0에 실수 로그를 적용하지 않는다.",
    ],
    [
      "+10%, −10%를 연속 경험하면 총 변화율은?",
      ["0%", "−1%", "1%"],
      1,
      "1.1×.9−1=−.01이다.",
    ],
  ),
  L(
    2,
    "excel-workflow",
    "Excel과 재현 가능한 기술통계",
    "Excel & Reproducible Descriptive Statistics",
    "원자료를 보존하고 동일한 계산 규칙을 명시해야 결과를 다시 만들 수 있다.",
    "A reproducible workflow preserves raw data and documents transformations and statistical conventions.",
    [
      "Lecture 2 PDF 80–82,125–127쪽은 tidy data, 유일 ID, 중복·오류코드·결측 확인을 강조한다. Excel AVERAGE, MEDIAN, STDEV.S, VAR.S, COUNTIF, SUMPRODUCT, CORREL, GEOMEAN은 각각 다른 요약과 계산을 담당한다. 상대참조 A2는 복사 시 이동하고 절대참조 $A$2는 고정된다.",
      "강의 확장본과 PS1의 분위수 규칙은 p(n+1) 보간이다. Excel PERCENTILE.EXC와 R quantile(type=6)가 이 규칙에 대응한다. Excel PERCENTILE.INC와 R 기본 type=7은 1+(n−1)p를 사용하므로 여기의 시험 규칙과 다를 수 있다. Excel과 R을 비교할 때 함수 이름뿐 아니라 정의를 비교해야 한다.",
    ],
    String.raw`L_p=p(n+1)\ (\text{type 6}),\qquad L_p=1+(n-1)p\ (\text{type 7})`,
    "p: [0,1] 사이 비율, Lp: 1부터 시작하는 정렬 위치",
    [
      "정렬된 데이터의 위치를 선택한 정의로 계산한다.",
      "정수가 아니면 인접 두 값 사이를 소수부 비율로 보간한다.",
    ],
    [
      "{10,20,30,40,50,60,70}의 75백분위수를 비교하면?",
      ["시험 규칙: .75×8=6 → 60", "type 7: 1+6×.75=5.5 → 55"],
      "type 6: 60, type 7: 55",
    ],
    "원자료 정리, 요약표, 그래프, 해석을 코드나 기록으로 연결해 검증 가능한 과제를 만든다.",
    [
      "PERCENTILE.INC와 R 기본값은 원칙적으로 같은 type 7 규칙이다.",
      "Excel EXC는 아주 작은 표본의 극단 분위수에서 오류를 낼 수 있다.",
    ],
    [
      "PS1의 p(n+1) 규칙에 맞는 R 옵션은?",
      ["type=6", "type=7", "na.rm=FALSE"],
      0,
      "type 6가 p(n+1) 위치 규칙이다.",
    ],
  ),
  L(
    3,
    "r-types",
    "타입, 요인과 재활용 규칙",
    "R Factors, Lists & Recycling",
    "R이 오류를 내지 않았다고 자료의 의미까지 올바른 것은 아니다.",
    "R may recycle short vectors and coerce mixed types, so inspect types and lengths explicitly.",
    [
      'Lecture 3 PDF 143–149쪽은 인덱스 0, 범위 밖 인덱스, 혼합 타입, 벡터 재활용의 위험을 설명한다. c(1,2,"a")는 전체가 문자로 변환된다. 우편번호의 선행 0이 필요하면 character로 유지한다. as.numeric("def")는 경고와 NA를 만든다.',
      "factor는 범주의 수준을 기록한다. ordered=TRUE는 서열을 지정한다. 숫자 연도를 범주별 상자그림으로 비교할 때 factor(year)를 사용한다. list는 길이와 타입이 다른 원소들을 담고 data.frame은 같은 길이의 열 벡터로 구성된다.",
    ],
    String.raw`\operatorname{mean}(\mathbf1\{X>c\})=\frac{\#\{X_i>c\}}{n}`,
    "1{조건}: 참이면 1, 거짓이면 0인 지시값",
    [
      "R의 TRUE/FALSE는 수치 연산에서 1/0으로 해석된다.",
      "논리벡터의 평균은 조건을 만족하는 비율이다.",
    ],
    [
      "x=c(1,2,3,4)에서 mean(x>2)는?",
      ["비교 결과는 FALSE,FALSE,TRUE,TRUE", "평균=(0+0+1+1)/4=.5"],
      "0.5",
    ],
    "고용 여부·정책 참여 여부의 비율을 계산하고 범주형 변수의 잘못된 수치 해석을 방지한다.",
    [
      "숫자로 저장된 지역코드는 양적 변수가 아니다.",
      "짧은 벡터 재활용을 의도하지 않았다면 길이를 맞춘다.",
    ],
    [
      'c(1,2,"a")의 타입은?',
      ["numeric", "character", "logical"],
      1,
      "동일 원자벡터에서 문자가 수치를 문자로 강제 변환한다.",
    ],
    {
      code: {
        program:
          'x <- c(1, 2, 3, 4)\nmean(x > 2)\nclass(c(1, 2, "a"))\nstudent <- list(name="Kim", courses=c("ECON","STAT"))\nstudent$courses[2]',
        output: '[1] 0.5\n[1] "character"\n[1] "STAT"',
        explanation:
          "논리 비교의 평균, 타입 강제변환, 리스트 내부 벡터 선택을 각각 확인한다.",
      },
    },
  ),
  L(
    3,
    "r-workflow",
    "데이터 재구조화와 그래프 문법",
    "Reshaping, Layers & Reproducibility",
    "열 이름에 숨은 변수를 행으로 되돌리고, 시각화의 매핑과 상수를 구분한다.",
    "Tidy reshaping exposes variables explicitly; ggplot mappings connect data columns to aesthetics.",
    [
      "Lecture 3 PDF 158쪽의 pivot_wider는 연도별 열을 만들고 pivot_longer는 county-year 한 행 구조로 되돌린다. 조인 키와 마찬가지로 ID·연도 조합이 유일한지 확인한다. 전체 5년이 없는 지역도 있어 결측·불균형 패널을 점검해야 한다.",
      'aes(color=state)는 데이터의 주를 색으로 매핑해 범례를 만들고, geom_point(color="navy")는 모든 점의 색을 상수로 설정한다. geom_line에는 group=state가 필요하고 겹치는 점에는 alpha·jitter를 쓴다. 여러 비교는 facet_wrap/grid로 나누며 ggsave로 단위·크기·해상도를 정해 저장한다.',
      "스크립트는 패키지→읽기→정리→분석→저장 순서로 새 세션에서 실행돼야 한다. d*/p*/q*/r*는 PMF·CDF·분위수·난수에 해당한다. 이 웹앱은 R 런타임을 포함하지 않으므로 코드는 별도 R/RStudio에서 실행한다.",
    ],
    String.raw`P(X\le k)=\texttt{pbinom}(k,n,p),\quad P(X=k)=\texttt{dbinom}(k,n,p)`,
    "d*: density/PMF, p*: CDF, q*: quantile, r*: random draws",
    [
      "한 점의 확률과 누적확률을 먼저 구별한다.",
      "같은 n,p를 두 함수에 전달해 비교한다.",
    ],
    [
      "X~Bin(4,.5)에서 dbinom(2,4,.5), pbinom(2,4,.5)는?",
      ["한 점 확률은 6/16=.375", "누적은 (1+4+6)/16=.6875"],
      ".375, .6875",
    ],
    "분석 결과와 코드가 함께 남는 R Markdown/Quarto 문서로 연구를 재현한다.",
    [
      'aes 안에서 문자열 "navy"를 쓰면 색 이름이 아닌 범주로 매핑된다.',
      "plot의 group 설정을 생략하면 서로 다른 단위를 한 선으로 이을 수 있다.",
    ],
    [
      "CDF를 계산하는 R 함수는?",
      ["dbinom", "pbinom", "rbinom"],
      1,
      "p 접두사가 누적분포함수를 뜻한다.",
    ],
    {
      code: {
        program:
          'dbinom(2, size=4, prob=.5)\npbinom(2, size=4, prob=.5)\n# library(tidyr)\n# pivot_longer(wide, cols=c(`2024`,`2025`),\n#              names_to="year", values_to="yield")',
        output: "[1] 0.375\n[1] 0.6875",
        explanation:
          "마지막 reshape 예시는 해당 연도 열을 가진 wide 데이터가 필요하다. 예시 코드이며 원본 농업 CSV를 대신하지 않는다.",
      },
    },
  ),
  L(
    4,
    "probability-tree",
    "확률나무와 비복원추출",
    "Probability Trees & Sampling Without Replacement",
    "같은 경로에서는 곱하고 서로 배타적인 경로 사이에서는 더한다.",
    "Multiply conditional probabilities along a path and add mutually exclusive paths.",
    [
      "Lecture 4 PDF 197–198,209쪽에서 첫 가지는 주변확률, 두 번째 가지는 첫 결과가 주어진 조건부확률이다. 각 노드의 가지 확률 합은 1이다. 비복원추출에서는 남은 모집단이 바뀌므로 두 번째 확률을 갱신한다.",
      "빨강·파랑·초록 사탕 하나씩에서 두 개를 뽑는 경우 가능한 순서쌍은 RB,RG,BR,BG,GR,GB다. 각 경로 확률은 (1/3)(1/2)=1/6이다. 같은 색을 다시 뽑는 경로는 없다.",
    ],
    String.raw`P(A\cap B)=P(A)P(B\mid A)`,
    "A: 첫 결과, B: 두 번째 결과",
    [
      "첫 사건의 확률을 구한다.",
      "그 사건 뒤 남은 모집단으로 두 번째 확률을 구한다.",
      "필요한 순서들을 더한다.",
    ],
    [
      "남학생 7명·여학생 3명 중 2명을 비복원추출할 때 두 명 모두 여학생일 확률은?",
      ["첫 여학생=3/10", "이후 여학생=2/9", "곱=6/90=1/15"],
      "약 0.066667",
    ],
    "작은 재고에서 무작위로 불량품을 점검할 때 이항 독립 가정 대신 조건부추출을 고려한다.",
    ["두 번째도 3/10이라고 놓으면 복원추출을 계산하게 된다."],
    [
      "R,B,G 하나씩에서 두 개를 비복원추출할 때 R이 적어도 하나일 확률은?",
      ["1/3", "1/2", "2/3"],
      2,
      "R 없는 BG,GB의 확률 1/3을 1에서 뺀다.",
    ],
  ),
];
