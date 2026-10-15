# Safari에서 웹주소로 사용하기

배포 대상은 `https://just0mio.github.io/Economic-Statistics/`입니다. 이 주소는 GitHub Pages의 최초 활성화와 성공한 배포 후 사용할 수 있습니다. GitHub 파일 다운로드와 웹사이트 접속은 별개입니다.

## 최초 GitHub 설정

1. 저장소의 [Settings → Pages](https://github.com/just0mio/Economic-Statistics/settings/pages)를 엽니다.
2. **Build and deployment → Source → GitHub Actions**를 선택합니다.
3. [배포 작업](https://github.com/just0mio/Economic-Statistics/actions/workflows/pages.yml)에서 **Run workflow → main → Run workflow**를 누릅니다. 이미 실행 중인 배포가 있으면 완료 여부를 먼저 확인합니다.

Pages는 저장소 관리자/유지관리자 권한으로 처음 활성화해야 합니다. 이 Codex 환경은 현재 `api.github.com`과 `just0mio.github.io`로의 네트워크 접속을 차단하고 있어 초기 설정 API와 공개 사이트를 직접 요청할 수 없습니다. Git 푸시와 로컬 빌드/브라우저 검증은 가능합니다. 현재 활성화 여부와 배포 성공을 확인하기 전에는 위 주소가 열린다고 단정하지 않습니다.

## 자동 갱신

설정 후 `main`에 수정 사항을 올리면 `.github/workflows/pages.yml`이 잠금 파일로 설치하고, 수학·문항 테스트와 프로젝트 경로용 빌드를 수행한 뒤 GitHub Pages에 배포합니다. 공개 사이트의 HTML·JavaScript·CSS·Lecture6 PDF도 확인합니다. 실패한 테스트나 배포를 성공으로 처리하지 않습니다.

이 과정은 즉시 편집되는 방식은 아니며, GitHub Actions의 빌드·배포 완료 후 같은 웹주소에서 새 내용을 확인합니다. 개발 중 PC의 Vite 서버에서는 파일 저장 후 즉시 반영됩니다.

```bash
npm run build:pages
npm run preview -- --base=/Economic-Statistics/ --outDir pages-dist --port 4174 --strictPort
# 별도 터미널에서 해당 로컬 서버 주소를 test:pages의 인수로 전달
```

`HashRouter`를 사용하므로 개념·시험 링크의 `#/...` 경로가 Safari 새로고침 뒤에도 유지됩니다. 앱과 폰트·수식·PDF는 같은 HTTPS 사이트에서 제공하며 서버 로그인이나 API 키는 필요하지 않습니다. Pages에는 `pages-dist`만 업로드하고 ZIP·node_modules·Git 메타데이터는 올리지 않습니다.

## iPad / iPhone

성공한 배포 후 Safari에서 위 주소를 열어 사용합니다. 공유 메뉴에서 **홈 화면에 추가**할 수도 있습니다. 학습 기록은 그 Safari의 localStorage에 저장됩니다. PC·파일 버전과 자동 동기화되지 않으므로 기존 앱의 설정에서 JSON 백업을 받아 웹앱 설정에서 복원하세요. 실제 Safari 기기 검증과 Chromium 모바일 화면 검증은 구분합니다.
