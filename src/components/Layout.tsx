import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  NotebookPen,
  History,
  Settings,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  ArrowUpRight,
  ChevronRight,
  PanelLeftClose,
  Library,
  GraduationCap,
} from "lucide-react";
import { chapters, lessons } from "../data/lessons";
import { useStudy } from "../lib/store";
import { Progress } from "./ui";
export function Layout({ children }: { children: ReactNode }) {
  const sidebarRef = useRef<HTMLElement>(null),
    menuRef = useRef<HTMLButtonElement>(null),
    closeRef = useRef<HTMLButtonElement>(null);
  const { state, update, error } = useStudy();
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState("");
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    setSearch("");
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function keyboard(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = Array.from(
          sidebarRef.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
        ).filter((el) => el.offsetParent !== null);
        const first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", keyboard);
    return () => document.removeEventListener("keydown", keyboard);
  }, [open]);
  const results = search.trim()
    ? lessons
        .filter((l) =>
          `${l.title} ${l.english} ${l.summary}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
        )
        .slice(0, 7)
    : [];
  const progress = Math.round((state.completed.length / lessons.length) * 100);
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
          document.getElementById("main")?.scrollIntoView();
        }}
      >
        본문으로 건너뛰기
      </a>
      {open && (
        <button
          aria-label="메뉴 배경 닫기"
          className="sidebar-overlay"
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        className={`sidebar ${open ? "is-open" : ""}`}
        aria-label="주요 내비게이션"
      >
        <Link className="brand" to="/">
          <span className="brand-symbol">∑</span>
          <span>
            LESE<span className="brand-number">152</span>
            <small>STATISTICS STUDIO</small>
          </span>
        </Link>
        <button
          ref={closeRef}
          className="mobile-close icon-button"
          onClick={() => setOpen(false)}
          aria-label="메뉴 닫기"
        >
          <PanelLeftClose size={20} />
        </button>
        <div className="course-label">나의 학습 공간</div>
        <nav className="main-nav">
          <NavLink to="/" end>
            <LayoutDashboard size={19} />
            대시보드
          </NavLink>
          <NavLink to="/chapters">
            <BookOpen size={19} />
            개념 학습<span className="nav-count">6</span>
          </NavLink>
          <NavLink to="/lab">
            <FlaskConical size={19} />
            분포 실험실
            <span className="new-dot" />
          </NavLink>
          <NavLink to="/practice">
            <NotebookPen size={19} />
            문제 풀기
          </NavLink>
          <NavLink to="/history">
            <History size={19} />
            학습 기록
          </NavLink>
        </nav>
        <div className="course-label chapter-nav-label">CHAPTERS</div>
        <nav className="chapter-nav">
          {chapters.map((c) => (
            <NavLink
              key={c.id}
              to={`/chapters?chapter=${c.id}`}
              className={() =>
                location.pathname === "/chapters" &&
                location.search === `?chapter=${c.id}`
                  ? "chapter-active"
                  : ""
              }
            >
              <span className="chapter-number">0{c.id}</span>
              <span>{c.title}</span>
              {c.id === 5 && <span className="core-tag">핵심</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-progress">
            <div>
              <span>한 걸음씩, 확실하게</span>
              <b>{progress}%</b>
            </div>
            <Progress value={progress} label="전체 학습 진도" />
            <small>
              {state.completed.length} / {lessons.length}개 개념 학습 완료
            </small>
          </div>
          <NavLink to="/sources">
            <Library size={17} />
            자료 및 출처
            <ArrowUpRight size={15} />
          </NavLink>
          <NavLink to="/settings">
            <Settings size={17} />
            설정 및 데이터
          </NavLink>
          <div className="student">
            <span>
              <GraduationCap size={20} />
            </span>
            <div>
              나의 학습 프로필<small>기록은 이 브라우저에 저장돼요</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="workspace" inert={open}>
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuRef}
              className="mobile-menu icon-button"
              aria-label="메뉴 열기"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span>LESE152</span>
            <ChevronRight size={14} />
            <span className="breadcrumb-name">Statistics for Economists</span>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={17} />
              <input
                aria-label="개념 검색"
                placeholder="어떤 개념이 궁금한가요?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearch("");
                }}
              />
              {search && (
                <button aria-label="검색 지우기" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
              {search && (
                <div className="search-results" aria-live="polite">
                  {results.length ? (
                    results.map((l) => (
                      <Link key={l.id} to={`/learn/${l.id}`}>
                        <span>
                          {l.title}
                          <small>{l.english}</small>
                        </span>
                        <ChevronRight size={16} />
                      </Link>
                    ))
                  ) : (
                    <p>일치하는 개념이 없습니다.</p>
                  )}
                </div>
              )}
            </div>
            <button
              className="icon-button theme-button"
              aria-label={
                state.theme === "light"
                  ? "다크 모드로 전환"
                  : "라이트 모드로 전환"
              }
              onClick={() =>
                update((s) => ({
                  ...s,
                  theme: s.theme === "light" ? "dark" : "light",
                }))
              }
            >
              {state.theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            <span className="avatar" aria-hidden="true">
              S
            </span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {error && (
            <div className="alert" role="alert">
              {error} <Link to="/settings">설정 열기</Link>
            </div>
          )}
          {children}
        </main>
        <footer>
          LESE152 STUDY STUDIO <span>이해하고, 적용하고, 나의 것으로.</span>
          <Link to="/sources">콘텐츠 출처 안내</Link>
        </footer>
      </div>
    </div>
  );
}
