import { L } from "./lessonBuilder";
export const chapter34 = [
  L(
    3,
    "r-basics",
    "R의 기본 문법과 자료구조",
    "R Syntax & Data Structures",
    "R은 벡터를 중심으로 연산하며 자료의 타입과 구조를 먼저 확인해야 한다.",
    "R is a vector-oriented language for statistical computing.",
    [
      "<-는 할당 연산자이며 c()는 벡터를 만든다. R의 인덱스는 1부터 시작한다. 숫자, 문자, 논리형은 서로 다른 타입이며 벡터는 보통 동일한 기본 타입을 가진다. data.frame은 서로 다른 타입의 열을 같은 행 수로 묶는다.",
      "str()는 구조와 타입을, head()는 앞부분을, summary()는 요약을 보여 준다. mean(), sum(), sd(), var()를 사용할 때 NA와 표본분산의 정의를 확인한다. 아래 코드는 학습용 예제이며 브라우저가 R을 실행하지 않는다.",
    ],
    String.raw`\bar{x}=\frac{1}{n}\sum x_i`,
    "x: 수치 벡터, length(x): 원소 수",
    ["sum(x)는 원소의 합이다.", "length(x)로 나누면 mean(x)와 같은 평균이다."],
    [
      "x <- c(2,4,6)에서 mean(x), x[2]는?",
      ["mean(x)=(2+4+6)/3=4", "인덱스가 1부터 시작하므로 x[2]=4"],
      "둘 다 4",
    ],
    "생산량 벡터를 만들고 평균과 변동성을 탐색한다.",
    [
      "R의 첫 원소는 x[1]이다.",
      "문자열이 섞이면 수치 벡터가 문자로 변환될 수 있다.",
    ],
    [
      "R에서 벡터의 두 번째 값 선택은?",
      ["x[0]", "x[1]", "x[2]"],
      2,
      "R은 1 기반 인덱스를 사용한다.",
    ],
    {
      code: {
        program: "x <- c(2, 4, 6)\nmean(x)\nx[2]\nvar(x)",
        output: "[1] 4\n[1] 4\n[1] 4",
        explanation:
          "var()는 n−1을 분모로 하는 표본분산이다. 위 출력은 수학적으로 검산한 예상값이며 R 런타임 실행 기록은 아니다.",
      },
    },
  ),
  L(
    3,
    "r-import",
    "데이터 불러오기와 결측값",
    "Importing Data & Missing Values",
    "자료를 불러온 뒤 열의 타입, 결측, 중복과 단위를 검사한다.",
    "Missing values in R are represented by NA, not by zero.",
    [
      "read.csv()로 CSV를 읽을 수 있다. str(), names(), nrow()로 구조를 확인하고 is.na()로 결측 여부를 검사한다. 숫자로 보여도 쉼표나 단위가 붙으면 문자로 읽힐 수 있으므로 변환 전 원인을 확인한다.",
      "mean(x, na.rm=TRUE)는 결측을 제외한다. 이 계산이 편향 없는 것은 아니다. 누락된 농가의 수확량이 체계적으로 다르면 완전 관측 평균은 전체 평균을 대표하지 못한다. 결측 제외 시 유효 표본 크기도 함께 보고한다.",
    ],
    String.raw`\bar{x}_{obs}=\frac{\sum_{i:R_i=1}x_i}{\sum_iR_i}`,
    "Ri=1: 관측값이 존재, 0: 결측",
    [
      "유효한 관측만 분자에 합산한다.",
      "분모도 전체 수가 아니라 유효한 관측 수여야 한다.",
    ],
    [
      "c(2,NA,6)의 na.rm=TRUE 평균은?",
      ["관측값 2와 6을 더해 8", "관측 수 2로 나눈다."],
      "4",
    ],
    "가뭄 피해 농가가 보고하지 않았다면 결측 제외가 피해를 과소평가할 수 있다.",
    [
      "NA == NA로 검사하지 않고 is.na()를 쓴다.",
      "결측을 0으로 채우면 다른 질문에 답하게 된다.",
    ],
    [
      "mean(c(2,NA,6))의 기본 결과는?",
      ["4", "NA", "0"],
      1,
      "기본값 na.rm=FALSE이므로 NA가 전파된다.",
    ],
    {
      code: {
        program:
          'd <- data.frame(yield = c(2, NA, 6))\n# 실제 파일: d <- read.csv("farm.csv")\nsum(is.na(d$yield))\nmean(d$yield, na.rm = TRUE)\nsum(!is.na(d$yield))',
        output: "[1] 1\n[1] 4\n[1] 2",
        explanation:
          "결측 수, 관측 평균, 유효 관측 수를 따로 확인한다. d$yield는 yield 열을 선택한다.",
      },
    },
  ),
  L(
    3,
    "r-transform",
    "행·열 선택과 변수 만들기",
    "filter(), select() & mutate()",
    "filter는 행, select는 열, mutate는 계산한 새 변수를 다룬다.",
    "Filtering selects rows; selecting chooses columns; mutation creates or changes columns.",
    [
      "dplyr의 filter()는 조건을 만족하는 행을 유지한다. select()는 분석에 필요한 열을 고른다. mutate()는 기존 열을 사용해 새로운 열을 만든다. |> 파이프는 왼쪽 결과를 오른쪽 함수의 첫 번째 인수로 전달한다.",
      "변환 전 단위를 확인한다. 수확량을 면적으로 나눈 yield_per_ha는 총생산량과 다른 개념이다. 면적이 0이거나 결측이면 먼저 처리 기준을 정해야 한다.",
    ],
    String.raw`\text{yield per ha}=\frac{\text{production}}{\text{area}}`,
    "production: 톤, area: ha (양수)",
    [
      "대상 행을 조건으로 고른다.",
      "관측마다 생산량을 면적으로 나누어 생산성을 비교한다.",
    ],
    [
      "A 농가 12톤/3ha, B 농가 10톤/5ha의 생산성은?",
      ["A=12/3=4톤/ha", "B=10/5=2톤/ha"],
      "A 4, B 2",
    ],
    "규모가 큰 농가의 총생산량과 토지 생산성을 구별한다.",
    [
      "filter()와 select()의 역할을 바꾸지 않는다.",
      "mutate()는 집계가 아니며 보통 행 수를 유지한다.",
    ],
    [
      "새 파생변수를 만드는 함수는?",
      ["filter", "mutate", "select"],
      1,
      "mutate가 열을 생성하거나 수정한다.",
    ],
    {
      code: {
        program:
          'library(dplyr)\nd <- tibble(farm = c("A", "B"), production = c(12, 10), area = c(3, 5))\nd |> filter(area > 0) |>\n  mutate(yield = production / area) |>\n  select(farm, yield) |> as.data.frame()',
        output: "  farm yield\n1    A     4\n2    B     2",
        explanation:
          "유효 면적 행을 유지하고 단위면적 생산량을 계산한 후 두 열만 표시한다.",
      },
    },
  ),
  L(
    3,
    "r-group",
    "집단별 요약과 정렬",
    "group_by(), summarize() & arrange()",
    "그룹을 지정하면 같은 계산을 각 집단 안에서 수행할 수 있다.",
    "Grouping defines subsets for aggregation; arranging orders the resulting rows.",
    [
      'group_by(region)는 지역별 그룹을 만든다. summarize()는 그룹마다 요약값을 만든다. n()은 그룹의 행 수지만 결측이 있는 수치 변수의 유효 수와는 다를 수 있다. .groups="drop"으로 그룹을 해제하면 후속 계산에서 숨은 그룹 효과를 피할 수 있다.',
      "arrange(desc(mean_yield))는 높은 평균부터 정렬한다. 집단 평균을 다시 평균할 때는 그룹 크기를 고려해야 전체 평균을 재현한다.",
    ],
    String.raw`\bar{x}_g=\frac{1}{n_g}\sum_{i\in g}x_i`,
    "g: 그룹, ng: 그룹의 유효 관측 수",
    ["자료를 그룹별로 나눈다.", "그룹 안에서 분자와 분모를 따로 계산한다."],
    [
      "A 지역 {2,4}, B 지역 {6,8}의 평균은?",
      ["A=(2+4)/2=3", "B=(6+8)/2=7"],
      "A 3, B 7",
    ],
    "지역·작물별 평균 수확량과 유효 표본 크기를 함께 보고한다.",
    ["n()은 해당 변수의 비결측 수와 다를 수 있다."],
    [
      "그룹마다 한 줄로 요약하는 함수는?",
      ["summarize", "filter", "left_join"],
      0,
      "summarize가 집계 결과를 만든다.",
    ],
    {
      code: {
        program:
          'library(dplyr)\nd <- tibble(region = c("A","A","B","B"), yield = c(2,4,6,8))\nd |> group_by(region) |>\n summarize(mean_yield = mean(yield), n = n(), .groups = "drop") |>\n arrange(desc(mean_yield)) |> as.data.frame()',
        output:
          "  region mean_yield n\n1      B          7 2\n2      A          3 2",
        explanation:
          "지역별 평균과 수를 만든 다음 평균의 내림차순으로 정렬한다.",
      },
    },
  ),
  L(
    3,
    "r-join",
    "자료 결합과 키 검증",
    "left_join() & Key Integrity",
    "자료 결합 전 키가 무엇이고 어느 쪽에서 유일해야 하는지 확인한다.",
    "A left join retains all left-hand rows and adds matching right-hand data.",
    [
      "left_join(x,y,by=...)는 x의 모든 행을 유지하고 y의 일치하는 정보를 붙인다. 오른쪽 키에 여러 행이 대응하면 왼쪽 행이 복제된다. 키가 맞지 않으면 붙은 열은 NA가 된다.",
      "농가와 기상자료를 결합할 때 지역만으로 연결하면 다른 연도 기록까지 섞일 수 있다. 지역과 날짜·연도의 복합 키를 사용하고 결합 전후 행 수, 중복 키, 비매칭 수를 점검한다.",
    ],
    String.raw`\text{key}=(\text{region},\text{year})`,
    "key: 행을 대응시키는 식별자 조합",
    [
      "동일한 지역과 연도의 관측을 찾는다.",
      "오른쪽에 정확히 하나의 관측이 대응하는지 확인한다.",
    ],
    [
      "농가 A·B와 날씨 A만 left_join하면?",
      ["A에는 해당 날씨가 붙는다.", "B 행도 남지만 날씨는 NA다."],
      "2행 유지, B 날씨 결측",
    ],
    "기상 충격을 농가 생산에 연결할 때 잘못된 조인은 가짜 상관을 만들 수 있다.",
    ["조인 후 행 수가 늘어나면 다대다 매칭을 점검한다."],
    [
      "오른쪽 키가 두 번 등장하면 어떤 일이 가능한가?",
      ["왼쪽 행 복제", "항상 오류", "자동 평균"],
      0,
      "left_join은 여러 매칭 행을 반환할 수 있다.",
    ],
    {
      code: {
        program:
          'library(dplyr)\nfarm <- tibble(region = c("A","B"), year = c(2025,2025))\nweather <- tibble(region = "A", year = 2025, rain = 100)\nleft_join(farm, weather, by = c("region", "year")) |> as.data.frame()',
        output: "  region year rain\n1      A 2025  100\n2      B 2025   NA",
        explanation:
          "지역과 연도를 모두 키로 사용한다. B 지역의 미매칭을 0 강수량으로 해석해서는 안 된다.",
      },
    },
  ),
  L(
    3,
    "r-plots",
    "자료에 맞는 그래프 선택",
    "ggplot2: Histogram, Scatterplot, Boxplot & Line Chart",
    "분포, 관계, 집단 비교, 시간 추세에는 각각 다른 그래프가 적합하다.",
    "Choose a plot according to whether the question concerns a distribution, relationship, comparison, or time trend.",
    [
      "Histogram은 하나의 수량형 변수 분포를 구간별로 보여 준다. Scatterplot은 두 수량형 변수의 관계를 보여 준다. Boxplot은 중앙값·사분위수·이상치 후보로 여러 집단의 분포를 비교한다. Line chart는 순서가 있는 시간 변화에 적합하다.",
      "ggplot(data,aes(...))로 자료와 축 매핑을 정한 뒤 geom_* 레이어를 더한다. 히스토그램 binwidth, 로그축, 축 시작점은 해석에 영향을 준다. 산점도에서 이상치·비선형성·집단별 패턴을 확인한 뒤 상관계수를 해석한다.",
    ],
    String.raw`\text{density height}=\frac{\text{relative frequency}}{\text{bin width}}`,
    "구간 폭: 히스토그램의 가로 길이",
    [
      "각 구간의 관측을 센다.",
      "밀도 히스토그램은 면적의 합이 1이 되도록 높이를 조절한다.",
    ],
    [
      "상대도수 .4인 폭 2 구간의 밀도 높이는?",
      ["높이=.4/2=.2", "면적=.2×2=.4"],
      "0.2",
    ],
    "가격과 수요 관계는 산점도, 월별 물가는 선 그래프가 적합하다.",
    ["범주를 선으로 이어 연속적인 순서가 있는 듯 보이게 하지 않는다."],
    [
      "두 수량형 변수의 관계를 보는 그래프는?",
      ["히스토그램", "산점도", "단일 상자그림"],
      1,
      "산점도는 각 관측의 두 좌표를 보여 준다.",
    ],
    {
      code: {
        program:
          'library(ggplot2)\nd <- data.frame(rain = c(10,20,30), yield = c(2,4,5))\nggplot(d, aes(rain, yield)) +\n  geom_point() +\n  labs(x = "Rain (mm)", y = "Yield (tonnes/ha)")\n# geom_histogram(aes(x = yield), binwidth = 1)\n# geom_boxplot(aes(x = region, y = yield))\n# geom_line(aes(x = year, y = yield, group = farm))',
        output:
          "산점도: (10,2), (20,4), (30,5)의 세 점. 가로축은 강수량, 세로축은 수확량.",
        explanation:
          "마지막 세 줄은 각 그래프 유형의 매핑 예시이며 region/year/farm 열을 가진 별도 자료가 필요하다.",
      },
    },
  ),
  L(
    3,
    "weather",
    "농업생산과 기상 노출",
    "Growing Degree Days & Heat Degree Days",
    "생육에 유용한 온도와 임계치를 넘는 고온 노출을 구별한다.",
    "Degree days aggregate temperature exposure relative to chosen thresholds.",
    [
      "이 보충 예제는 일평균 온도 T에 대해 GDD=max(min(T,U)−B,0), HDD=max(T−U,0)를 사용한다. B는 생육 기본온도, U는 유용 온도의 상한이다. 문헌에서는 일최저·최고를 각각 자르거나 시간별 적분을 사용하는 다른 정의도 있으므로 비교 시 정의를 확인한다.",
      "HDD는 분야에 따라 Heating Degree Days를 뜻하기도 하지만 여기서는 Heat Degree Days(고온 초과 노출)다. 수확량과 GDD가 양의 상관을 보여도 토양, 관개, 작물 선택과 시기 등 교란요인이 있을 수 있다. 임계온도는 작물·생육 단계에 따라 다르다.",
    ],
    String.raw`GDD_t=\max(\min(T_t,U)-B,0),\quad HDD_t=\max(T_t-U,0)`,
    "Tt: 일평균 온도, B: 기본온도, U: 고온 임계치 (U>B)",
    [
      "유용한 온도는 상한 U에서 자른다.",
      "기본온도 B를 빼고 음수는 0으로 처리한다.",
      "상한을 넘는 부분은 HDD로 별도 누적한다.",
    ],
    [
      "B=10, U=30, 일평균 8,20,35℃의 누적 GDD와 HDD는?",
      ["GDD는 0,10,20으로 총 30", "HDD는 0,0,5로 총 5"],
      "GDD 30, HDD 5 degree-days",
    ],
    "작물 수확량을 생육기 누적 GDD·HDD와 결합해 적절한 온도와 열 피해를 구별한다.",
    [
      "온도 평균의 노출함수와 노출함수 평균은 같지 않을 수 있다.",
      "임계치를 강의에서 가져온 것처럼 해석하지 않는다.",
    ],
    [
      "이 정의에서 T=35, U=30일 때 HDD는?",
      ["35", "30", "5"],
      2,
      "임계치 초과분 35−30=5다.",
    ],
    {
      code: {
        program:
          "T <- c(8, 20, 35)\nB <- 10; U <- 30\nGDD <- pmax(pmin(T, U) - B, 0)\nHDD <- pmax(T - U, 0)\nsum(GDD)\nsum(HDD)",
        output: "[1] 30\n[1] 5",
        explanation:
          "pmin/pmax는 원소별 최소/최대다. 위 임계치는 직접 작성한 예시값이다.",
      },
    },
  ),
  L(
    4,
    "events",
    "실험, 표본공간과 사건",
    "Random Experiment, Outcome & Event",
    "사건은 확률을 부여하려는 결과들의 집합이다.",
    "An event is a subset of the sample space of a random experiment.",
    [
      "확률실험(Random experiment)은 가능한 결과를 알지만 실제 결과를 미리 확정할 수 없는 과정이다. Trial은 한 번의 시행, Outcome은 하나의 결과, Sample space Ω는 가능한 모든 결과, Event는 그 부분집합이다.",
      "동전을 두 번 던질 때 Ω={HH,HT,TH,TT}이며 “앞면이 정확히 한 번”은 {HT,TH}다. 결과들이 같은 확률을 갖는 경우에만 유리한 결과 수/전체 결과 수를 그대로 사용할 수 있다.",
    ],
    String.raw`P(A)=\frac{|A|}{|\Omega|}\quad\text{(equally likely outcomes)}`,
    "|A|: A의 결과 수, Ω: 표본공간",
    [
      "서로 다른 기본 결과를 빠짐없이 적는다.",
      "같은 가능성인지 확인한 뒤 사건에 속한 결과 수를 센다.",
    ],
    [
      "공정한 동전 두 번에서 정확히 앞면 한 번 확률은?",
      ["4개 동일 확률 결과 중 HT, TH가 해당", "2/4=1/2"],
      "0.5",
    ],
    "한 주 동안 두 고객의 구매 여부를 모델링할 때 결과와 횟수를 구별한다.",
    ["{앞면 0,1,2번}은 세 개의 동일 확률 결과가 아니다."],
    [
      "Trial은 무엇인가?",
      ["한 번의 시행", "결과의 전체 집합", "확률의 합"],
      0,
      "Trial은 실험의 한 번의 실행이다.",
    ],
  ),
  L(
    4,
    "axioms",
    "확률 공리와 여사건",
    "Probability Axioms & Complement",
    "확률은 음이 아니며 전체가 1이고, 겹치지 않는 사건은 확률을 더한다.",
    "Probabilities are nonnegative, total probability is one, and disjoint events are additive.",
    [
      "확률의 공리는 P(A)≥0, P(Ω)=1, 서로 배타적인 가산 사건들의 합집합 확률은 확률들의 합이다. 이로부터 빈 사건의 확률은 0이고 모든 사건의 확률은 1 이하다.",
      "여사건 Aᶜ는 A가 일어나지 않는 모든 결과다. A와 Aᶜ는 겹치지 않고 전체를 이루므로 P(Aᶜ)=1−P(A)다. “적어도 한 번”의 계산은 “한 번도 없음”을 빼는 방식이 효율적이다.",
    ],
    String.raw`P(A^c)=1-P(A)`,
    "Aᶜ: A의 여사건",
    ["Ω=A∪Aᶜ이며 두 사건은 배타적이다.", "1=P(A)+P(Aᶜ)를 정리한다."],
    [
      "고장 확률이 .07이면 정상일 확률은?",
      ["정상은 고장의 여사건", "1−.07=.93"],
      "0.93",
    ],
    "보험에서 “손실 발생”과 “손실 없음” 확률을 연결한다.",
    ["적어도 하나의 여사건은 정확히 하나가 아니라 하나도 없음이다."],
    [
      "어떤 사건의 확률로 불가능한 값은?",
      ["0", "0.7", "1.2"],
      2,
      "확률은 [0,1] 범위다.",
    ],
  ),
  L(
    4,
    "addition",
    "합집합, 교집합과 덧셈법칙",
    "Union, Intersection & Addition Rule",
    "A 또는 B의 확률은 두 확률을 더한 뒤 겹치는 부분을 한 번 뺀다.",
    "The probability of a union adds both probabilities and subtracts their overlap.",
    [
      "합집합 A∪B는 A 또는 B 또는 둘 다 일어나는 사건이다. 교집합 A∩B는 둘 다 일어나는 사건이다. “or”는 보통 둘 다를 포함하므로 문장의 논리조건을 확인한다.",
      "배타적(Mutually exclusive) 사건은 교집합이 비어 있다. 이때만 덧셈법칙의 교집합 항이 0이다. 일반적인 사건은 중복을 빼지 않으면 확률을 과대계산한다.",
    ],
    String.raw`P(A\cup B)=P(A)+P(B)-P(A\cap B)`,
    "∪: 또는, ∩: 동시에",
    [
      "P(A)+P(B)는 교집합을 두 번 센다.",
      "한 번만 세도록 교집합 확률을 한 번 뺀다.",
    ],
    ["P(A)=.4, P(B)=.5, P(A∩B)=.2이면 합집합은?", [".4+.5−.2=.7"], "0.7"],
    "가뭄 또는 병충해로 피해를 볼 확률에서 두 피해가 겹치는 경우를 조정한다.",
    ["배타성과 독립은 다르다."],
    [
      "배타적 사건의 교집합 확률은?",
      ["1", "0", "P(A)P(B) 항상"],
      1,
      "동시에 일어날 수 없으므로 0이다.",
    ],
  ),
  L(
    4,
    "conditional",
    "조건부확률과 분할표",
    "Conditional, Joint & Marginal Probability",
    "조건을 알게 되면 분모가 전체에서 그 조건의 사건으로 바뀐다.",
    "Conditional probability restricts the sample space to the event being conditioned on.",
    [
      "결합확률(Joint)은 두 사건이 동시에 일어날 확률이다. 주변확률(Marginal)은 다른 변수를 합쳐서 얻는 한 사건의 확률이다. 조건부확률은 분할표(Contingency table)의 특정 행이나 열을 새로운 전체로 삼는다.",
      "100명 중 구매 40명, 경보 수신 30명, 둘 다 18명이라면 P(구매)=.4, P(구매∩수신)=.18, P(구매|수신)=18/30=.6이다. P(수신|구매)=18/40=.45로 방향을 바꾸면 값이 다르다.",
    ],
    String.raw`P(A\mid B)=\frac{P(A\cap B)}{P(B)},\quad P(B)>0`,
    "A: 관심 사건, B: 주어진 조건",
    ["조건 B에 속한 관측만 남긴다.", "그 안에서 A도 만족하는 비중을 계산한다."],
    [
      "위 100명 표에서 수신하지 않은 70명 중 구매자 수와 구매확률은?",
      ["구매자 40명 중 수신 구매 18명을 뺀다: 22명", "22/70≈.3143"],
      "약 0.3143",
    ],
    "정책 안내를 받은 농가의 참여율과 전체 참여율을 구별한다.",
    ["분모가 행 합인지 열 합인지 문장의 given을 확인한다."],
    [
      "P(A|B)의 분모는?",
      ["P(A)", "P(B)", "P(A∩B)"],
      1,
      "조건 B가 새 표본공간이다.",
    ],
  ),
  L(
    4,
    "independence",
    "독립과 곱셈법칙",
    "Independence & Multiplication Rule",
    "독립은 한 사건의 정보가 다른 사건의 확률을 바꾸지 않는다는 뜻이다.",
    "Events are independent if their joint probability equals the product of their marginal probabilities.",
    [
      "항상 성립하는 곱셈법칙은 P(A∩B)=P(A|B)P(B)다. 독립인 경우 P(A|B)=P(A)이므로 주변확률의 곱이 된다. 독립을 가정할 근거 없이 단순히 곱해서는 안 된다.",
      "양의 확률을 가진 두 사건이 배타적이면 독립일 수 없다. 한 사건이 발생하면 다른 사건의 확률이 0으로 바뀌기 때문이다. 비복원추출은 보통 시행 사이 확률을 바꾸므로 독립이 아니다.",
    ],
    String.raw`P(A\cap B)=P(A\mid B)P(B);\quad A\perp B\Rightarrow P(A\cap B)=P(A)P(B)`,
    "⊥: 독립",
    [
      "조건부확률 정의 양변에 P(B)를 곱한다.",
      "독립일 때만 조건부확률을 주변확률로 바꾼다.",
    ],
    [
      "독립 고장 확률 .1, .2인 두 장비가 모두 고장날 확률은?",
      ["독립이므로 .1×.2=.02"],
      "0.02",
    ],
    "지역들이 공통 기상 충격을 받으면 농업손실을 독립으로 모델링하기 어렵다.",
    ["배타적이면 독립이라는 문장은 일반적으로 틀리다."],
    [
      "양의 확률인 두 배타적 사건은?",
      ["독립이다", "독립이 아니다"],
      1,
      "교집합은 0이나 주변확률 곱은 양수다.",
    ],
  ),
  L(
    4,
    "total-probability",
    "전확률법칙",
    "Law of Total Probability",
    "전체 확률은 서로 겹치지 않는 경우별 조건부확률의 가중평균이다.",
    "Total probability averages conditional probabilities over a partition of the sample space.",
    [
      "B1,…,Bk가 전체를 빠짐없이 나누는 배타적인 분할이면, A는 각 Bi 안에서 발생하는 경우들로 나뉜다. 각 조건부확률에 해당 집단 비중을 곱한 뒤 합산한다.",
      "한 공장이 전체 생산의 60%, 다른 공장이 40%를 만들고 불량률이 다르면, 전체 불량률은 두 불량률의 단순평균이 아니다. 생산 비중으로 가중해야 한다.",
    ],
    String.raw`P(A)=\sum_i P(A\mid B_i)P(B_i)`,
    "Bi: 서로 배타적이며 전체를 덮는 분할",
    [
      "A를 A∩Bi의 합집합으로 나눈다.",
      "곱셈법칙으로 각 교집합을 바꾼 뒤 합한다.",
    ],
    [
      "공장 1 비중 .6·불량 .02, 공장 2 비중 .4·불량 .05라면?",
      [".6×.02=.012", ".4×.05=.020", "합=.032"],
      "전체 불량률 3.2%",
    ],
    "날씨 시나리오별 작황 위험과 시나리오 확률을 결합해 전체 손실 확률을 구한다.",
    ["분할은 겹치지 않고 전체를 포함해야 한다."],
    [
      "전체 확률의 가중치는?",
      ["집단의 확률", "조건부확률의 역수", "항상 1/2"],
      0,
      "각 집단이 발생할 확률로 가중한다.",
    ],
  ),
  L(
    4,
    "bayes",
    "베이즈 정리",
    "Bayes’ Theorem",
    "결과를 관측한 뒤 원인의 확률을 갱신할 때 기저율을 함께 반영한다.",
    "Bayes’ theorem reverses conditioning using prior probabilities and likelihoods.",
    [
      "P(B|A)는 B가 일어났을 때 A를 볼 확률 P(A|B)와 다르다. 베이즈 정리는 관심 원인의 사전확률과 관측된 증거의 우도를 곱하고, 가능한 모든 원인에서 증거가 생길 확률로 나눈다.",
      "희귀한 질병이나 불량품을 감지하는 장치는 민감도가 높아도 위양성이 많이 나올 수 있다. 사전확률(기저율)이 작으면 정상 집단에서의 작은 위양성률이 큰 수의 양성 결과를 만든다.",
    ],
    String.raw`P(B\mid A)=\frac{P(A\mid B)P(B)}{P(A\mid B)P(B)+P(A\mid B^c)P(B^c)}`,
    "B: 실제 원인, A: 관측 증거",
    [
      "분자는 B와 A가 동시에 일어날 확률이다.",
      "분모는 전확률법칙으로 계산한 A의 확률이다.",
    ],
    [
      "불량률 .01, 감지 민감도 .9, 정상 위양성률 .05이면 양성 중 실제 불량 확률은?",
      [
        "실제 불량 양성=.01×.9=.009",
        "전체 양성=.009+.99×.05=.0585",
        ".009/.0585≈.153846",
      ],
      "약 15.38%",
    ],
    "경기침체 경보나 작물병 탐지의 양성예측도를 계산할 수 있다.",
    ["민감도 90%를 양성예측도 90%라고 해석하지 않는다."],
    [
      "위 예제에서 분모 .0585는?",
      ["불량률", "전체 양성 확률", "정상 확률"],
      1,
      "실제 불량 양성과 정상 위양성을 모두 포함한다.",
    ],
  ),
  L(
    4,
    "conditional-expectation",
    "조건부기댓값과 집단 평균",
    "Conditional Expectation",
    "조건부기댓값은 주어진 정보 아래에서 가능한 값의 가중평균이다.",
    "Conditional expectation is the probability-weighted mean conditional on given information.",
    [
      "E[X|B]는 사건 B가 일어났다고 알 때의 평균이다. 이산형이면 B 아래의 조건부확률을 가중치로 쓴다. 조건부확률의 합은 1이어야 한다.",
      "조건을 바꾸면 가능한 값이나 가중치가 달라지므로 무조건부기댓값과 다를 수 있다. 좋은 날씨와 나쁜 날씨의 평균 수확량을 각각 구한 뒤 날씨 확률로 가중하면 전체 평균을 얻는다.",
    ],
    String.raw`E[X\mid B]=\sum_x xP(X=x\mid B)`,
    "X: 확률변수, B: 양의 확률인 조건",
    ["B에 조건부인 확률분포를 만든다.", "각 값과 조건부확률을 곱해 합한다."],
    [
      "비 오는 날 수확량이 2,6톤일 조건부확률이 .25,.75면?",
      ["2×.25+6×.75=.5+4.5"],
      "5톤",
    ],
    "관개 여부를 알고 있을 때 예상 생산량을 갱신한다.",
    ["무조건부 확률을 조건부기댓값의 가중치로 쓰지 않는다."],
    [
      "기댓값이 반드시 가능한 관측값인가?",
      ["그렇다", "아니다"],
      1,
      "가중평균은 실제 지지집합 밖의 중간 값일 수도 있다.",
    ],
  ),
];
