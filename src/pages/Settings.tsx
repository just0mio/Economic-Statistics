import { useState } from "react";
import {
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Sun,
  Moon,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import type { StudyState } from "../data/types";
import { useStudy } from "../lib/store";
import { initialState, parseBackup } from "../lib/storage";
import { Modal } from "../components/ui";
export function Settings() {
  const { state, update } = useStudy();
  const [reset, setReset] = useState(false),
    [pending, setPending] = useState<StudyState | null>(null),
    [message, setMessage] = useState("");
  function download() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lese152-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("현재 학습 기록을 JSON 파일로 내보냈습니다.");
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 5_000_000) throw new Error("백업은 5MB 이하여야 합니다.");
      setPending(parseBackup(await file.text()));
      setMessage("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "백업을 읽지 못했습니다.");
    }
  }
  return (
    <div className="page settings-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE THIS SPACE YOURS</span>
          <h1>설정 및 데이터</h1>
          <p>학습 기록은 로그인 없이 이 브라우저에 보관됩니다.</p>
        </div>
      </div>
      {message && (
        <div className="alert neutral" role="status">
          {message}
        </div>
      )}
      <section className="settings-section">
        <h2>화면 모드</h2>
        <p>오래 읽어도 편안한 화면을 선택하세요.</p>
        <div className="button-row">
          <button
            className={`button ${state.theme === "light" ? "primary" : "secondary"}`}
            onClick={() => update((s) => ({ ...s, theme: "light" }))}
          >
            <Sun size={17} />
            라이트
          </button>
          <button
            className={`button ${state.theme === "dark" ? "primary" : "secondary"}`}
            onClick={() => update((s) => ({ ...s, theme: "dark" }))}
          >
            <Moon size={17} />
            다크
          </button>
        </div>
      </section>
      <section className="settings-section">
        <h2>학습 데이터 백업</h2>
        <div className="privacy-note">
          <ShieldCheck size={22} />
          <p>
            진도, 북마크, 오답, 시험 답안은 localStorage에 저장됩니다. 브라우저
            데이터를 삭제하거나 다른 기기를 사용하면 자동으로 동기화되지
            않습니다. JSON 백업으로 옮길 수 있습니다.
          </p>
        </div>
        <div className="backup-stats">
          <span>
            완료 개념 <b>{state.completed.length}</b>
          </span>
          <span>
            시험·연습 기록 <b>{state.attempts.length}</b>
          </span>
          <span>
            북마크 <b>{state.bookmarks.length}</b>
          </span>
          <span>
            진행 중 <b>{state.activeAttempt ? "있음" : "없음"}</b>
          </span>
        </div>
        <div className="button-row">
          <button className="button primary" onClick={download}>
            <Download size={17} />
            JSON 백업 다운로드
          </button>
          <label className="button secondary file-button">
            <Upload size={17} />
            백업 파일 불러오기
            <input
              aria-label="백업 JSON 선택"
              type="file"
              accept="application/json,.json"
              onChange={(e) => {
                void importFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="muted">
          불러오기 전에 파일 형식·문항 ID·배점·진행 기록을 검증합니다. 복원은
          현재 기록을 대체합니다.
        </p>
      </section>
      <section className="settings-section danger-zone">
        <h2>학습 기록 초기화</h2>
        <p>
          완료 개념, 문제 답안, 시험 기록, 북마크와 화면 설정을 모두
          초기화합니다.
        </p>
        <button className="button danger" onClick={() => setReset(true)}>
          <Trash2 size={17} />
          데이터 초기화
        </button>
      </section>
      {reset && (
        <Modal
          title="학습 기록을 모두 초기화할까요?"
          onClose={() => setReset(false)}
        >
          <p>
            이 브라우저의 학습 기록이 삭제됩니다. 필요한 기록은 먼저 JSON으로
            백업하세요.
          </p>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => setReset(false)}
            >
              취소
            </button>
            <button
              className="button danger"
              onClick={() => {
                update(() => initialState(), true);
                setReset(false);
                setMessage("학습 기록을 초기화했습니다.");
              }}
            >
              모든 기록 삭제
            </button>
          </div>
        </Modal>
      )}
      {pending && (
        <Modal title="백업을 복원할까요?" onClose={() => setPending(null)}>
          <p>
            완료 개념 {pending.completed.length}개, 제출 기록{" "}
            {pending.attempts.length}개, 북마크 {pending.bookmarks.length}개를
            불러옵니다. 현재 기록을 대체합니다.
          </p>
          {pending.activeAttempt?.deadline && (
            <p>
              시험의 원래 마감시간이 유지됩니다. 이미 시간이 지났다면 시험
              화면에서 자동 제출됩니다.
            </p>
          )}
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => setPending(null)}
            >
              취소
            </button>
            <button
              className="button primary"
              onClick={() => {
                update(() => pending, true);
                setPending(null);
                setMessage("백업 데이터를 복원했습니다.");
              }}
            >
              기록 복원
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
const originals = [
  "경제통계학.pdf",
  "LESE152_PS1.pdf",
  ...Array.from({ length: 5 }, (_, i) => `LESE152_Practice_Set_${i + 1}.pdf`),
];
export function Sources() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">TRANSPARENT SOURCES, BETTER LEARNING</span>
          <h1>자료 및 콘텐츠 출처</h1>
          <p>확인된 자료와 보충 설명을 명확하게 구분합니다.</p>
        </div>
      </div>
      <div className="source-explanation">
        <h2>강의 전체와 원본 연습 3개를 반영했습니다.</h2>
        <p>
          제공된 강의 PDF는 269페이지입니다. Lecture 1–5와 Lecture 2의 중복
          버전을 검토하고, 확장본의 추가 예제와 확률분포를 연결했습니다. PS1은
          7페이지, Practice Set 1–3은 각각 6페이지입니다.
        </p>
        <p>
          한국어 설명·유도·확인 퀴즈는 학습을 위해 재구성했습니다. “원문 예제”는
          페이지를 표시하고, 창작 보충 세트는 원본 세트와 별도로 제공합니다.
          원문 PDF는 수정 없이 보관했으며 검산에서 발견한 오류는 감사 문서에
          남겼습니다.
        </p>
      </div>
      <div className="source-list">
        {originals.map((f, i) => (
          <article key={f}>
            <span className="file-icon">
              <FileText size={23} />
            </span>
            <div>
              <h3>{f}</h3>
              <p>
                {i === 0
                  ? "강의 원본 · 269페이지 · Lecture 1–5"
                  : i === 1
                    ? "교수자 과제 · 7페이지 · 연습 세트와 별도 참고자료"
                    : `원본 Practice Set ${i - 1} · 창작 보충 연습과 구분`}
              </p>
            </div>
            {i <= 4 ? (
              <a
                className="button secondary"
                href={`./materials/${i === 0 ? "lecture.pdf" : f}`}
                target="_blank"
                rel="noreferrer"
              >
                원본 PDF ↗
              </a>
            ) : (
              <span className="missing-tag">자료 미제공</span>
            )}
          </article>
        ))}
      </div>
      <section className="settings-section">
        <h2>콘텐츠를 읽을 때 알아두세요</h2>
        <ul className="readable-list">
          <li>
            6개 Chapter는 사용자 요청 범위에 맞춘 구성입니다. 원본 Lecture와의
            일대일 대응이 아닙니다.
          </li>
          <li>
            Chapter 6은 PS1에서 확인한 연속균등(MC5), 정규(C3d), 지수분포와
            무기억성(TF10)을 다룹니다. 제공된 Lecture 1–5에는 이 연속분포의 상세
            단원이 없습니다.
          </li>
          <li>
            원본 Practice Set 1–3의 문항·정답·배점은 유지했습니다. 보충 연습
            1–5는 별도의 창작 문제입니다. 원본 Set 4–5와 기존 앱 초안은
            미제공입니다.
          </li>
          <li>
            R 예제는 실행 코드와 예상 결과를 제공합니다. 강의의 농업·기상 CSV는
            미제공이므로 원문에 보고된 상관계수와 앱에서 검산한 수치를
            구분합니다. 브라우저 내 R 런타임은 포함하지 않습니다.
          </li>
          <li>
            지수·정규 계산은 수치 근사를 포함합니다. 정규 CDF의 절대오차는 약
            7.5×10⁻⁸ 이하인 근사식을 사용합니다.
          </li>
        </ul>
      </section>
      <section className="settings-section">
        <h2>교수자 PS1 · 과제 참고</h2>
        <p>
          10 MCQ(20점), 10 T/F(30점, 설명 요구), 3개 Short Answers(15+15+20점)의
          100점 형식을 확인했습니다. Practice Set과 과제 제출물을 혼동하지
          않도록 PS1은 PDF 참고자료로 제공합니다.
        </p>
        <p>
          C2(c)의 두 트랩은 감염 여부에 <strong>조건부로 독립</strong>이라는
          해석 아래 반복 베이즈 계산을 합니다. 전체 표본에서 결과 자체가
          독립이라는 뜻과 구분해야 합니다. 원문에는 공식 답안이 포함되지
          않았습니다.
        </p>
        <a
          className="button secondary"
          href="./materials/LESE152_PS1.pdf"
          target="_blank"
          rel="noreferrer"
        >
          교수자 PS1 원문 열기 ↗
        </a>
      </section>
      <div className="audit-links">
        <a href="./CONTENT_AUDIT.md" download>
          <FileText size={19} />
          콘텐츠 감사 문서
          <ArrowUpRight size={16} />
        </a>
        <a href="./QUESTION_AUDIT.md" download>
          <FileText size={19} />
          문항 검증 문서
          <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
}
