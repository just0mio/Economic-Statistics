import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Clock3,
  Send,
  Check,
  Flag,
} from "lucide-react";
import { useStudy } from "../lib/store";
import type { Question, Response } from "../data/types";
import {
  questionById,
  flattenQuestions,
  practiceSets,
} from "../data/questions";
import { difficultyLabels } from "../data/lessons";
import { submitAttempt } from "../lib/attempts";
import { remainingSeconds } from "../lib/storage";
import { Empty, Modal, Progress, QuestionSource } from "../components/ui";
function AnswerInput({
  q,
  response,
  onChange,
}: {
  q: Question;
  response?: Response;
  onChange: (value: string) => void;
}) {
  if (q.type === "mcq" || q.type === "tf")
    return (
      <fieldset className="answer-options">
        <legend className="sr-only">{q.question} 답안</legend>
        {q.options?.map((o, i) => {
          const value = q.type === "tf" ? String(i === 0) : String(i);
          return (
            <label
              key={i}
              className={`answer-option ${response?.value === value ? "selected" : ""}`}
            >
              <input
                type="radio"
                name={q.questionId}
                checked={response?.value === value}
                value={value}
                onChange={() => onChange(value)}
              />
              <span className="option-key">{i + 1}</span>
              <span>{o}</span>
              {response?.value === value && <Check size={18} />}
            </label>
          );
        })}
      </fieldset>
    );
  return (
    <label className="written-answer">
      <span>
        {q.type === "numeric"
          ? "수치 답안 (확률은 소수, 예: 0.25)"
          : "나의 풀이 · 근거와 계산 과정을 적어 보세요"}
      </span>
      {q.type === "numeric" ? (
        <>
          <input
            type="text"
            inputMode="decimal"
            aria-label={`${q.question} 수치 답안`}
            placeholder="숫자로 입력"
            value={response?.value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <small>
            허용오차 ±{q.tolerance ?? 0.000001} · 분수는 소수로 변환해 입력
          </small>
        </>
      ) : (
        <textarea
          aria-label={`${q.question} 풀이`}
          rows={8}
          placeholder="어떤 개념과 공식을 적용했나요? 풀이 과정을 자유롭게 작성하세요."
          value={response?.value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
export function Session() {
  const { state, update } = useStudy();
  const a = state.activeAttempt;
  const navigate = useNavigate();
  const [index, setLocalIndex] = useState(a?.currentIndex ?? 0),
    [confirm, setConfirm] = useState(false),
    [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);
  function finish() {
    if (!a) return;
    const id = a.id;
    update((s) => submitAttempt(s));
    navigate(`/results/${id}`, { replace: true });
  }
  useEffect(() => {
    if (a?.deadline && now >= a.deadline) finish();
  }, [now, a?.id]);
  const qs = a?.questionIds.map((id) => questionById[id]) ?? [];
  const q = qs[Math.min(index, qs.length - 1)];
  function setIndex(value: number | ((prev: number) => number)) {
    const next = typeof value === "function" ? value(index) : value;
    setLocalIndex(next);
    update((s) =>
      s.activeAttempt
        ? { ...s, activeAttempt: { ...s.activeAttempt, currentIndex: next } }
        : s,
    );
  }
  function saveAnswer(id: string, value: string) {
    update((s) => {
      if (!s.activeAttempt) return s;
      if (s.activeAttempt.deadline && Date.now() >= s.activeAttempt.deadline)
        return s;
      return {
        ...s,
        activeAttempt: {
          ...s.activeAttempt,
          answers: {
            ...s.activeAttempt.answers,
            [id]: { ...s.activeAttempt.answers[id], value },
          },
        },
      };
    });
  }
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (!q || e.altKey || e.ctrlKey || e.metaKey || confirm) return;
      if (
        (e.target as HTMLElement)?.closest(
          'input,textarea,select,button,a,[contenteditable="true"]',
        )
      )
        return;
      const n = Number(e.key) - 1;
      if (
        ["mcq", "tf"].includes(q.type) &&
        q.options &&
        n >= 0 &&
        n < q.options.length &&
        e.key.match(/^[1-9]$/)
      ) {
        e.preventDefault();
        saveAnswer(q.questionId, q.type === "tf" ? String(n === 0) : String(n));
      }
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [q?.questionId, a?.id, confirm]);
  if (!a || !q)
    return (
      <div className="page">
        <Empty title="진행 중인 학습이 없어요">
          <Link to="/practice">새 연습 시작하기</Link>
        </Empty>
      </div>
    );
  const flat = flattenQuestions(qs),
    answered = flat.filter((v) => a.answers[v.questionId]?.value.trim()).length;
  const remaining = remainingSeconds(a.deadline, now);
  const title =
    practiceSets.find((s) => s.id === a.setId)?.title ??
    {
      chapter: "챕터 연습",
      weak: "오답·북마크 복습",
      formula: "공식 연습",
      identify: "분포 선택 훈련",
    }[a.mode] ??
    "연습";
  function bookmark(id: string) {
    update((s) => ({
      ...s,
      bookmarks: s.bookmarks.includes(id)
        ? s.bookmarks.filter((v) => v !== id)
        : [...s.bookmarks, id],
    }));
  }
  return (
    <div className="page session-page">
      <div className="session-heading">
        <div>
          <Link className="back-link" to="/practice">
            <ArrowLeft size={15} /> 나중에 이어 풀기
          </Link>
          <h1>
            {title} <span>{a.mode === "exam" ? "모의시험" : "연습"}</span>
          </h1>
        </div>
        {remaining !== null ? (
          <div
            className={`timer ${remaining < 300 ? "urgent" : ""}`}
            role="timer"
            aria-label="남은 시험 시간"
          >
            <Clock3 size={20} />
            {Math.floor(remaining / 60)
              .toString()
              .padStart(2, "0")}
            :{(remaining % 60).toString().padStart(2, "0")}
          </div>
        ) : (
          <span className="save-indicator">
            <span /> 답안 자동 저장
          </span>
        )}
      </div>
      <Progress
        value={Math.round((answered / flat.length) * 100)}
        label="답안 작성 진도"
      />
      <div className="session-layout">
        <section className="question-panel">
          <div className="question-top">
            <span className="eyebrow">
              PART {q.part} · QUESTION {index + 1} / {qs.length}
            </span>
            <span className={`difficulty ${q.difficulty}`}>
              {difficultyLabels[q.difficulty]}
            </span>
            <span className="points">{q.points}점</span>
          </div>
          {q.context && (
            <div className="question-context">
              <small>대문항의 주어진 조건</small>
              <p>{q.context.question}</p>
              <p lang="en">{q.context.english}</p>
            </div>
          )}
          <h2>{q.question}</h2>
          <p className="question-english" lang="en">
            {q.english}
          </p>
          {q.subquestions ? (
            <div className="subquestions">
              {q.subquestions.map((sub, i) => (
                <div className="subquestion" key={sub.questionId}>
                  <div className="section-heading">
                    <h3>
                      ({i + 1}) {sub.question}
                    </h3>
                    <span className="points">{sub.points}점</span>
                    <button
                      className={`icon-button ${state.bookmarks.includes(sub.questionId) ? "bookmarked" : ""}`}
                      aria-label={`소문항 ${i + 1} 북마크`}
                      aria-pressed={state.bookmarks.includes(sub.questionId)}
                      onClick={() => bookmark(sub.questionId)}
                    >
                      <Bookmark size={17} />
                    </button>
                  </div>
                  <p className="question-english" lang="en">
                    {sub.english}
                  </p>
                  <AnswerInput
                    q={sub}
                    response={a.answers[sub.questionId]}
                    onChange={(v) => saveAnswer(sub.questionId, v)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <AnswerInput
              q={q}
              response={a.answers[q.questionId]}
              onChange={(v) => saveAnswer(q.questionId, v)}
            />
          )}
          {q.requiresExplanation && (
            <label className="written-answer tf-reason">
              <span>진위 판단의 짧은 설명 · 원문 요구사항</span>
              <textarea
                aria-label="참거짓 판단 근거"
                rows={4}
                value={a.answers[q.questionId]?.reason ?? ""}
                onChange={(e) => {
                  const reason = e.target.value;
                  update((s) => {
                    if (
                      !s.activeAttempt ||
                      (s.activeAttempt.deadline &&
                        Date.now() >= s.activeAttempt.deadline)
                    )
                      return s;
                    return {
                      ...s,
                      activeAttempt: {
                        ...s.activeAttempt,
                        answers: {
                          ...s.activeAttempt.answers,
                          [q.questionId]: {
                            value:
                              s.activeAttempt.answers[q.questionId]?.value ??
                              "",
                            reason,
                          },
                        },
                      },
                    };
                  });
                }}
                placeholder="왜 참 또는 거짓이라고 생각했나요?"
              />
              <small>
                3점 자동점수는 진위 선택 기준의 학습용 점수입니다. 작성한 설명은
                제출 후 원문 해설과 직접 비교합니다.
              </small>
            </label>
          )}
          <div className="question-actions">
            <button
              className={`text-button ${state.bookmarks.includes(q.questionId) ? "bookmarked" : ""}`}
              aria-pressed={state.bookmarks.includes(q.questionId)}
              onClick={() => bookmark(q.questionId)}
            >
              <Bookmark size={17} />
              {state.bookmarks.includes(q.questionId)
                ? "북마크됨"
                : "나중에 복습"}
            </button>
            <span>
              {q.type === "mcq" || q.type === "tf"
                ? "숫자 키 1–4로 답안 선택"
                : ""}
            </span>
          </div>
          <div className="question-navigation">
            <button
              className="button secondary"
              disabled={index === 0}
              onClick={() => {
                setIndex((v) => v - 1);
                window.scrollTo(0, 0);
              }}
            >
              <ArrowLeft size={16} />
              이전
            </button>
            {index < qs.length - 1 ? (
              <button
                className="button primary"
                onClick={() => {
                  setIndex((v) => v + 1);
                  window.scrollTo(0, 0);
                }}
              >
                다음 문제
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="button primary"
                onClick={() => setConfirm(true)}
              >
                답안 제출
                <Send size={16} />
              </button>
            )}
          </div>
          <QuestionSource q={q} />
        </section>
        <aside className="question-map">
          <h3>문항 내비게이션</h3>
          <p>
            {answered} / {flat.length}개 답안 작성
          </p>
          {(["A", "B", "C"] as const).map((part) => {
            const group = qs
              .map((v, i) => ({ q: v, i }))
              .filter((v) => v.q.part === part);
            return (
              group.length > 0 && (
                <div key={part}>
                  <span className="eyebrow">PART {part}</span>
                  <div className="question-dots">
                    {group.map(({ q: v, i }) => {
                      const children = v.subquestions ?? [v],
                        done = children.every((c) =>
                          a.answers[c.questionId]?.value.trim(),
                        );
                      return (
                        <button
                          key={v.questionId}
                          title={`Part ${part} 문제 ${i + 1}`}
                          aria-label={`문제 ${i + 1}${done ? " 작성 완료" : ""}`}
                          aria-current={index === i ? "step" : undefined}
                          className={`${index === i ? "current" : ""} ${done ? "answered" : ""}`}
                          onClick={() => {
                            setIndex(i);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            );
          })}
          <button
            className="button primary full"
            onClick={() => setConfirm(true)}
          >
            제출하고 결과 보기
            <Flag size={16} />
          </button>
          <p className="muted">
            {a.deadline
              ? "시간이 끝나면 자동 제출됩니다. 새로고침해도 남은 시간은 늘어나지 않습니다."
              : "시간 제한 없이 연습하세요. 답안은 이 브라우저에 저장됩니다."}
          </p>
        </aside>
      </div>
      {confirm && (
        <Modal title="답안을 제출할까요?" onClose={() => setConfirm(false)}>
          <p>
            작성한 답안 {answered}개 / {flat.length}개.{" "}
            {flat.length - answered > 0
              ? `미작성 ${flat.length - answered}개가 있습니다.`
              : "모든 답안을 작성했습니다."}
          </p>
          <p>
            객관식·참거짓·수치형은 자동채점됩니다. 설명형 답안은 모범답안과
            기준표로 직접 평가할 수 있습니다.
          </p>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => setConfirm(false)}
            >
              돌아가서 검토
            </button>
            <button className="button primary" onClick={finish}>
              제출 확정
              <Send size={16} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
