import { Routes, Route, Link } from "react-router-dom";
import { Layout } from "./components/Layout";
import { lazy, Suspense } from "react";
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Chapters = lazy(() =>
  import("./pages/Learn").then((m) => ({ default: m.Chapters })),
);
const LessonPage = lazy(() =>
  import("./pages/Learn").then((m) => ({ default: m.LessonPage })),
);
const LabPage = lazy(() =>
  import("./pages/Lab").then((m) => ({ default: m.LabPage })),
);
const Practice = lazy(() =>
  import("./pages/Practice").then((m) => ({ default: m.Practice })),
);
const Session = lazy(() =>
  import("./pages/Session").then((m) => ({ default: m.Session })),
);
const Results = lazy(() =>
  import("./pages/Results").then((m) => ({ default: m.Results })),
);
const HistoryPage = lazy(() =>
  import("./pages/Results").then((m) => ({ default: m.HistoryPage })),
);
const Settings = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.Settings })),
);
const Sources = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.Sources })),
);
export function App() {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="page" role="status">
            학습 공간을 불러오는 중…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/learn/:id" element={<LessonPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/session" element={<Session />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sources" element={<Sources />} />
          <Route
            path="*"
            element={
              <div className="page">
                <h1>페이지를 찾을 수 없어요</h1>
                <Link to="/">대시보드로 돌아가기</Link>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Layout>
  );
}
