import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock3,
  RotateCcw,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { useStudy } from "../lib/store";
import { summarize } from "../lib/grading";
import { createAttempt } from "../lib/attempts";
import { questionById, practiceSets } from "../data/questions";
import { chapters, lessonById } from "../data/lessons";
import type { Question } from "../data/types";
import { Empty, MathBlock, QuestionSource } from "../components/ui";
const answerText = (q: Question, value: string | number | boolean) =>
  q.type === "mcq"
    ? (q.options?.[Number(value)] ?? "미응답")
    : q.type === "tf"
      ? String(value) === "true"
        ? "True · 참"
        : String(value) === "false"
          ? "False · 거짓"
          : "미응답"
      : String(value);
export function Results() {
  const { id } = useParams();
  const { state, update } = useStudy();
  const a = state.attempts.find((v) => v.id === id);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  if (!a)
    return (
      <div className="page">
        <Empty title="시험 기록을 찾을 수 없어요">
          <Link to="/history">학습 기록으로 이동</Link>
        </Empty>
      </div>
    );
  const qs = a.questionIds.map((v) => questionById[v]);
  const result = summarize(qs, a.answers);
  const previous = state.attempts
    .filter(
      (v) =>
        v.setId === a.setId &&
        v.mode === a.mode &&
        v.questionIds.join("|") === a.questionIds.join("|") &&
        v.id !== a.id &&
        (v.submittedAt ?? 0) < (a.submittedAt ?? 0),
    )
    .at(-1);
  const prevScore = previous
    ? summarize(
        previous.questionIds.map((v) => questionById[v]),
        previous.answers,
      )
    : null;
  const wrong = result.rows.filter(
    (r) =>
      r.grade.status === "incorrect" ||
      (r.grade.status === "self" && r.grade.earned < r.q.points),
  );
  function retry(onlyWrong: boolean) {
    if (state.activeAttempt) return;
    const selected = onlyWrong ? wrong.map((r) => r.q) : qs;
    if (!selected.length) return;
    update((s) => ({
      ...s,
      activeAttempt: createAttempt(selected, "practice", a!.setId),
    }));
    navigate("/session");
  }
  function selfGrade(questionId: string, value: string) {
    const q = questionById[questionId];
    const score = value === "" ? undefined : Number(value);
    if (
      score !== undefined &&
      (!Number.isFinite(score) || score < 0 || score > q.points)
    )
      return;
    update((s) => ({
      ...s,
      attempts: s.attempts.map((t) =>
        t.id !== a!.id
          ? t
          : {
              ...t,
              answers: {
                ...t.answers,
                [questionId]: {
                  value: t.answers[questionId]?.value ?? "",
                  selfScore: score,
                },
              },
            },
      ),
      weak:
        score === undefined
          ? s.weak
          : score < q.points
            ? [...new Set([...s.weak, questionId])]
            : s.weak.filter((v) => v !== questionId),
    }));
  }
  const title =
    practiceSets.find((s) => s.id === a.setId)?.title ?? "맞춤 연습";
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">REFLECT, REVIEW, GROW</span>
          <h1>한 번의 풀이, 한 걸음의 성장</h1>
          <p>
            {title} · {new Date(a.submittedAt!).toLocaleString("ko-KR")} ·{" "}
            {a.mode === "exam" ? "모의시험" : "연습"} 결과
          </p>
        </div>
        <Link className="button secondary" to="/history">
          전체 기록
          <ArrowRight size={16} />
        </Link>
      </div>
      {qs.some((q) => q.requiresExplanation) && (
        <div className="source-note">
          원본 참·거짓의 자동점수는 진위 선택 기준입니다. 작성한 설명의 타당성은
          해설과 직접 비교하며, 교수자의 설명 평가 점수를 대신하지 않습니다.
        </div>
      )}
      <div className="result-summary">
        <div className="result-main">
          <span>자동채점 점수</span>
          <strong>
            {result.autoEarned}
            <small> / {result.autoPossible}</small>
          </strong>
          <p>
            {result.pending > 0
              ? `설명형·보류 문항 ${result.pending}점은 아직 미채점입니다.`
              : `자가평가 ${result.selfEarned}점 포함 합계 ${result.earned}/${result.total}`}
          </p>
          <span className="tiny-tag">
            {result.pending > 0 ? "총점 미확정" : "자가평가 포함 점수"}
          </span>
          <p>이 풀이의 전체 배점: {result.total}점</p>
        </div>
        <div className="result-detail">
          <div>
            <span>자동채점 정답률</span>
            <b>
              {result.autoCount
                ? Math.round((result.correct / result.autoCount) * 100)
                : "—"}
              {result.autoCount ? "%" : ""}
            </b>
          </div>
          <div>
            <span>자동채점 문항</span>
            <b>
              {result.correct} / {result.autoCount}
            </b>
          </div>
          <div>
            <span>자가평가 점수</span>
            <b>{result.selfEarned}점</b>
          </div>
          <div>
            <span>미채점 배점</span>
            <b>{result.pending}점</b>
          </div>
          <div>
            <span>확보 점수 / 전체 배점</span>
            <b>
              {result.earned} / {result.total}
              {result.pending ? " (미확정)" : ""}
            </b>
          </div>
          {prevScore && (
            <div>
              <span>이전 동일 세트 대비 (자동)</span>
              <b>
                {result.autoEarned - prevScore.autoEarned >= 0 ? "+" : ""}
                {result.autoEarned - prevScore.autoEarned}점
              </b>
            </div>
          )}
        </div>
      </div>
      <div className="part-scores">
        {(["A", "B", "C"] as const).map((part) => {
          const data = summarize(
            qs.filter((q) => q.part === part),
            a.answers,
          );
          return (
            data.total > 0 && (
              <div key={part}>
                <span className="eyebrow">PART {part}</span>
                <h3>
                  {data.earned}
                  <small> / {data.total}</small>
                </h3>
                <p>
                  자동 {data.autoEarned}/{data.autoPossible} · 미채점{" "}
                  {data.pending}점
                </p>
              </div>
            )
          );
        })}
      </div>
      <section className="weakness-summary">
        <h2>다음에는 이 개념을 살펴보세요</h2>
        {wrong.length ? (
          <div className="weak-links">
            {[...new Set(wrong.map((r) => r.q.topicId))].map((topic) => (
              <Link key={topic} to={`/learn/${topic}`}>
                {lessonById[topic].title}
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        ) : (
          <p>
            {result.pending
              ? "자동채점 오답은 없습니다. 설명형 답안을 평가하면 복습할 개념을 더 정확하게 찾을 수 있어요."
              : "이번 풀이에서 틀린 문제는 없습니다. 다음 난이도에 도전해 보세요."}
          </p>
        )}
        <div className="button-row">
          <button
            className="button primary"
            disabled={!wrong.length || Boolean(state.activeAttempt)}
            onClick={() => retry(true)}
          >
            <RotateCcw size={16} />
            틀린 문제 다시 풀기
          </button>
          <button
            className="button secondary"
            disabled={Boolean(state.activeAttempt)}
            onClick={() => retry(false)}
          >
            전체 다시 풀기
          </button>
          {state.activeAttempt && (
            <Link to="/session">진행 중인 학습 이어가기 →</Link>
          )}
        </div>
      </section>
      <div className="section-heading">
        <div>
          <h2>문제별 풀이 돌아보기</h2>
          <p>자가평가는 직접 입력한 점수로 구분하여 저장됩니다.</p>
        </div>
        <select
          aria-label="결과 필터"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">모든 문항</option>
          <option value="incorrect">오답</option>
          <option value="pending">미채점</option>
          <option value="self">자가평가</option>
        </select>
      </div>
      <div className="result-questions">
        {result.rows
          .filter(
            (r) =>
              filter === "all" ||
              r.grade.status === filter ||
              (filter === "incorrect" &&
                r.grade.status === "self" &&
                r.grade.earned < r.q.points),
          )
          .map(({ q, grade }, i) => (
            <details
              className={`result-question ${grade.status}`}
              key={q.questionId}
              open={
                grade.status === "pending" ||
                grade.status === "self" ||
                undefined
              }
            >
              <summary>
                <span className="result-status-icon">
                  {grade.status === "correct" ? (
                    <CheckCircle2 size={20} />
                  ) : grade.status === "incorrect" ? (
                    <XCircle size={20} />
                  ) : (
                    <Clock3 size={20} />
                  )}
                </span>
                <span>
                  <small>
                    PART {q.part} · CH. {q.chapterId} ·{" "}
                    {chapters[q.chapterId - 1].title}
                  </small>
                  <strong>
                    {i + 1}. {q.question}
                  </strong>
                </span>
                <b>
                  {grade.status === "pending"
                    ? "미채점"
                    : grade.status === "self"
                      ? `자가 ${grade.earned}/${q.points}`
                      : `${grade.earned}/${q.points}`}
                </b>
                <ChevronDown size={17} />
              </summary>
              <div className="result-question-body">
                {q.context && (
                  <div className="question-context">
                    <small>대문항의 주어진 조건</small>
                    <p>{q.context.question}</p>
                    <p lang="en">{q.context.english}</p>
                  </div>
                )}
                <p className="question-english" lang="en">
                  {q.english}
                </p>
                <div className="answer-comparison">
                  <div>
                    <small>나의 답안</small>
                    <p>
                      {a.answers[q.questionId]?.value
                        ? answerText(q, a.answers[q.questionId].value)
                        : "미응답"}
                    </p>
                  </div>
                  <div>
                    <small>
                      {q.autoGrade === false
                        ? "원본 정답표 · 오류 검토 필요"
                        : "정답 · 모범답안"}
                    </small>
                    {q.setId === "formula" ? (
                      <>
                        <MathBlock formula={lessonById[q.topicId].formula} />
                        <p>{lessonById[q.topicId].symbols}</p>
                      </>
                    ) : (
                      <p>{answerText(q, q.correctAnswer)}</p>
                    )}
                  </div>
                </div>
                {q.requiresExplanation && (
                  <div className="tf-reason">
                    <h4>나의 진위 판단 근거</h4>
                    <p className="explanation-text">
                      {a.answers[q.questionId]?.reason || "설명 미작성"}
                    </p>
                    <small className="muted">
                      {q.autoGrade === false
                        ? "이 문항은 원문 오류로 자동채점하지 않습니다. 앱 검산·원문을 함께 검토하세요."
                        : "진위 자동점수는 학습용입니다. 위 설명의 타당성은 원문 해설과 비교하세요."}
                    </small>
                  </div>
                )}
                <h4>풀이와 해설</h4>
                <p className="explanation-text">{q.explanation}</p>
                {q.type === "numeric" && (
                  <small>허용오차 ±{q.tolerance ?? 0.000001}</small>
                )}
                {q.rubric && (
                  <div className="rubric">
                    <h4>
                      {q.autoGrade === false
                        ? "원문 오류 검토 · 자가평가 참고"
                        : "부분점수 기준"}
                    </h4>
                    <ul>
                      {q.rubric.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    <label>
                      자가평가 점수 (0–{q.points})
                      <input
                        type="number"
                        min={0}
                        max={q.points}
                        step={0.5}
                        aria-label={`${q.questionId} 자가평가 점수`}
                        placeholder="미채점"
                        value={a.answers[q.questionId]?.selfScore ?? ""}
                        onChange={(e) =>
                          selfGrade(q.questionId, e.target.value)
                        }
                      />
                    </label>
                    <small>
                      입력한 점수는 자동 판정이 아닌 자가평가입니다. 입력을
                      비우면 다시 미채점 상태가 됩니다.
                    </small>
                  </div>
                )}
                <div className="question-actions">
                  <Link to={`/learn/${q.topicId}`} className="text-link">
                    관련 개념 학습하기
                    <ArrowRight size={15} />
                  </Link>
                  <button
                    className="text-button"
                    aria-pressed={state.bookmarks.includes(q.questionId)}
                    onClick={() =>
                      update((s) => ({
                        ...s,
                        bookmarks: s.bookmarks.includes(q.questionId)
                          ? s.bookmarks.filter((id) => id !== q.questionId)
                          : [...s.bookmarks, q.questionId],
                      }))
                    }
                  >
                    <Bookmark size={16} />
                    {state.bookmarks.includes(q.questionId)
                      ? "북마크됨"
                      : "북마크"}
                  </button>
                </div>
                <QuestionSource q={q} answer />
              </div>
            </details>
          ))}
      </div>
    </div>
  );
}
export function HistoryPage() {
  const { state } = useStudy();
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PROGRESS, OVER TIME</span>
          <h1>학습 기록</h1>
          <p>점수만이 아니라, 이해가 깊어지는 과정을 기록합니다.</p>
        </div>
        <Link className="button primary" to="/practice">
          새 연습 시작
          <ArrowRight size={16} />
        </Link>
      </div>
      {state.attempts.length ? (
        <div className="history-list">
          {[...state.attempts].reverse().map((a) => {
            const score = summarize(
              a.questionIds.map((id) => questionById[id]),
              a.answers,
            );
            return (
              <Link to={`/results/${a.id}`} key={a.id}>
                <span className="history-icon">
                  <CheckCircle2 size={24} />
                </span>
                <div>
                  <h3>
                    {practiceSets.find((s) => s.id === a.setId)?.title ??
                      "맞춤 연습"}{" "}
                    · {a.mode === "exam" ? "모의시험" : "연습"}
                  </h3>
                  <p>
                    {new Date(a.submittedAt!).toLocaleString("ko-KR")} ·{" "}
                    {a.questionIds.length}문항
                  </p>
                </div>
                <div className="history-score">
                  <strong>
                    자동 {score.autoEarned}/{score.autoPossible}
                  </strong>
                  <small>
                    {score.pending
                      ? `${score.pending}점 미채점`
                      : `자가평가 포함 ${score.earned}/${score.total}`}
                  </small>
                </div>
                <ArrowRight size={18} />
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty title="아직 제출한 풀이가 없어요">
          문제를 풀고 제출하면 점수와 오답 분석을 이곳에서 볼 수 있어요.
        </Empty>
      )}
    </div>
  );
}
