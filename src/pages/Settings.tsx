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
const materials = [
  {
    file: "lecture.pdf",
    title: "경제통계학.pdf",
    detail: "원본 합본 269쪽 · Lecture 1–5 · 수정 없이 보관",
  },
  {
    file: "L4_Probability.pdf",
    title: "Lecture 4 · Probability",
    detail: "합본 187–228쪽에서 추출한 42쪽 발췌본 · 새로 제공된 원본이 아님",
  },
  {
    file: "L5_Discrete_Random_Variables.pdf",
    title: "Lecture 5 · Discrete Random Variables",
    detail: "합본 229–269쪽에서 추출한 41쪽 발췌본 · 손글씨 삽입 포함",
  },
  {
    file: "L6_Exam_Scope_Through_Normal.pdf",
    title: "Lecture 6 · 시험범위본",
    detail: "첨부 원본의 1–18쪽 발췌 · 연속확률변수, 연속균등, 정규분포까지",
  },
  {
    file: "L6_Continuous_Random_Variables.pdf",
    title: "Lecture 6 · 전체 원본",
    detail: "32쪽 원본 보존 · 19–32쪽은 이번 지정 범위에 포함하지 않음",
  },
  {
    file: "LESE152_PS1.pdf",
    title: "교수자 PS1",
    detail: "7쪽 · 실제 과제 참고 · 연습 세트와 구분",
  },
  ...Array.from({ length: 5 }, (_, i) => ({
    file: `LESE152_Practice_Set_${i + 1}.pdf`,
    title: `Practice Set ${i + 1}`,
    detail: `제공된 원본 ${i < 3 ? 6 : 8}쪽 · 100점 · 범위 밖 문항과 원문 오류는 별도 표시`,
  })),
];
export function Sources() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">TRANSPARENT SOURCES, BETTER LEARNING</span>
          <h1>자료 및 콘텐츠 출처</h1>
          <p>원문·추출본·앱의 보완 설명과 시험범위를 구분합니다.</p>
        </div>
      </div>
      <div className="source-explanation">
        <h2>Lecture 6 정규분포까지 · 원본 Practice Set 1–5</h2>
        <p>
          기존 269쪽 합본과 새 Lecture 6 원본 32쪽을 확인했습니다. 이번
          시험범위의 Lecture 6은 1–18쪽이며 19쪽 이후 다변량 단원과 뒤의
          연습문제는 추가하지 않았습니다. 지수분포는 기존 PS1의 범위 밖
          보충으로만 유지합니다.
        </p>
        <p>
          Lecture 4·5는 기존 합본에서 내용과 순서를 바꾸지 않고 발췌하여 함께
          제공합니다. 독립된 새 Lecture 4·5 원본을 제공받았다고 표현하지
          않습니다. 한국어 설명·유도·퀴즈와 원문 예제는 페이지 표시로
          구분합니다.
        </p>
      </div>
      <div className="source-list">
        {materials.map((m) => (
          <article key={m.file}>
            <span className="file-icon">
              <FileText size={23} />
            </span>
            <div>
              <h3>{m.title}</h3>
              <p>{m.detail}</p>
            </div>
            <a
              className="button secondary"
              href={`./materials/${m.file}`}
              target="_blank"
              rel="noreferrer"
            >
              PDF 열기 ↗
            </a>
          </article>
        ))}
      </div>
      <section className="settings-section">
        <h2>시험범위와 원문 검산</h2>
        <ul className="readable-list">
          <li>
            6개 Chapter는 학습용 구성입니다. Lecture와 항상 일대일로 대응하지
            않습니다. Chapter 6의 연속균등·정규·분위수는 이제 실제 Lecture 6의
            출처를 연결합니다.
          </li>
          <li>
            챕터·공식·오답 연습은 범위 밖 보충과 원문 오류 보류 문항을 기본
            제외합니다. 원본 전체 세트는 원래 100점 구조를 유지하므로 범위 밖
            문항이 포함됩니다. “시험범위 연습”은 해당 소문항만 선택하며 100점
            시험으로 환산하지 않습니다.
          </li>
          <li>
            새 원본 Set 4·5에는 PDF 화면에서도 일부 음수 부호·지수가 누락되어
            있습니다. 원문 영어·정답표는 보존하고 보완한 한국어 조건과 계산
            근거를 명시했습니다. Set 5 MC4(선택지 부호), TF10(지수 누락)은
            자동채점하지 않으며 미채점/자가평가로 구분합니다.
          </li>
          <li>
            Lecture 6의 안전재고 원문은 약623개로 반올림합니다. 정확한 연속
            임계값은 약623.2249, 정수로 부족확률≤2%를 만족하는
            재고는624개입니다. 원문은 수정하지 않고 계산기와 감사 문서에 차이를
            표시합니다.
          </li>
          <li>
            R 예제는 코드·예상 출력·해설입니다. 원본 농업·기상 CSV와 브라우저 내
            R 실행기는 제공되지 않았습니다.
          </li>
          <li>
            정규 CDF는 절대오차 약7.5×10⁻⁸ 이하인 수치 근사입니다. 실제
            iPad/Safari 시험과 Chromium 반응형 검증을 구분합니다.
          </li>
        </ul>
      </section>
      <section className="settings-section">
        <h2>교수자 PS1 · 과제 참고</h2>
        <p>
          10 MCQ(20점), 10 T/F(30점, 설명 요구), 3개 Short Answers(15+15+20점)의
          100점 형식입니다. 공식 답안은 제공되지 않았으며 앱 독립 검산과
          구분합니다. C2(c)의 반복 검사는 감염 상태에 조건부인 독립으로
          해석합니다.
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
        {["CONTENT_AUDIT.md", "QUESTION_AUDIT.md"].map((file) => (
          <a key={file} href={`./${file}`} download>
            <FileText size={19} />
            {file === "CONTENT_AUDIT.md"
              ? "콘텐츠 감사 문서"
              : "문항 검증 문서"}
            <ArrowUpRight size={16} />
          </a>
        ))}
      </div>
    </div>
  );
}
