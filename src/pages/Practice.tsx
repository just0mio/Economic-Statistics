import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Target,
  RotateCcw,
  FunctionSquare,
  Shapes,
  Clock3,
  Layers,
  Play,
} from "lucide-react";
import { chapters, difficultyLabels } from "../data/lessons";
import {
  practiceSets,
  flattenQuestions,
  questionById,
  formulaQuestions,
  identificationQuestions,
  conceptQuestions,
} from "../data/questions";
import type { Difficulty, Question } from "../data/types";
import { useStudy } from "../lib/store";
import { createAttempt } from "../lib/attempts";
import { SourceNote, Empty, Modal } from "../components/ui";
const modes = [
  {
    id: "practice",
    title: "세트별 연습",
    en: "Practice Sets",
    icon: BookOpen,
    description: "원본 3개와 창작 보충 5개 세트",
  },
  {
    id: "chapter",
    title: "챕터별 연습",
    en: "Chapter Practice",
    icon: Layers,
    description: "지금 학습한 챕터에 집중하기",
  },
  {
    id: "weak",
    title: "오답·북마크 복습",
    en: "Weakness Review",
    icon: RotateCcw,
    description: "헷갈렸던 문제를 다시 내 것으로",
  },
  {
    id: "exam",
    title: "모의시험",
    en: "Exam Simulation",
    icon: Target,
    description: "원본 90분 · 보충 60분, 실전처럼",
  },
  {
    id: "formula",
    title: "공식 연습",
    en: "Formula Practice",
    icon: FunctionSquare,
    description: "공식과 기호의 의미를 직접 설명하기",
  },
  {
    id: "identify",
    title: "분포 선택 훈련",
    en: "Distribution Identification",
    icon: Shapes,
    description: "상황에 적합한 확률분포 판단하기",
  },
];
export function Practice() {
  const [params, setParams] = useSearchParams();
  const raw =
    params.get("mode") ?? (params.has("chapter") ? "chapter" : "practice");
  const mode = modes.some((m) => m.id === raw) ? raw : "practice";
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [chapter, setChapter] = useState(Number(params.get("chapter")) || 5);
  const [discard, setDiscard] = useState(false);
  const [family, setFamily] = useState<"original" | "supplement">("original");
  const [batch, setBatch] = useState(0);
  const { state, update } = useStudy();
  const navigate = useNavigate();
  const pool =
    mode === "formula"
      ? formulaQuestions
      : mode === "identify"
        ? identificationQuestions
        : mode === "weak"
          ? [...new Set([...state.weak, ...state.bookmarks])].map(
              (id) => questionById[id],
            )
          : [
              ...flattenQuestions(practiceSets.flatMap((s) => s.questions)),
              ...conceptQuestions,
            ].filter((q) => q.chapterId === chapter);
  const candidates = flattenQuestions(pool)
    .filter(
      (q, i, arr) => arr.findIndex((v) => v.questionId === q.questionId) === i,
    )
    .filter((q) => difficulty === "all" || q.difficulty === difficulty);
  useEffect(() => setBatch(0), [mode, difficulty, chapter]);
  const maxBatch = Math.max(0, Math.ceil(candidates.length / 15) - 1);
  const currentBatch = Math.min(batch, maxBatch);
  const selected = candidates.slice(currentBatch * 15, (currentBatch + 1) * 15);
  function start(qs: Question[], setId: string, minutes = 60) {
    if (state.activeAttempt) return;
    update((s) => ({
      ...s,
      activeAttempt: createAttempt(qs, mode, setId, minutes),
    }));
    navigate("/session");
  }
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">TURN UNDERSTANDING INTO CONFIDENCE</span>
          <h1>문제 풀기</h1>
          <p>지금 필요한 방식으로 연습하고, 한 단계 더 확실하게 이해하세요.</p>
        </div>
        <span className="pill">원본 3개 · 보충 5개 · 각 100점</span>
      </div>
      <SourceNote />
      <div className="mode-grid">
        {modes.map((m) => (
          <button
            key={m.id}
            className={`mode-card ${mode === m.id ? "active" : ""}`}
            onClick={() => setParams({ mode: m.id })}
          >
            <m.icon size={22} />
            <h3>{m.title}</h3>
            <span>{m.en}</span>
            <p>{m.description}</p>
          </button>
        ))}
      </div>
      {state.activeAttempt && (
        <div className="active-banner">
          <div>
            <strong>진행 중인 학습이 있어요</strong>
            <p>이전에 작성한 답안과 시험 마감시간이 저장되어 있습니다.</p>
          </div>
          <Link className="button primary" to="/session">
            이어서 풀기
            <Play size={16} />
          </Link>
          <button className="text-button" onClick={() => setDiscard(true)}>
            진행 취소
          </button>
        </div>
      )}
      <div className="section-heading">
        <div>
          <h2>{modes.find((m) => m.id === mode)?.title}</h2>
          <p>
            {mode === "exam"
              ? "PS1과 같은 10 MCQ + 10 T/F + 3 Short Answers 형식입니다. 원본 세트는 PDF 권장시간 80–95분 중 90분을 적용합니다."
              : "정답과 해설은 제출 후에 확인할 수 있어요."}
          </p>
        </div>
        <label className="inline-label">
          난이도
          <select
            aria-label="난이도 필터"
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as Difficulty | "all")
            }
          >
            <option value="all">전체 난이도</option>
            {Object.entries(difficultyLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
      {mode === "practice" || mode === "exam" ? (
        <>
          <div className="filter-row">
            <button
              className={family === "original" ? "filter active" : "filter"}
              onClick={() => setFamily("original")}
            >
              원본 Practice Set 1–3
            </button>
            <button
              className={family === "supplement" ? "filter active" : "filter"}
              onClick={() => setFamily("supplement")}
            >
              창작 보충 연습 1–5
            </button>
          </div>
          <div className="set-grid">
            {practiceSets
              .filter((s) => Boolean(s.original) === (family === "original"))
              .filter(
                (s) => difficulty === "all" || s.difficulty === difficulty,
              )
              .map((s, i) => (
                <article className="set-card" key={s.id}>
                  <div className="set-card-top">
                    <span className="set-number">
                      {s.title.split(" ").at(-1)?.padStart(2, "0")}
                    </span>
                    <span className={`difficulty ${s.difficulty}`}>
                      {difficultyLabels[s.difficulty]}
                    </span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <div className="set-parts">
                    <span>
                      Part A <b>10문항 · 20점</b>
                    </span>
                    <span>
                      Part B <b>10문항 · 30점</b>
                    </span>
                    <span>
                      Part C <b>3대문항 · 50점</b>
                    </span>
                  </div>
                  <div className="set-footer">
                    <span>
                      <Clock3 size={14} />
                      {mode === "exam"
                        ? `${s.minutes}분 제한`
                        : "시간 제한 없음"}
                    </span>
                    <span>100점</span>
                  </div>
                  <button
                    className={`button ${i === 0 ? "primary" : "secondary"} full`}
                    disabled={Boolean(state.activeAttempt)}
                    onClick={() => start(s.questions, s.id, s.minutes)}
                  >
                    {mode === "exam" ? "모의시험 시작" : "연습 시작"}
                    <ArrowRight size={16} />
                  </button>
                  <small>
                    {s.original
                      ? "제공된 원문 · 문항·정답·배점 보존"
                      : "창작 보충 문제 · 원본 세트와 별도"}
                  </small>
                </article>
              ))}
          </div>
          {family === "original" && (
            <div className="missing-sets">
              <span>Practice Set 4 · 자료 미제공</span>
              <span>Practice Set 5 · 자료 미제공</span>
              <p>
                원문 파일이 없어 문항과 답안을 수록하지 않았습니다. 창작 보충
                연습 4–5와 구분합니다.
              </p>
            </div>
          )}
        </>
      ) : (
        <section className="custom-practice">
          {mode === "chapter" && (
            <div className="filter-row">
              {chapters.map((c) => (
                <button
                  key={c.id}
                  className={chapter === c.id ? "filter active" : "filter"}
                  onClick={() => setChapter(c.id)}
                >
                  Chapter {c.id}
                </button>
              ))}
            </div>
          )}
          {selected.length ? (
            <>
              <h3>
                {mode === "chapter"
                  ? chapters.find((c) => c.id === chapter)?.title
                  : mode === "weak"
                    ? "놓쳤던 개념, 다시 한 번"
                    : mode === "formula"
                      ? "공식을 설명할 수 있나요?"
                      : "이 상황에는 어떤 분포일까요?"}
              </h3>
              <p>
                {candidates.length}개 대상 중 {selected.length}문제를
                연습합니다.
                {candidates.length > 15
                  ? ` 이번 범위: ${currentBatch * 15 + 1}–${Math.min((currentBatch + 1) * 15, candidates.length)}번.`
                  : ""}
              </p>
              {candidates.length > 15 && (
                <div className="button-row">
                  <button
                    className="button secondary"
                    disabled={currentBatch === 0}
                    onClick={() => setBatch((v) => v - 1)}
                  >
                    이전 15문항
                  </button>
                  <button
                    className="button secondary"
                    disabled={currentBatch === maxBatch}
                    onClick={() => setBatch((v) => v + 1)}
                  >
                    다음 15문항
                  </button>
                </div>
              )}
              {mode === "formula" && (
                <p>
                  설명형 답안을 작성한 후 공식·유도·기호와 채점 기준을 비교해
                  직접 평가합니다.
                </p>
              )}
              <button
                className="button primary"
                disabled={Boolean(state.activeAttempt)}
                onClick={() =>
                  start(
                    selected,
                    mode === "chapter" ? `chapter-${chapter}` : mode,
                  )
                }
              >
                연습 시작
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <Empty title="조건에 맞는 문제가 없어요">
              {mode === "weak"
                ? "틀린 문제나 북마크한 문제가 생기면 이곳에서 다시 풀 수 있어요."
                : "다른 난이도나 챕터를 선택해 보세요."}
            </Empty>
          )}
        </section>
      )}
      <div className="original-materials">
        <h3>원본 Practice Set · 교수자 PS1</h3>
        <p>
          Practice Set 1–3은 제공된 원문에서 추출했습니다. 교수자 PS1은
          자료실에서 별도 참고자료로 제공하며, 실제 제출용 과제와 연습 기록을
          구분합니다.
        </p>
        <Link to="/sources" className="text-link">
          자료 현황 확인
          <ArrowRight size={15} />
        </Link>
      </div>
      {discard && (
        <Modal
          title="진행 중인 학습을 취소할까요?"
          onClose={() => setDiscard(false)}
        >
          <p>
            아직 제출하지 않은 답안이 삭제됩니다. 기존에 제출한 기록은
            유지됩니다.
          </p>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => setDiscard(false)}
            >
              계속 보관
            </button>
            <button
              className="button danger"
              onClick={() => {
                update((s) => ({ ...s, activeAttempt: null }));
                setDiscard(false);
              }}
            >
              미제출 답안 삭제
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
