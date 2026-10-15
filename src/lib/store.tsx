import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { StudyState } from "../data/types";
import { loadState, STORAGE_KEY } from "./storage";
type Store = {
  state: StudyState;
  update: (f: (s: StudyState) => StudyState, force?: boolean) => void;
  error: string;
};
const Context = createContext<Store | null>(null);
export function StudyProvider({ children }: { children: ReactNode }) {
  const [loaded] = useState(() => loadState(window.localStorage));
  const [state, setState] = useState(loaded.state);
  const [error, setError] = useState(loaded.error);
  const [blocked, setBlocked] = useState(Boolean(loaded.error));
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);
  function update(f: (s: StudyState) => StudyState, force = false) {
    if (blocked && !force) return;
    setState((prev) => {
      const next = f(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setError("");
        if (force) setBlocked(false);
      } catch {
        setError(
          "브라우저 저장 공간에 쓰지 못했습니다. 현재 탭의 기록을 설정에서 JSON으로 백업하세요.",
        );
      }
      return next;
    });
  }
  return (
    <Context.Provider value={{ state, update, error }}>
      {children}
    </Context.Provider>
  );
}
export function useStudy() {
  const store = useContext(Context);
  if (!store) throw new Error("StudyProvider is missing");
  return store;
}
