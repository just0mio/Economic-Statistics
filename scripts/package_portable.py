"""Package the offline web app and its unchanged reference PDFs for delivery."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
portable = root / "portable"
releases = root / "releases"
releases.mkdir(exist_ok=True)

instructions = """LESE152 경제통계학 스튜디오 — PC용 실행 버전

1. ZIP 전체를 압축 해제하세요. 압축 파일 안에서 HTML만 열지 마세요.
2. LESE152 폴더의 index.html을 Chrome 또는 Edge에서 여세요.
3. Node.js, npm, 개발 서버가 필요하지 않습니다.

학습·시험·그래프·수식·폰트는 인터넷 없이 실행됩니다.
materials 폴더는 원본 PDF입니다. 같은 폴더 구조를 유지하세요.
학습 기록은 브라우저에 저장됩니다. HTML의 위치나 브라우저를 바꾸기
전에는 설정에서 JSON 백업을 저장하세요. 파일 URL의 저장 동작은
브라우저마다 다르므로 백업을 권장합니다.

Codex 환경 설정 화면은 웹앱 실행 화면이 아닙니다. HTML의 코드를 보는
것과 앱을 브라우저에서 실행하는 것은 다릅니다. iPad/iPhone의 파일 미리보기는
JavaScript 앱 실행을 보장하지 않으므로 모바일은 HTTPS 웹 호스팅이 필요합니다.
이 ZIP을 생성하는 작업은 GitHub 게시나 공개 웹 호스팅을 수행하지 않습니다.

원본 Practice Set 4–5와 농업 CSV는 미제공입니다.
CONTENT_AUDIT.md와 QUESTION_AUDIT.md에 콘텐츠 범위와 검증 근거가 있습니다.
"""
(portable / "실행방법.txt").write_text(instructions, encoding="utf-8")

with zipfile.ZipFile(releases / "LESE152-portable.zip", "w", zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(portable.rglob("*")):
        if path.is_file() and "artifacts" not in path.relative_to(portable).parts:
            archive.write(path, Path("LESE152") / path.relative_to(portable))

excluded = {".git", "node_modules", "dist", "portable", "releases", "test-results", "playwright-report", "__pycache__"}
with zipfile.ZipFile(releases / "LESE152-source.zip", "w", zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(root.rglob("*")):
        relative = path.relative_to(root)
        if (path.is_file() and not any(part in excluded for part in relative.parts)
                and not path.name.endswith((".tsbuildinfo", ".local", ".pyc"))):
            archive.write(path, Path("LESE152-source") / relative)

for name in ("LESE152-portable.zip", "LESE152-source.zip"):
    path = releases / name
    print(f"Created {path.relative_to(root)} ({path.stat().st_size:,} bytes)")
