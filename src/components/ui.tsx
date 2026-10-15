import { useEffect, useRef, lazy, Suspense } from "react";
import type { ReactNode } from "react";
import {
  X,
  ArrowUpRight,
  BookOpen,
  Compass,
  ChartColumn,
  Code,
  Shapes,
  ChartNoAxesCombined,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Lesson, Question } from "../data/types";
import { isExamTopic } from "../data/scope";
const FormulaRenderer = lazy(() => import("./FormulaRenderer"));
export function MathBlock({ formula }: { formula: string }) {
  return (
    <Suspense fallback={<div className="formula">수식을 불러오는 중…</div>}>
      <FormulaRenderer formula={formula} />
    </Suspense>
  );
}
export function SourceNote({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`source-note ${compact ? "compact" : ""}`}>
      <BookOpen size={16} />
      <span>
        Lecture 1–6 · L6 정규분포까지 · 원본 Practice Set 1–5
        {!compact && " · 재구성한 설명과 원문 예제를 구분해 제공합니다."}
      </span>
      <Link to="/sources">
        출처 확인 <ArrowUpRight size={13} />
      </Link>
    </div>
  );
}
export const chapterIcons = [
  Compass,
  ChartColumn,
  Code,
  Shapes,
  ChartNoAxesCombined,
  GraduationCap,
];
export function ChapterIcon({ id, size = 22 }: { id: number; size?: number }) {
  const Icon = chapterIcons[id - 1] ?? BookOpen;
  return <Icon size={size} />;
}
export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty">
      <BookOpen size={32} />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return (
    <dialog className="modal" ref={ref} onCancel={onClose}>
      <div className="section-heading">
        <h2>{title}</h2>
        <button className="icon-button" aria-label="닫기" onClick={onClose}>
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export const formatPercent = (n: number) => `${Math.round(n * 100)}%`;
export function QuestionSource({
  q,
  answer = false,
}: {
  q: Question;
  answer?: boolean;
}) {
  const page = answer ? q.answerPage : q.sourcePage;
  return (
    <>
      <p className="question-source">
        출처: {q.source}
        {!isExamTopic(q.topicId) && <strong> · 이번 시험범위 밖 보충</strong>}
        {q.sourceFile && page ? (
          <a
            className="text-link"
            href={`./materials/${q.sourceFile}#page=${page}`}
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            · PDF {page}쪽 ↗
          </a>
        ) : (
          " · 직접 작성한 보충 문항"
        )}
      </p>
      {q.sourceIssue && (
        <p className="audit-note" role="note">
          원문 주의: {q.sourceIssue}
        </p>
      )}
    </>
  );
}
export function LessonSources({ lesson }: { lesson: Lesson }) {
  return (
    <div className="lesson-sources">
      <strong>
        {!isExamTopic(lesson.id)
          ? "이번 시험범위 밖 · PS1 보충"
          : lesson.lecture
            ? "강의 개념 출처"
            : "PS1 관련 보충 설명"}
      </strong>
      {lesson.references?.map((ref) => (
        <div key={`${ref.file}-${ref.label}`}>
          <span>{ref.label}</span>
          <div>
            {ref.pages.map((page) => (
              <a
                href={`./materials/${ref.file}#page=${page}`}
                target="_blank"
                rel="noreferrer"
                key={page}
              >
                {page}쪽 ↗
              </a>
            ))}
          </div>
        </div>
      ))}
      <p>
        한국어 설명·유도·확인 퀴즈는 학습을 위해 재구성했습니다. 아래의 “원문
        예제”와 “직접 작성한 예제” 표시로 구분하세요.
      </p>
    </div>
  );
}
export function OriginalExamples({ lesson }: { lesson: Lesson }) {
  return lesson.originalExamples?.length ? (
    <section className="original-examples" id="original">
      <span className="eyebrow">FROM YOUR LECTURE</span>
      <h2>강의의 예제와 연습문제</h2>
      {lesson.originalExamples.map((e) => (
        <div className="worked-example" key={`${e.page}-${e.title}`}>
          <span className="tiny-tag">원문 확인 · PDF {e.page}쪽</span>
          <h3>{e.title}</h3>
          <p>{e.text}</p>
          {e.note && (
            <div className="audit-note">
              <strong>검산·보충 설명</strong>
              <p>{e.note}</p>
            </div>
          )}
          <a
            className="text-link"
            href={`./materials/${e.file ?? "lecture.pdf"}#page=${e.page}`}
            target="_blank"
            rel="noreferrer"
          >
            원문 페이지 보기 ↗
          </a>
        </div>
      ))}
    </section>
  ) : null;
}
