import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCheck,
  Target,
  Clock3,
  Sparkles,
  Play,
  Bookmark,
  ChevronRight,
  FlaskConical,
} from "lucide-react";
import { chapters, examLessons as lessons, lessonById } from "../data/lessons";
import { questionById } from "../data/questions";
import { summarize } from "../lib/grading";
import { useStudy } from "../lib/store";
import { ChapterIcon, Progress } from "../components/ui";
export function Dashboard() {
  const { state } = useStudy();
  const progress = Math.round(
    (lessons.filter((l) => state.completed.includes(l.id)).length /
      lessons.length) *
      100,
  );
  const last = state.lastLesson
    ? lessonById[state.lastLesson]
    : lessonById.statistics;
  const attempts = state.attempts;
  const latestExam = attempts.filter((a) => a.mode === "exam").at(-1);
  const score = latestExam
    ? summarize(
        latestExam.questionIds.map((id) => questionById[id]),
        latestExam.answers,
      )
    : null;
  const solved = new Set(
    attempts.flatMap((a) =>
      Object.keys(a.answers).filter((k) => a.answers[k].value.trim()),
    ),
  ).size;
  const weakChapters = chapters
    .map((c) => ({
      ...c,
      count: state.weak.filter((id) => questionById[id]?.chapterId === c.id)
        .length,
    }))
    .filter((c) => c.count)
    .sort((a, b) => b.count - a.count);
  const recommended = weakChapters[0]
    ? (lessons.find(
        (l) =>
          l.chapterId === weakChapters[0].id && !state.completed.includes(l.id),
      ) ?? lessons.find((l) => l.chapterId === weakChapters[0].id)!)
    : (lessons.find((l) => !state.completed.includes(l.id)) ?? last);
  return (
    <div className="dashboard page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR LEARNING, AT A GLANCE</div>
          <h1>
            오늘도, 이해가 쌓이는 시간<span className="heading-dot">.</span>
          </h1>
          <p>
            개념을 이해하고, 직접 적용하며 경제통계학을 나의 것으로 만들어
            보세요.
          </p>
        </div>
        <span className="semester-tag">
          <span />
          LESE152 · 학습 스튜디오
        </span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <span /> ONE CONCEPT AT A TIME
          </span>
          <h2>
            공식 너머의 의미를,
            <br />
            확실한 이해로.
          </h2>
          <p>
            작은 개념 하나부터 실전 문제까지.
            <br />
            나의 속도로 완성하는 경제통계학 시험 준비.
          </p>
          <Link
            className="button primary"
            to={state.activeAttempt ? "/session" : `/learn/${last.id}`}
          >
            {state.activeAttempt
              ? "진행 중인 문제 이어 풀기"
              : state.lastLesson
                ? "이어서 학습하기"
                : "첫 개념 시작하기"}
            <ArrowRight size={17} />
          </Link>
          <span className="hero-footnote">
            {lessons.length}개의 개념 · 6개 챕터 · 인터랙티브 학습
          </span>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-grid" />
          <span className="art-label art-label-top">
            A LITTLE CURIOUS. A LOT MORE CONFIDENT.
          </span>
          <svg viewBox="0 0 450 230">
            <defs>
              <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b9d86" stopOpacity=".45" />
                <stop offset="100%" stopColor="#a9ccba" stopOpacity=".06" />
              </linearGradient>
            </defs>
            <line x1="30" x2="423" y1="195" y2="195" stroke="#9fbbae" />
            <path
              d="M30 195 C90 195 100 178 133 122 C160 75 174 31 220 31 C263 31 277 77 309 131 C340 184 367 195 423 195 L30 195"
              fill="url(#curveFill)"
            />
            <path
              d="M30 195 C90 195 100 178 133 122 C160 75 174 31 220 31 C263 31 277 77 309 131 C340 184 367 195 423 195"
              fill="none"
              stroke="#467a63"
              strokeWidth="2.7"
            />
            <line
              x1="220"
              x2="220"
              y1="32"
              y2="201"
              stroke="#79a38a"
              strokeDasharray="4 5"
            />
            <circle cx="220" cy="31" r="5" fill="#285743" />
            <text x="218" y="220" fill="#46705c" fontSize="14">
              μ
            </text>
            <text x="127" y="220" fill="#789784" fontSize="12">
              −σ
            </text>
            <text x="303" y="220" fill="#789784" fontSize="12">
              +σ
            </text>
          </svg>
          <div className="art-note note-one">
            <span>EXPECTED VALUE</span>
            <strong>E[X] = μ</strong>
          </div>
          <div className="art-note note-two">
            <CheckCheck size={18} />
            <span>이해의 곡선을 그려요</span>
          </div>
        </div>
      </section>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon sage">
            <BookOpen size={20} />
          </span>
          <small>전체 학습 진행률</small>
          <strong>
            {progress}
            <em>%</em>
          </strong>
          <span>
            {lessons.filter((l) => state.completed.includes(l.id)).length} /{" "}
            {lessons.length}개 개념 완료
          </span>
          <Progress value={progress} label="전체 학습 진행률" />
        </div>
        <div className="stat-card">
          <span className="stat-icon blue">
            <CheckCheck size={20} />
          </span>
          <small>풀어 본 문제</small>
          <strong>
            {solved}
            <em>문제</em>
          </strong>
          <span>제출한 기록의 답안 기준</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon amber">
            <Target size={20} />
          </span>
          <small>최근 모의시험</small>
          <strong>
            {score ? score.autoEarned : "—"}
            {score && <em>/ {score.autoPossible}</em>}
          </strong>
          <span>
            {score
              ? `자동채점 · ${score.pending}점 미채점`
              : "첫 시험으로 실력을 확인해 보세요"}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-icon violet">
            <Bookmark size={20} />
          </span>
          <small>복습할 문제</small>
          <strong>
            {state.weak.length}
            <em>문제</em>
          </strong>
          <Link to="/practice?mode=weak">
            {state.weak.length
              ? "오답을 다시 내 것으로"
              : "차근차근 기록을 쌓아 보세요"}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <div className="dashboard-columns">
        <section>
          <div className="section-heading">
            <div>
              <h2>나의 학습 로드맵</h2>
              <p>기초부터 확률분포까지, 하나씩 연결해요.</p>
            </div>
            <Link className="text-link" to="/chapters">
              전체 보기
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="chapter-grid">
            {chapters.map((c) => {
              const items = lessons.filter((l) => l.chapterId === c.id),
                done = items.filter((l) =>
                  state.completed.includes(l.id),
                ).length;
              return (
                <Link
                  className={`chapter-card ${c.color}`}
                  to={`/chapters?chapter=${c.id}`}
                  key={c.id}
                >
                  <div className="chapter-card-top">
                    <span className={`chapter-icon ${c.color}`}>
                      <ChapterIcon id={c.id} />
                    </span>
                    <span className="eyebrow">CHAPTER 0{c.id}</span>
                    {c.id === 5 && <span className="tag">핵심 계산</span>}
                    <ChevronRight size={15} />
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.english}</p>
                  <div className="chapter-card-foot">
                    <span>{items.length}개 개념</span>
                    <b>
                      {done}/{items.length}
                    </b>
                  </div>
                  <Progress
                    value={Math.round((done / items.length) * 100)}
                    label={`${c.title} 진도`}
                  />
                </Link>
              );
            })}
          </div>
        </section>
        <aside className="right-rail">
          <section className="recommend-card">
            <div className="section-heading">
              <span className="eyebrow">
                <Sparkles size={15} /> TODAY'S PICK
              </span>
              <span className="tiny-tag">추천 학습</span>
            </div>
            <h3>{recommended.title}</h3>
            <p>{recommended.summary}</p>
            <div className="recommend-meta">
              <span>
                <BookOpen size={14} /> CH. 0{recommended.chapterId}
              </span>
              <span>
                <Clock3 size={14} /> 내 속도로 학습
              </span>
            </div>
            <Link
              className="button secondary full"
              to={`/learn/${recommended.id}`}
            >
              <Play size={15} /> 개념 학습하기
            </Link>
          </section>
          <section className="rail-lab">
            <span className="lab-mini">
              <FlaskConical size={24} />
            </span>
            <h3>
              숫자를 바꾸면,
              <br />
              이해가 달라져요.
            </h3>
            <p>
              분포를 직접 조절하며
              <br />
              공식의 의미를 확인해 보세요.
            </p>
            <div className="mini-bars" aria-hidden="true">
              {[15, 32, 55, 83, 100, 82, 55, 30, 13].map((h, i) => (
                <span style={{ height: `${h}%` }} key={i} />
              ))}
            </div>
            <Link to="/lab">
              분포 실험실 열기
              <ArrowUpRight size={16} />
            </Link>
          </section>
          <section className="weak-card">
            <h3>나의 취약 챕터</h3>
            {weakChapters.length ? (
              weakChapters.slice(0, 3).map((c) => (
                <Link to={`/chapters?chapter=${c.id}`} key={c.id}>
                  <span>
                    0{c.id} · {c.title}
                  </span>
                  <b>{c.count}문제</b>
                </Link>
              ))
            ) : (
              <p>
                문제를 풀면 복습이 필요한
                <br />
                챕터를 이곳에 알려드려요.
              </p>
            )}
          </section>
        </aside>
      </div>
      <section className="bottom-cta">
        <div className="cta-icon">
          <Target size={24} />
        </div>
        <div>
          <h3>배운 개념, 문제로 확인해 볼까요?</h3>
          <p>
            챕터별 연습부터 원본 세트 90분 모의시험까지. 지금의 이해를
            점검하세요.
          </p>
        </div>
        <Link className="button secondary" to="/practice">
          문제 풀러 가기
          <ArrowRight size={16} />
        </Link>
      </section>
      <p className="dashboard-disclosure">
        Lecture 1–5와 Lecture 6 정규분포까지, 원본 Practice Set 1–5를
        반영했습니다. 원문 예제와 보충 설명을 구분하며, 계산 오류의 검산 근거는
        감사 문서에서 확인할 수 있습니다.{" "}
        <Link to="/sources">자료 현황 보기 ↗</Link>
      </p>
    </div>
  );
}
