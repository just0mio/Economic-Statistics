import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  TriangleAlert,
  Code2,
  BookOpen,
} from "lucide-react";
import { chapters, lessons, lessonById } from "../data/lessons";
import { useStudy } from "../lib/store";
import {
  ChapterIcon,
  MathBlock,
  SourceNote,
  Progress,
  Empty,
  LessonSources,
  OriginalExamples,
} from "../components/ui";
import { DistributionLab } from "../components/DistributionLab";
export function Chapters() {
  const [params, setParams] = useSearchParams();
  const selected = Number(params.get("chapter")) || 0;
  const { state } = useStudy();
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">BUILD YOUR FOUNDATION</span>
          <h1>개념 학습</h1>
          <p>왜 이 공식을 쓰는지 이해하는 순간, 문제 풀이가 달라집니다.</p>
        </div>
        <span className="pill">{lessons.length}개 개념</span>
      </div>
      <SourceNote />
      <div className="filter-row">
        <button
          className={!selected ? "filter active" : "filter"}
          onClick={() => setParams({})}
        >
          전체 챕터
        </button>
        {chapters.map((c) => (
          <button
            className={selected === c.id ? "filter active" : "filter"}
            key={c.id}
            onClick={() => setParams({ chapter: String(c.id) })}
          >
            Chapter {c.id}
          </button>
        ))}
      </div>
      {chapters
        .filter((c) => !selected || selected === c.id)
        .map((c) => {
          const ls = lessons.filter((l) => l.chapterId === c.id),
            done = ls.filter((l) => state.completed.includes(l.id)).length;
          return (
            <section className="chapter-section" key={c.id}>
              <div className="chapter-section-title">
                <span className={`chapter-icon ${c.color}`}>
                  <ChapterIcon id={c.id} size={26} />
                </span>
                <div>
                  <span className="eyebrow">
                    CHAPTER 0{c.id} · {c.english}
                  </span>
                  <h2>{c.title}</h2>
                  <p>{c.description}</p>
                </div>
                <span className="chapter-completion">
                  {done} / {ls.length}
                </span>
              </div>
              <Progress
                value={Math.round((done / ls.length) * 100)}
                label={`${c.title} 진도`}
              />
              <div className="lesson-list">
                {ls.map((l, i) => (
                  <Link to={`/learn/${l.id}`} key={l.id}>
                    <span
                      className={`lesson-status ${state.completed.includes(l.id) ? "done" : ""}`}
                    >
                      {state.completed.includes(l.id) ? (
                        <Check size={17} />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    <div>
                      <h3>{l.title}</h3>
                      <p>{l.english}</p>
                    </div>
                    {l.distribution && <span className="tag">인터랙티브</span>}
                    <ChevronRight size={18} />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
export function LessonPage() {
  const { id } = useParams();
  const lesson = lessonById[id ?? ""];
  if (!lesson)
    return (
      <div className="page">
        <Empty title="개념을 찾을 수 없어요">
          <Link to="/chapters">개념 목록으로 이동</Link>
        </Empty>
      </div>
    );
  return <LessonContent key={lesson.id} id={lesson.id} />;
}
function LessonContent({ id }: { id: string }) {
  const l = lessonById[id];
  const { state, update } = useStudy();
  const [choice, setChoice] = useState<number | null>(null),
    [checked, setChecked] = useState(false);
  const index = lessons.findIndex((x) => x.id === id),
    next = lessons[index + 1];
  const completed = state.completed.includes(id);
  useEffect(() => {
    update((s) => (s.lastLesson === id ? s : { ...s, lastLesson: id }));
  }, [id]); // A lesson visit is recorded once per route.
  function checkQuiz() {
    setChecked(true);
    const qid = `concept-${id}`;
    update((s) => ({
      ...s,
      weak:
        choice === l.quiz.answer
          ? s.weak.filter((q) => q !== qid)
          : [...new Set([...s.weak, qid])],
    }));
  }
  return (
    <div className="page lesson-page">
      <Link className="back-link" to={`/chapters?chapter=${l.chapterId}`}>
        <ArrowLeft size={15} /> Chapter {l.chapterId} 개념 목록
      </Link>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            CHAPTER 0{l.chapterId} · CONCEPT{" "}
            {String(index + 1).padStart(2, "0")}
          </span>
          <h1>{l.title}</h1>
          <p className="english-title">{l.english}</p>
        </div>
        <button
          className={completed ? "button completed" : "button secondary"}
          onClick={() =>
            update((s) => ({
              ...s,
              completed: completed
                ? s.completed.filter((v) => v !== id)
                : [...s.completed, id],
            }))
          }
        >
          <CheckCircle2 size={17} />
          {completed ? "학습 완료됨" : "학습 완료로 표시"}
        </button>
      </div>
      <SourceNote />
      <LessonSources lesson={l} />
      <div className="lesson-layout">
        <article className="lesson-article">
          <div className="concept-summary">
            <span>
              <Lightbulb size={20} />
            </span>
            <div>
              <small>이 개념의 핵심</small>
              <p>{l.summary}</p>
            </div>
          </div>
          <section id="understand">
            <span className="eyebrow">01 / UNDERSTAND</span>
            <h2>개념을 이해하기</h2>
            {l.explanation.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <blockquote lang="en">{l.definition}</blockquote>
          </section>
          <section id="formula">
            <span className="eyebrow">02 / FORMULA</span>
            <h2>공식과 기호</h2>
            <MathBlock formula={l.formula} />
            <div className="symbol-explanation">{l.symbols}</div>
            <details className="derivation" open>
              <summary>이 공식은 어떻게 나올까요?</summary>
              <ol className="steps">
                {l.derivation.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </details>
          </section>
          <section id="example">
            <span className="eyebrow">03 / WORKED EXAMPLE</span>
            <h2>직접 계산해 보기</h2>
            <div className="worked-example">
              <span className="tiny-tag">직접 작성한 예제</span>
              <h3>{l.example.question}</h3>
              <ol className="steps">
                {l.example.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              <div className="example-answer">
                <CheckCircle2 size={18} />
                <strong>{l.example.answer}</strong>
              </div>
            </div>
          </section>
          {l.code && (
            <section id="code">
              <h2>
                <Code2 size={22} /> R로 확인하기
              </h2>
              <p>
                R 또는 RStudio에서 실행할 수 있는 코드입니다. 브라우저 내 실행은
                지원하지 않습니다.
              </p>
              <h3>실행 예제</h3>
              <pre>
                <code>{l.code.program}</code>
              </pre>
              <h3>예상 결과 · 실행 로그 아님</h3>
              <pre className="output">
                <code>{l.code.output}</code>
              </pre>
              <p>{l.code.explanation}</p>
            </section>
          )}
          {l.distribution && (
            <section id="interactive">
              <span className="eyebrow">EXPLORE IT YOURSELF</span>
              <DistributionLab initial={l.distribution} fixed />
            </section>
          )}
          <OriginalExamples lesson={l} />
          <section id="application">
            <span className="eyebrow">04 / IN ECONOMICS</span>
            <h2>경제학에서는 이렇게 쓰여요</h2>
            <p>{l.application}</p>
            <div className="pitfalls">
              <h3>
                <TriangleAlert size={18} /> 자주 틀리는 부분
              </h3>
              <ul>
                {l.pitfalls.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </section>
          <section id="quiz">
            <span className="eyebrow">05 / CHECK YOUR UNDERSTANDING</span>
            <h2>이해도 확인</h2>
            <div className="concept-quiz">
              <h3>{l.quiz.question}</h3>
              <fieldset>
                <legend className="sr-only">답안 선택</legend>
                {l.quiz.options.map((o, i) => (
                  <label
                    className={`answer-option ${choice === i ? "selected" : ""}`}
                    key={i}
                  >
                    <input
                      type="radio"
                      name="concept-quiz"
                      checked={choice === i}
                      onChange={() => {
                        setChoice(i);
                        setChecked(false);
                      }}
                    />
                    <span className="option-key">{i + 1}</span>
                    {o}
                  </label>
                ))}
              </fieldset>
              <button
                className="button primary"
                disabled={choice === null || checked}
                onClick={checkQuiz}
              >
                정답 확인
              </button>
              {checked && (
                <div
                  className={`feedback ${choice === l.quiz.answer ? "correct" : "incorrect"}`}
                  role="status"
                >
                  <strong>
                    {choice === l.quiz.answer
                      ? "정확하게 이해했어요!"
                      : "한 번 더 살펴볼까요?"}
                  </strong>
                  <p>{l.quiz.explanation}</p>
                  {choice !== l.quiz.answer && (
                    <small>복습 목록에 이 문제가 추가되었습니다.</small>
                  )}
                </div>
              )}
            </div>
          </section>
          <div className="lesson-bottom">
            <button
              className="button primary"
              onClick={() =>
                update((s) => ({
                  ...s,
                  completed: [...new Set([...s.completed, id])],
                }))
              }
            >
              <Check size={17} />
              {completed ? "학습 완료" : "이 개념 학습 완료"}
            </button>
            {next && (
              <Link className="button secondary" to={`/learn/${next.id}`}>
                다음 개념
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </article>
        <aside className="lesson-outline">
          <span className="eyebrow">이 페이지에서</span>
          <a
            href="#understand"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("understand")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            개념 이해
          </a>
          <a
            href="#formula"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("formula")?.scrollIntoView();
            }}
          >
            공식과 유도
          </a>
          <a
            href="#example"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("example")?.scrollIntoView();
            }}
          >
            계산 예제
          </a>
          <a
            href="#application"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("application")?.scrollIntoView();
            }}
          >
            경제학적 적용
          </a>
          <a
            href="#quiz"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("quiz")?.scrollIntoView();
            }}
          >
            이해도 확인
          </a>
          <div className="outline-note">
            <BookOpen size={20} />
            <p>
              이해가 어려울 땐<br />한 단계씩 계산해 보세요.
            </p>
            <Link to={`/practice?chapter=${l.chapterId}`}>
              관련 문제 풀기 ↗
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
