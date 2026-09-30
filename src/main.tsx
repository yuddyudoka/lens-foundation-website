import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { hydrateCms } from "./data/cms";
import "./styles.css";

async function startApp() {
  await hydrateCms();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void startApp();
