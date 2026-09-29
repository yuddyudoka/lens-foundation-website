import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function readCookie(request: any, name: string) {
  const cookies = String(request.headers.cookie || "").split(";");
  const entry = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.trim().slice(name.length + 1)) : "";
}

async function secureMatch(candidate: string, expected: string) {
  const encoder = new TextEncoder();
  const [candidateHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const left = new Uint8Array(candidateHash);
  const right = new Uint8Array(expectedHash);
  let difference = left.length ^ right.length;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) difference |= (left[index] || 0) ^ (right[index] || 0);
  return difference === 0;
}

function adminAuthPlugin(password: string) {
  const sessions = new Map<string, number>();
  const cookieName = "lens_admin_session";
  const sessionLifetime = 8 * 60 * 60 * 1000;
  const isAuthenticated = (request: any) => {
    const token = readCookie(request, cookieName);
    const expiresAt = sessions.get(token) || 0;
    if (!token || expiresAt <= Date.now()) {
      if (token) sessions.delete(token);
      return false;
    }
    return true;
  };
  const attachHandler = (middlewares: { use: (path: string, handler: (request: any, response: any, next: () => void) => void) => void }) => {
    middlewares.use("/api/admin", async (request, response, next) => {
      response.setHeader("Content-Type", "application/json");
      const route = String(request.url || "").split("?")[0];
      if (request.method === "GET" && route === "/session") {
        response.statusCode = 200;
        response.end(JSON.stringify({ authenticated: isAuthenticated(request), configured: Boolean(password) }));
        return;
      }
      if (request.method === "POST" && route === "/login") {
        if (!password) {
          response.statusCode = 503;
          response.end(JSON.stringify({ error: "Admin access is not configured. Add ADMIN_PASSWORD to .env and restart the server." }));
          return;
        }
        try {
          let rawBody = "";
          for await (const chunk of request) {
            rawBody += chunk;
            if (rawBody.length > 10_000) throw new Error("Request is too large.");
          }
          const supplied = String((JSON.parse(rawBody || "{}") as { password?: string }).password || "");
          if (!await secureMatch(supplied, password)) {
            response.statusCode = 401;
            response.end(JSON.stringify({ error: "Incorrect password. Please try again." }));
            return;
          }
          const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (value) => value.toString(16).padStart(2, "0")).join("");
          sessions.set(token, Date.now() + sessionLifetime);
          response.setHeader("Set-Cookie", `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionLifetime / 1000}`);
          response.statusCode = 200;
          response.end(JSON.stringify({ authenticated: true }));
        } catch (error) {
          response.statusCode = 400;
          response.end(JSON.stringify({ error: error instanceof Error ? error.message : "Unable to sign in." }));
        }
        return;
      }
      if (request.method === "POST" && route === "/logout") {
        const token = readCookie(request, cookieName);
        if (token) sessions.delete(token);
        response.setHeader("Set-Cookie", `${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
        response.statusCode = 200;
        response.end(JSON.stringify({ authenticated: false }));
        return;
      }
      next();
    });
  };
  const plugin: Plugin = {
    name: "lens-admin-auth",
    configureServer(server) { attachHandler(server.middlewares); },
    configurePreviewServer(server) { attachHandler(server.middlewares); },
  };
  return { plugin, isAuthenticated };
}

function groqAiPlugin(apiKey: string, model: string, isAuthenticated: (request: any) => boolean): Plugin {
  const attachHandler = (middlewares: { use: (path: string, handler: (request: any, response: any, next: () => void) => void) => void }) => {
    middlewares.use("/api/ai/generate", async (request, response, next) => {
      if (request.method !== "POST") return next();
      response.setHeader("Content-Type", "application/json");

      if (!isAuthenticated(request)) {
        response.statusCode = 401;
        response.end(JSON.stringify({ error: "Your admin session has expired. Sign in again to use Groq." }));
        return;
      }

      if (!apiKey) {
        response.statusCode = 503;
        response.end(JSON.stringify({ error: "Groq is not configured. Add GROQ_API_KEY to .env and restart the server." }));
        return;
      }

      try {
        let rawBody = "";
        for await (const chunk of request) {
          rawBody += chunk;
          if (rawBody.length > 50_000) throw new Error("Request is too large.");
        }
        const body = JSON.parse(rawBody || "{}") as { kind?: "event" | "report"; context?: Record<string, unknown> };
        const context = body.context ?? {};
        const foundationContext = "The Lens Foundation is a community-focused nonprofit that turns compassion into practical help for children, families, and underserved communities through food assistance, education support, medical-bill support, direct aid, outreach, and partnerships. It is not an eye-care or optometry organisation.";
        const eventInstruction = `${foundationContext} Write accurate website copy for a Lens Foundation community event. Return JSON only with: summary (1 concise sentence), overview (80-120 words), expectations (exactly 4 concise strings), and whyAttend (45-70 words). The status determines the tense: Upcoming uses future-facing language and explains what guests can expect and why to attend; Completed uses past tense and explains what happened and why it mattered. Never invent figures, beneficiaries, partners, locations, or outcomes that are not supplied. If information is limited, keep the copy general rather than guessing. Context: ${JSON.stringify(context)}`;
        const reportInstruction = `${foundationContext} Write supporting copy for a Lens Foundation annual report card. Return JSON only with one key: description. Write 25-40 words in a clear, accountable nonprofit voice. When no achievements or statistics are supplied, describe the report as a transparent record of programmes, partnerships, community reach, learning, and progress without claiming specific results. Context: ${JSON.stringify(context)}`;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            temperature: 0.45,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: "You are the careful editorial assistant for The Lens Foundation. Produce polished, factual JSON with no markdown." },
              { role: "user", content: body.kind === "report" ? reportInstruction : eventInstruction },
            ],
          }),
        });

        const payload = await groqResponse.json() as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };
        if (!groqResponse.ok) throw new Error(payload.error?.message || "Groq could not generate content.");
        const content = payload.choices?.[0]?.message?.content;
        if (!content) throw new Error("Groq returned an empty response.");
        response.statusCode = 200;
        response.end(JSON.stringify({ content: JSON.parse(content) }));
      } catch (error) {
        response.statusCode = 500;
        response.end(JSON.stringify({ error: error instanceof Error ? error.message : "Content generation failed." }));
      }
    });
  };

  return {
    name: "lens-groq-ai",
    configureServer(server) { attachHandler(server.middlewares); },
    configurePreviewServer(server) { attachHandler(server.middlewares); },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const adminAuth = adminAuthPlugin(env.ADMIN_PASSWORD);
  return {
    plugins: [react(), adminAuth.plugin, groqAiPlugin(env.GROQ_API_KEY, env.GROQ_MODEL || "openai/gpt-oss-20b", adminAuth.isAuthenticated)],
  };
});
