import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { StudyProvider } from "./lib/store";
import { App } from "./App";
import "katex/dist/katex.min.css";
import "./styles.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <StudyProvider>
        <App />
      </StudyProvider>
    </HashRouter>
  </React.StrictMode>,
);
