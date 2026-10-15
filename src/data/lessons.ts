import type { Chapter } from "./types";
import { chapter12 } from "./chapter12";
import { chapter34 } from "./chapter34";
import { chapter56 } from "./chapter56";
import { additionalLessons } from "./additionalLessons";
import { attachProvenance } from "./provenance";
import { lecture6Lessons } from "./lecture6";
import { isExamTopic } from "./scope";
export const chapters: Chapter[] = [
  {
    id: 1,
    title: "통계학의 첫걸음",
    english: "Introduction to Statistics",
    description: "데이터에서 질문을 찾고, 통계적 사고의 기초를 세워요.",
    color: "sage",
    icon: "Compass",
  },
  {
    id: 2,
    title: "데이터를 설명하는 방법",
    english: "Descriptive Statistics",
    description: "중심과 산포, 변수 사이의 관계를 숫자로 읽어요.",
    color: "blue",
    icon: "ChartColumn",
  },
  {
    id: 3,
    title: "R과 데이터 시각화",
    english: "R Programming & Visualization",
    description: "데이터를 정리하고 경제적 패턴을 발견해요.",
    color: "violet",
    icon: "Code",
  },
  {
    id: 4,
    title: "불확실성을 다루는 확률",
    english: "Probability",
    description: "조건부확률과 베이즈 정리로 정보를 연결해요.",
    color: "amber",
    icon: "Shapes",
  },
  {
    id: 5,
    title: "확률변수와 확률분포",
    english: "Random Variables & Distributions",
    description: "기댓값부터 이항·포아송까지, 직접 움직이며 이해해요.",
    color: "sage",
    icon: "ChartNoAxesCombined",
  },
  {
    id: 6,
    title: "연속확률변수와 정규분포",
    english: "Continuous Variables & Normal Distribution",
    description:
      "Lecture 6의 1–18쪽: 밀도·연속균등·정규확률·분위수·안전재고를 배워요.",
    color: "rose",
    icon: "GraduationCap",
  },
];
export const lessons = [
  ...chapter12,
  ...chapter34,
  ...chapter56,
  ...additionalLessons,
  ...lecture6Lessons,
]
  .sort((a, b) => {
    const order = [
      "continuous-density",
      "continuous-uniform",
      "normal",
      "normal-linear",
      "normal-cdf",
      "quantile",
      "normal-stock",
      "strategy",
      "exponential",
    ];
    return (
      a.chapterId - b.chapterId ||
      (a.chapterId === 6 ? order.indexOf(a.id) - order.indexOf(b.id) : 0)
    );
  })
  .map(attachProvenance);
export const examLessons = lessons.filter((l) => isExamTopic(l.id));
export const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]));
export const difficultyLabels = {
  basic: "기초",
  intermediate: "중급",
  advanced: "심화",
};
