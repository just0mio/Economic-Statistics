import type { Chapter } from "./types";
import { chapter12 } from "./chapter12";
import { chapter34 } from "./chapter34";
import { chapter56 } from "./chapter56";
import { additionalLessons } from "./additionalLessons";
import { attachProvenance } from "./provenance";
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
    title: "PS1 추가 대비",
    english: "PS1 Additional Preparation",
    description:
      "제공된 강의에 상세 단원이 없는 정규·연속균등·지수분포를 PS1로 대비해요.",
    color: "rose",
    icon: "GraduationCap",
  },
];
export const lessons = [
  ...chapter12,
  ...chapter34,
  ...chapter56,
  ...additionalLessons,
]
  .sort((a, b) => a.chapterId - b.chapterId)
  .map(attachProvenance);
export const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]));
export const difficultyLabels = {
  basic: "기초",
  intermediate: "중급",
  advanced: "심화",
};
