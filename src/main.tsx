import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { hydrateCms } from "./data/cms";
import "./styles.css";

function startApp() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // Paint from the bundled or last-known CMS snapshot first. Refresh from KV
  // only after the critical render has settled so CMS hydration cannot compete
  // with the hero image, fonts, or initial layout work.
  const refreshCms = () => {
    const requestIdle = (window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    }).requestIdleCallback;
    if (requestIdle) {
      requestIdle(() => void hydrateCms(), { timeout: 2_000 });
    } else {
      globalThis.setTimeout(() => void hydrateCms(), 250);
    }
  };

  if (document.readyState === "complete") refreshCms();
  else window.addEventListener("load", refreshCms, { once: true });
}

startApp();
