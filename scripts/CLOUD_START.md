# LESE152 클라우드 시작 절차

이 작업은 이미 격리된 환경에서 실행됩니다. `/workspace/Economic-Statistics`의 기존 체크아웃을 사용하세요. 사용자가 명시적으로 요청하지 않으면 Git worktree를 만들지 마세요. 사용자 파일·원본 PDF·문항의 배점과 정답을 보존하세요.

## 유지되는 파일과 다시 시작할 프로세스

저장소, PDF, 설치된 node_modules와 빌드 결과는 준비된 파일 상태입니다. Vite 프로세스와 브라우저 세션은 새 작업에서 살아 있다고 가정하지 마세요. 학습 기록은 접속하는 사용자의 브라우저 localStorage에 있으므로 클라우드 스냅샷에서 사용자 기록이 동기화된다고 설명하지 마세요.

## 설치 확인

```bash
cd /workspace/Economic-Statistics
node --version
npm --version
```

Node 22.12 이상을 사용합니다(검증 버전 24.19.0). 의존성이 없거나 새 잠금 파일을 설치해야 하면 `bash scripts/cloud-install.sh`를 실행합니다. 이 스크립트는 npm ci, 단위·데이터 검증, TypeScript·Vite 빌드를 수행합니다. API 키·DB·별도 서비스는 필요하지 않습니다.

## 개발 서버 시작

기존에 이 앱의 서버가 5173 포트에서 정상 응답하면 재사용하세요. 다른 프로세스가 포트를 사용하는 경우 임의로 종료하지 말고 로그와 해당 작업의 프로세스를 확인하세요.

```bash
cd /workspace/Economic-Statistics
nohup npm run dev -- --port 5173 --strictPort </dev/null > /workspace/lese152-vite.log 2>&1 &
```

시작 오류는 `/workspace/lese152-vite.log`에서 확인합니다. 외부 의존 서비스가 없으므로 Vite가 시작되면 앱을 로컬 요청으로 검증할 수 있습니다. localhost 미리보기 링크를 사용자에게 만들지 말고 결과를 텍스트로 보고하세요.

## 준비 상태 확인

```bash
cd /workspace/Economic-Statistics
curl --retry 10 --retry-delay 1 --retry-connrefused --fail --silent http://127.0.0.1:5173/ -o /tmp/lese152-ready.html
node scripts/smoke-running.mjs
```

단순 포트 확인만으로 준비 완료라고 하지 마세요. smoke-running은 실제 Chromium으로 대시보드 → 검색 → 포아송 개념을 열고 실제 계산기 평균·분산과 원문 페이지 연결, JavaScript 오류를 확인합니다. 현재 머신에는 `/usr/bin/chromium`이 있습니다. 별도 컴퓨터에서는 Playwright 브라우저를 설치하거나 `PLAYWRIGHT_CHROMIUM_EXECUTABLE`로 설치된 Chromium을 지정할 수 있습니다.

소스 변경 후에는 `npm run test`, `npm run build`를 실행하고, 문제·저장·반응형 동작이 바뀌면 `npm run test:e2e`를 실행하세요. 브라우저 전체 검증은 4173 포트의 별도 임시 Vite 서버를 자동으로 사용합니다. R 예제는 별도 R/RStudio에서 실행하는 코드이며 웹앱 자체에 R 설치는 필요하지 않습니다.

원본 Set4·5와 Lecture6이 추가되었습니다. L6 학습범위는정규분포까지1–18쪽입니다. L4·5는기존합본에서추출한발췌본입니다. 지수분포는범위밖보충이며 Set5 MC4·TF10은원문기호누락으로자동채점하지않습니다. 농업·기상CSV는미제공입니다. 환경 설정 초안 저장은 현재 머신 실행·게시·새 작업 복원 검증과 별개입니다.
