# LESE152 다운로드

## 설치 없이 PC에서 실행

[실행 ZIP 다운로드 (약 10 MB)](https://github.com/just0mio/Economic-Statistics/raw/refs/heads/main/releases/LESE152-portable.zip)

1. ZIP 전체를 컴퓨터에 저장하고 압축을 해제합니다.
2. `LESE152/index.html`을 Chrome 또는 Edge로 엽니다.
3. PDF 출처 링크를 이용하려면 함께 있는 `materials/` 폴더를 유지합니다.

Node.js나 개발 서버 없이 학습·수식·분포 그래프·문제 풀이를 이용하는 PC용 버전입니다. 기록을 다른 브라우저나 파일 위치로 옮기기 전 앱 설정에서 JSON을 백업하세요. iPad/iPhone의 파일 미리보기는 JavaScript 실행을 보장하지 않습니다. 이 파일을 GitHub에 올리는 것은 앱을 웹 호스팅하는 작업과 다릅니다.

## 전체 소스

[전체 소스 ZIP 다운로드 (약 8 MB)](https://github.com/just0mio/Economic-Statistics/raw/refs/heads/main/releases/LESE152-source.zip)

압축 해제 후 `LESE152-source` 폴더에서 다음 명령을 실행합니다. Node.js 22.12 이상이 필요합니다.

```bash
npm install
npm run dev
```

검증은 `npm run test`, `npm run build`로 실행합니다. 내용과 한계는 README.md, CONTENT_AUDIT.md, QUESTION_AUDIT.md, VALIDATION.md에 기록되어 있습니다. 원본 PDF 5개가 포함되며 원본 Practice Set 4–5와 농업 CSV는 제공되지 않았습니다.

직접 다운로드 대신 파일 화면을 열려면 [실행 ZIP 파일](https://github.com/just0mio/Economic-Statistics/blob/main/releases/LESE152-portable.zip), [소스 ZIP 파일](https://github.com/just0mio/Economic-Statistics/blob/main/releases/LESE152-source.zip)을 이용하세요. 비공개 저장소인 경우 저장소 접근 권한이 있는 GitHub 계정으로 로그인해야 합니다.
