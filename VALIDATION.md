# 실행·검증 결과

검증일: **2026-10-15 (Asia/Seoul)**. 실제 클라우드 머신에서 실행한 결과입니다.

| 검증 | 결과 | 범위 |
|---|---|---|
| `npm install` | 통과 | React·Vite·Tailwind·KaTeX·Recharts 및 테스트 도구 설치 |
| `bash scripts/cloud-install.sh` | 통과 | 잠금 파일 기반 `npm ci`로 173개 패키지를 재설치하고 테스트·빌드 재실행 |
| `npm run test` | **66/66 통과** | math 31, data 29, storage 6. 실패·스킵·비활성 테스트 없음 |
| `npm run build` | 통과 | TypeScript 검사와 Vite 프로덕션 번들 생성 |
| `npm run build:portable` | 통과 | 스크립트·수식·스타일·폰트를 포함한 HTML, 원본 PDF를 담은 실행 ZIP과 전체 소스 ZIP 생성 |
| `npm run test:portable` | **3개 화면 크기 통과** | HTML 한 개만 메모리에서 제공. 네트워크 차단 상태의 수식·분포·진도·시험 답안/마감시간 복원·미채점 표시, 추가 외부 요청 없음 |
| `npm run test:e2e` | **21/21 통과** | 7개 사용자 흐름 × 데스크톱·태블릿·모바일. 실패·스킵 없음 |
| `npm run content:audit` | 통과 | 원본 서술형 30소문항·PS1·강의 오류의 Python 독립 검산, 감사 문서 생성 |
| `node scripts/smoke-running.mjs` | 통과 | 실제 실행 중인 개발 서버에서 대시보드 → 검색 → 포아송 개념 → 평균3·분산3·PDF259쪽 연결, JavaScript 오류 없음 |
| 제공 PDF 무결성 | **5개 모두 일치** | `content/materials.json` SHA-256과 실제 보관 파일 일치 |
| 주요 화면 캡처 | **10개 생성** | dashboard/distribution/exam 3개 크기, concept 데스크톱 |

브라우저는 시스템 **Chromium 154.0.8037.57**을 사용했습니다. 화면 크기는 1440×1000, 768×1024, 390×844입니다. 실제 iPad/Safari나 다른 물리 기기의 시험 결과라고 주장하지 않습니다.

추가 전달 버전 검증: 현재 관리형 Chromium에서 `file://` 탐색은 `ERR_BLOCKED_BY_ADMINISTRATOR`로 차단되었습니다. 정책을 변경하거나 우회하지 않았습니다. 실행 HTML은 허용된 로컬 HTTP 주소에서 메모리 응답으로만 제공하여 인터넷 없이 검증했습니다. 따라서 일반 PC에서 파일을 직접 여는 방식은 준비했지만 이 환경에서 직접 열기까지 확인한 것은 아닙니다. Codex 환경 설정 화면의 미리보기와 공개 웹 호스팅도 제공되지 않습니다. 실행 ZIP은 전체 압축 해제 후 `index.html`을 여는 PC용이며 모바일 파일 미리보기의 실행을 보장하지 않습니다.

## 확인한 동작

- PDF269쪽 전체 목차·모듈 연결, Lecture2 확장본의 추가11장, 원문/보충 표시, 원본 PDF 응답
- 원본3세트·보충5세트 각각 10/10/3 대문항과 20/30/50점 합계100점, 소문항 배점 합, 고유 ID
- 원본 객관식30·참거짓30의 키·영어·선택지·출처 대조. 서술형30소문항을 별도 Python 수치 계산과 비교
- Bernoulli·Binomial·Poisson 질량합·기댓값·분산, PMF/CDF와 ≥ 경계, Bayes·조건부확률, 선형변환, 정규 CDF/역CDF, 균등·지수 계산
- 시험의 숫자 키 답안, 서술 공간, 진위 판단 설명, 북마크, 자동점수/자가점수/미채점 구분
- 새로고침 뒤 진도·오답·마지막 개념·시험 답안·현재 문항·원래 마감시간 복원, 시간 종료 자동제출
- 서술형 소문항을 단독 복습해도 원래 대문항의 주어진 자료·조건 유지
- JSON 내려받기, 초기화 확인, 잘못된 백업 거절, 유효한 백업 복원, 다크 모드 저장
- 모바일 메뉴·키보드 본문 이동·화면 가로 넘침, 확대 그래프, 관련 개념 연결, 공식/챕터/분포 선택 연습

수학 함수만 호출하는 테스트로 끝내지 않고 실제 브라우저 사용자 흐름을 실행했습니다. 자가평가 후 풀이 패널이 접히는 동작과 소문항 복습의 조건 누락을 수정했고 관련 검증을 포함했습니다.

## 원문 오류와 콘텐츠 한계

강의 PDF76·121쪽 공분산·상관 계산 오류와 PDF227–228쪽 확률 전제 모순 등을 CONTENT_AUDIT.md에 기록했습니다. 원문 PDF와 정답·배점을 임의 수정하지 않았습니다. Practice Set1–3의 정답에서 실질적인 계산 오류는 발견하지 않았으며 정규분포 표의 반올림과 정확한 역CDF 결과 차이를 구분했습니다.

원본 Practice Set4–5, 기존 앱 초안, 농업·기상 CSV는 미제공입니다. 원본4–5를 검증하거나 수록했다고 주장하지 않습니다. 창작 보충4–5는 별도 자료입니다. R 예제는 코드·예상 출력·해설을 제공하지만 실제 R 런타임에서 실행한 결과는 아니며, 원본 CSV의 경험적 결과를 재실행하지 않았습니다. PS1에는 교수자 공식 답안이 없으므로 독립 계산을 공식 정답지로 표현하지 않았습니다.

## 환경 재사용 상태

현재 머신에서 의존성 설치, 테스트, 빌드, Vite 개발 서버와 실제 학습 흐름까지 확인했습니다. `install_script`와 `start_skill`을 환경 설정 **초안에 저장한 것이 확인**되었습니다. 원본 체크아웃·네트워크·비밀값 요구사항은 변경하지 않았습니다. 추가 API 키·DB 서비스는 필요하지 않습니다.

초안 저장은 환경 게시와 다릅니다. 환경 설정에서 변경사항을 검토·저장한 뒤 게시해야 새 환경 버전이 됩니다. 게시와 새 작업의 스냅샷 복원은 이 작업에서 실행하거나 검증하지 않았습니다. 실행 프로세스는 복원되지 않으므로 저장한 시작 절차로 다시 시작해야 합니다.

## 스크린샷

- [대시보드 · 데스크톱](public/artifacts/dashboard-desktop.png)
- [대시보드 · 태블릿](public/artifacts/dashboard-tablet.png)
- [대시보드 · 모바일](public/artifacts/dashboard-mobile.png)
- [분포 실험실 · 데스크톱](public/artifacts/distribution-desktop.png)
- [분포 실험실 · 태블릿](public/artifacts/distribution-tablet.png)
- [분포 실험실 · 모바일](public/artifacts/distribution-mobile.png)
- [시험 · 데스크톱](public/artifacts/exam-desktop.png)
- [시험 · 태블릿](public/artifacts/exam-tablet.png)
- [시험 · 모바일](public/artifacts/exam-mobile.png)
- [베르누이 학습 · 데스크톱](public/artifacts/concept-desktop.png)

실행 중인 서버의 화면은 `node scripts/capture-screenshots.mjs`로 다시 캡처할 수 있습니다.
