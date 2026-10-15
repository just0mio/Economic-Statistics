# LESE152 경제통계학 스튜디오

**[PC용 실행 ZIP 다운로드](https://github.com/just0mio/Economic-Statistics/raw/refs/heads/main/releases/LESE152-portable.zip)** · **[전체 소스 ZIP 다운로드](https://github.com/just0mio/Economic-Statistics/raw/refs/heads/main/releases/LESE152-source.zip)** · [열기·설치 안내](DOWNLOADS.md)

경제통계학 개념을 한국어 설명·영어 정의·수식·계산 예제와 함께 학습하고, 원본 연습문제와 모의시험으로 확인하는 로컬 웹앱입니다. React, TypeScript, Vite, Tailwind CSS, React Router, KaTeX, Recharts, Lucide, localStorage, Vitest를 사용합니다. 로그인과 서버 DB는 필요하지 않습니다.

## 실행

### Codex 화면에서 앱이 열리지 않는 경우

현재 클라우드 환경 설정 화면은 실행 중인 웹앱 미리보기를 지원하지 않습니다. `/workspace/...` 링크는 클라우드 작업 파일의 경로이며 공개 웹사이트 주소가 아닙니다. 환경 게시도 웹 호스팅을 의미하지 않습니다.

PC용 설치 없는 실행 파일은 `releases/LESE152-portable.zip`입니다. ZIP 전체를 내려받아 압축을 해제하고 `LESE152/index.html`을 Chrome 또는 Edge에서 여세요. 스크립트·스타일·수식·폰트가 HTML에 포함되어 개발 서버 없이 학습·문제 풀이·그래프가 동작합니다. 원본 PDF 링크를 이용하려면 함께 들어 있는 `materials/` 폴더를 유지하세요. 브라우저나 파일 위치를 옮기기 전 설정에서 학습 기록 JSON을 백업하세요. 파일 URL에서의 저장 동작은 브라우저마다 다를 수 있습니다.

이 파일은 GPT 채팅 안에서 실행하는 앱이 아닙니다. Codex 화면에서 파일 다운로드가 제공되지 않는 경우, 저장소 파일을 컴퓨터로 가져온 뒤 아래 실행 명령을 사용하세요. iPad/iPhone의 파일 미리보기는 JavaScript 실행을 보장하지 않으므로 모바일에는 별도 HTTPS 웹 호스팅이 필요합니다. 공개 배포는 아직 수행하지 않았습니다.

다시 생성하려면 Node.js와 선택 사항인 Python 3를 설치한 환경에서 다음을 실행합니다. 일반 앱 개발과 실행에는 Python이 필요하지 않습니다.

```bash
npm run build:portable
npm run test:portable
```

`portable/index.html`, 원본 PDF를 포함한 실행 ZIP, 전체 소스 ZIP을 생성합니다. 기존 `npm run build` 결과인 `dist/`는 웹 서버용으로 계속 유지합니다.

현재 클라우드 Chromium은 관리 정책상 `file://` 접근을 차단합니다. 따라서 `test:portable`은 HTML 한 개만 메모리에서 제공하고 외부 네트워크를 차단한 채 계산·저장·시험을 검증합니다. 제한 없는 PC 브라우저의 직접 파일 열기는 `npm run test:portable -- --file`로 별도 확인할 수 있습니다. 이 환경에서 직접 파일 열기까지 통과했다고 주장하지 않습니다.

### 개발 서버로 실행

Node.js **22.12 이상**이 필요합니다. 개발 환경에서 검증한 버전은 Node 24.19.0, npm 11.9.0입니다. 기존 저장소 디렉터리에서 실행하세요.

```bash
cd /workspace/Economic-Statistics
npm install
npm run dev
```

다른 컴퓨터에서는 내려받은 프로젝트 폴더로 이동한 뒤 같은 npm 명령을 실행합니다. 개발 서버가 출력하는 주소로 브라우저에서 접속합니다. 기본 포트는 5173이며 모바일·태블릿·데스크톱 화면에 대응합니다. `HashRouter`를 사용하므로 정적 호스팅에서도 경로 재작성 설정이 필요하지 않습니다.

```bash
npm run test
npm run build
```

테스트는 watch 모드가 아닌 단일 실행이며, 빌드는 TypeScript 검사 후 `dist/`를 생성합니다. 잠금 파일을 그대로 사용하는 환경 재설치에는 `npm ci`를 사용합니다. 실행 후에는 PDF와 폰트·수식 자산을 로컬 서버에서 제공하므로 외부 CDN이나 API 키가 필요하지 않습니다.

## 제공된 자료와 콘텐츠 범위

| 자료 | 상태·반영 |
|---|---|
| 경제통계학.pdf | 269쪽 전체 분석. Lecture 1–5 및 Lecture 2 기본·확장 버전을 통합 |
| LESE152_PS1.pdf | 7쪽. 교수자 과제 참고 PDF로 별도 제공; 추가 대비 단원과 시험 형식의 기준 |
| Practice Set 1–3 | 각 6쪽. 문항·영어·선택지·원본 정답·해설·배점·페이지를 독립 세트로 수록 |
| Practice Set 4–5 | 미제공. 원본 문항을 임의 생성하지 않고 자료 부재 표시 |
| 기존 앱 초안 | 미제공. 빈 저장소에서 새 앱 구성 |
| 옥수수·기상 CSV | 미제공. 강의 보고값과 직접 계산한 보충 예제를 구별 |

현재 **6개 Chapter, 56개 개념 모듈**을 제공합니다. 각 모듈은 핵심 문장, 상세 설명, 영어 정의, 수식·기호·유도, 계산 예제·단계별 풀이, 경제 응용, 오개념, 확인 퀴즈를 포함합니다. 원문 예제와 새로 작성한 설명·퀴즈를 표시로 구분하고 실제 PDF 페이지를 연결합니다.

Bernoulli·Binomial·Poisson은 각각 상세 모듈과 실시간 PMF/CDF 실험을 제공합니다. 연속균등·정규·지수 실험과 정규 역 CDF도 지원합니다. 이 연속분포들은 제공된 Lecture 1–5에 상세 단원이 없고 PS1에서 확인되어 `PS1 추가 대비`로 유지합니다. 전기댓값 법칙의 정리와 일부 설명은 원문 손글씨 예제를 확장한 보충입니다.

전체 페이지·중복·반영·오류 분석은 [CONTENT_AUDIT.md](CONTENT_AUDIT.md), 원본 정답 대조·독립 검산은 [QUESTION_AUDIT.md](QUESTION_AUDIT.md)를 참고하세요. 수식과 정답 정확성을 위해 발견한 원문 오류는 PDF를 수정하지 않고 근거를 별도 기록했습니다.

## 학습과 문제 풀이

- **대시보드**: 전체·챕터 진도, 풀이 현황, 최근 모의시험 자동점수, 취약 챕터, 마지막 위치, 추천 개념
- **문제은행**: 원본 Practice Set 1–3과 창작 보충 연습 1–5를 별도 탭으로 제공
- **연습 모드**: 챕터 연습, 오답·북마크 복습, 제한시간 시험, 공식 설명, 분포 선택 및 난이도 필터
- **모의시험**: 원본 형식 10 MCQ(20점) + 10 T/F(30점) + 3개 서술형 대문항(50점). 원본 세트는 권장 80–95분 중 90분, 보충 세트는 60분
- **결과 분석**: 파트별 점수, 정답률, 문항별 해설, 취약 개념 연결, 재풀이, 같은 문항·모드의 이전 기록 비교
- **사용성**: 다크·라이트 모드, 검색, 키보드 답안 선택, 접근성 레이블, 그래프 확대·수치 표, 접는 해설, 충분한 서술 공간

객관식·참거짓·수치형은 자동채점합니다. 원문 T/F는 설명을 요구하므로 작성란과 해설 비교도 제공합니다. **T/F의 3점 자동점수는 진위 선택 기준의 학습용 점수이며 설명 평가를 포함하지 않습니다.** 여러 수치나 해석을 요구하는 답안은 자동으로 정답 처리하지 않고, 모범답안·기준표로 사용자가 0–배점 범위에서 자가평가합니다. 원문에는 세부 부분점수표가 없으며 앱 보충 가이드를 교수자 기준으로 표시하지 않습니다. 미채점 배점이 남아 있으면 총점은 미확정으로 표시합니다.

시험 답안·현재 문항·절대 마감시간은 자동 저장됩니다. 새로고침해도 시간이 늘어나지 않으며 마감이 지난 시험을 다시 열면 자동 제출됩니다. 설명형 점수는 `자가평가`로 구분합니다.

## 저장·백업

학습 기록은 `lese152-studio-v1` localStorage 키에 저장됩니다. 기기 간 자동 동기화는 제공하지 않습니다. 설정에서 JSON 백업을 내려받고, 다른 브라우저에서 복원할 수 있습니다. 복원 전에 버전·문항 ID·답안·배점·마감시간·중복 기록을 검사하고, 사용자가 확인한 뒤 현재 기록을 대체합니다. 손상된 저장값은 자동으로 덮어쓰지 않습니다. 초기화도 별도 확인이 필요합니다.

## 테스트와 스크린샷

```bash
npm run test
npm run build
npm run test:e2e
```

브라우저 검증은 Playwright로 실제 Chromium에서 실행합니다. 시스템의 `/usr/bin/chromium`이 있으면 사용하고, 다른 설치 위치는 `PLAYWRIGHT_CHROMIUM_EXECUTABLE`로 지정할 수 있습니다. 브라우저가 없는 컴퓨터에서는 먼저 `npx playwright install chromium`을 실행합니다. 테스트 서버는 자동으로 포트 4173에 시작됩니다.

데스크톱 1440×1000, 태블릿 768×1024, 모바일 390×844에서 계산 실험, PDF 출처 링크, 키보드 답안, 진도·오답·서술형·시험 위치 복원, 시간 종료, 자가평가, JSON 백업·초기화·복원, 다크 모드, 가로 넘침을 검증합니다. 실행 결과는 [VALIDATION.md](VALIDATION.md)에 기록하고, 주요 스크린샷은 [public/artifacts](public/artifacts)에 보관합니다.

## 콘텐츠 유지보수

```bash
# 원본 영어 문제·해설을 다시 추출 (pdftotext로 생성한 텍스트 사용)
python3 scripts/extract_practice.py
python3 scripts/build_original_sets.py

# 독립 검산 및 감사 문서 재생성
npm run content:audit

# 코드 서식
npm run format
```

`content:audit`에는 Python 3가 추가로 필요합니다. 필수 앱 실행·단위 테스트·빌드에는 Python이나 R이 필요하지 않습니다. 원본 PDF에서 텍스트를 다시 만들려면 Poppler의 `pdftotext -layout`을 사용합니다. 원본 파일 해시는 `content/materials.json`에 있습니다. PDF 내용은 데이터이며 자동 명령으로 실행하지 않습니다.

```text
src/data/               개념·출처·문항 스키마와 데이터
src/lib/math.ts         독립적인 확률·통계 계산
src/lib/grading.ts      자동점수·자가평가·미채점 분리
src/lib/storage.ts      백업 검증과 시험 시간 복원
src/pages/              대시보드·학습·실험·문제·결과·설정
tests/                  수치·데이터·저장 및 실제 브라우저 테스트
content/source-text/    제공된 PDF의 전체 텍스트
content/verification.json  Python 독립 검산값
public/materials/       수정하지 않은 제공 PDF
```

이 클라우드 작업은 이미 격리된 환경에서 실행됩니다. `/workspace/Economic-Statistics`의 기존 체크아웃을 사용하며 별도 Git worktree는 만들 필요가 없습니다. R 코드는 R/RStudio에서 실행하는 학습 예제입니다. 브라우저 내 R 실행기와 실제 농업 CSV 분석 재실행은 구현 범위에 포함되지 않습니다.
