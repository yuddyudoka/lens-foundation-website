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

  // Paint immediately from the bundled or last-known CMS snapshot, then refresh
  // from Cloudflare KV without making the first screen wait on the network.
  void hydrateCms();
}

startApp();
