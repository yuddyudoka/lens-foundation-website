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

type WebsiteFormKind = "contact" | "volunteer" | "partner" | "podium";

const senderFieldNames: Record<WebsiteFormKind, Record<string, string>> = {
  contact: {
    subject: "lens_contact_subject",
    message: "lens_contact_message",
  },
  volunteer: {
    sex: "lens_volunteer_sex",
    birthMonth: "lens_volunteer_birth_month",
    birthDay: "lens_volunteer_birth_day",
    nationality: "lens_volunteer_nationality",
    currentLocation: "lens_volunteer_current_location",
    phone: "lens_volunteer_phone",
    preferredChapter: "lens_volunteer_preferred_chapter",
    education: "lens_volunteer_education",
    profession: "lens_volunteer_profession",
    previousOrganization: "lens_volunteer_previous_organization",
    contribution: "lens_volunteer_contribution",
    heardFrom: "lens_volunteer_heard_from",
  },
  partner: {
    partnerType: "lens_partner_type",
    phone: "lens_partner_phone",
    location: "lens_partner_location",
    aboutOrganization: "lens_partner_about_organization",
    contactMode: "lens_partner_contact_mode",
    contactTime: "lens_partner_contact_time",
    heardFrom: "lens_partner_heard_from",
    message: "lens_partner_message",
  },
  podium: {
    age: "lens_podium_age",
    gender: "lens_podium_gender",
    gradeLevel: "lens_podium_grade_level",
    school: "lens_podium_school",
    guardianName: "lens_podium_guardian_name",
    guardianEmail: "lens_podium_guardian_email",
    guardianPhone: "lens_podium_guardian_phone",
    aboutYourself: "lens_podium_about_yourself",
    motivation: "lens_podium_motivation",
    previousSpeakingExperience: "lens_podium_previous_experience",
    speakingDetails: "lens_podium_experience_details",
    guardianConsent: "lens_podium_guardian_consent",
    mediaConsent: "lens_podium_media_consent",
    additionalInformation: "lens_podium_additional_information",
  },
};

function senderFormsPlugin(token: string, groupIds: Record<WebsiteFormKind, string>): Plugin {
  const attachHandler = (middlewares: { use: (path: string, handler: (request: any, response: any, next: () => void) => void) => void }) => {
    middlewares.use("/api/forms", async (request, response, next) => {
      if (request.method !== "POST") return next();
      response.setHeader("Content-Type", "application/json");
      response.setHeader("Cache-Control", "no-store");
      const kind = String(request.url || "").split("?")[0].replace(/^\//, "") as WebsiteFormKind;
      if (!Object.hasOwn(senderFieldNames, kind)) {
        response.statusCode = 404;
        response.end(JSON.stringify({ error: "This form is unavailable." }));
        return;
      }
      if (!token || !groupIds[kind]) {
        response.statusCode = 503;
        response.end(JSON.stringify({ error: "This form is temporarily unavailable. Please try again later." }));
        return;
      }
      if (!String(request.headers["content-type"] || "").startsWith("application/json")) {
        response.statusCode = 415;
        response.end(JSON.stringify({ error: "Unsupported form format." }));
        return;
      }

      try {
        let rawBody = "";
        for await (const chunk of request) {
          rawBody += chunk;
          if (rawBody.length > 30_000) throw new Error("Form answers are too long.");
        }
        const submitted = JSON.parse(rawBody || "{}") as Record<string, unknown>;
        if (!submitted || typeof submitted !== "object" || Array.isArray(submitted)) throw new Error("Invalid form data.");
        const read = (name: string) => {
          const value = submitted[name];
          return (Array.isArray(value) ? value.map(String).join(", ") : typeof value === "string" ? value : "").trim();
        };
        const email = read("email").toLowerCase();
        const name = kind === "volunteer" ? `${read("firstName")} ${read("surname")}`.trim() : read("fullName");
        const requiredByKind: Record<WebsiteFormKind, string[]> = {
          contact: ["fullName", "email", "subject", "message"],
          volunteer: ["firstName", "surname", "email", "sex", "birthMonth", "birthDay", "nationality", "currentLocation", "phone", "preferredChapter", "education", "profession", "contribution"],
          partner: ["partnerType", "fullName", "email", "phone", "location", "contactMode", "heardFrom"],
          podium: ["fullName", "email", "age", "gender", "gradeLevel", "aboutYourself", "motivation", "previousSpeakingExperience", "mediaConsent"],
        };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || requiredByKind[kind].some((field) => !read(field))) {
          response.statusCode = 400;
          response.end(JSON.stringify({ error: "Please complete all required fields and enter a valid email address." }));
          return;
        }
        if (kind === "partner" && read("partnerType") === "organization" && !read("aboutOrganization")) {
          response.statusCode = 400;
          response.end(JSON.stringify({ error: "Please tell us about your organization." }));
          return;
        }
        if (kind === "podium") {
          const age = Number(read("age"));
          if (!Number.isInteger(age) || age < 11 || age > 19) {
            response.statusCode = 400;
            response.end(JSON.stringify({ error: "The participant must be between 11 and 19 years old." }));
            return;
          }
          if (age < 18 && ["guardianName", "guardianEmail", "guardianPhone", "guardianConsent"].some((field) => !read(field))) {
            response.statusCode = 400;
            response.end(JSON.stringify({ error: "A parent or legal guardian must provide their details and consent for applicants under 18." }));
            return;
          }
          if (age < 18 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(read("guardianEmail"))) {
            response.statusCode = 400;
            response.end(JSON.stringify({ error: "Please enter a valid guardian email address." }));
            return;
          }
        }
        const firstName = kind === "volunteer" ? read("firstName") : name.split(/\s+/)[0];
        const lastName = kind === "volunteer" ? read("surname") : name.split(/\s+/).slice(1).join(" ");
        const phone = kind === "podium" ? read("guardianPhone") : read("phone");
        const senderPhone = /^\+[1-9]\d{7,14}$/.test(phone) ? { phone } : {};
        const fields: Record<string, string> = { "{$lens_form_type}": kind };
        for (const [formName, senderName] of Object.entries(senderFieldNames[kind])) {
          const value = read(formName);
          if (value.length > 5_000) throw new Error("One of your answers is too long.");
          if (value) fields[`{$${senderName}}`] = value;
        }
        const senderHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" };
        const senderFetch = async (path: string, method: string, body?: unknown) => {
          const result = await fetch(`https://api.sender.net/v2${path}`, {
            method,
            headers: senderHeaders,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: AbortSignal.timeout(15_000),
          });
          if (!result.ok) console.error(`Sender ${method} ${path.split("/").slice(0, 3).join("/")} failed with ${result.status}`);
          return result;
        };

        const existing = await senderFetch(`/subscribers/${encodeURIComponent(email)}`, "GET");
        if (existing.status === 404) {
          const created = await senderFetch("/subscribers", "POST", {
            email, firstname: firstName, lastname: lastName,
            ...senderPhone, groups: [groupIds[kind]], fields, trigger_automation: false,
          });
          if (!created.ok) throw new Error("Sender could not save the application.");
        } else if (existing.ok) {
          const existingData = await existing.json() as {
            data?: {
              subscriber_tags?: Array<{ id?: string }>;
              columns?: Array<{ id?: string; value?: unknown }>;
            };
          };
          const groups = Array.from(new Set([
            ...(existingData.data?.subscriber_tags || []).map((group) => group.id).filter((id): id is string => Boolean(id)),
            groupIds[kind],
          ]));
          const fieldResponse = await senderFetch("/fields?limit=100", "GET");
          if (!fieldResponse.ok) throw new Error("Sender could not read the contact fields.");
          const fieldData = await fieldResponse.json() as { data?: Array<{ id?: string; name?: string }> };
          const senderNames = new Map((fieldData.data || []).map((field) => [field.id, field.name]));
          const existingFields: Record<string, string> = {};
          for (const column of existingData.data?.columns || []) {
            const name = senderNames.get(column.id)?.match(/^\{\{([a-z0-9_]+)\}\}$/i)?.[1];
            if (name && column.value !== null && column.value !== undefined) {
              existingFields[`{$${name}}`] = String(column.value);
            }
          }
          const updated = await senderFetch(`/subscribers/${encodeURIComponent(email)}`, "PATCH", {
            firstname: firstName, lastname: lastName, ...senderPhone, groups,
            fields: { ...existingFields, ...fields }, trigger_automation: false,
          });
          if (!updated.ok) throw new Error("Sender could not update the application.");
        } else {
          throw new Error("Sender could not check the contact.");
        }

        // Each new submission is retained as an event even if the same person submits again.
        const properties: Record<string, string> = { form: kind, name };
        for (const field of Object.keys(senderFieldNames[kind])) {
          const value = read(field);
          if (value) properties[field] = value.slice(0, 1_800);
        }
        const eventSaved = await senderFetch("/events", "POST", {
          subscriber: { email }, type: `lens_${kind}_submitted`, properties,
        });
        if (!eventSaved.ok) console.error(`Sender saved ${kind} subscriber details but could not record the submission event.`);

        response.statusCode = 200;
        response.end(JSON.stringify({ success: true }));
      } catch (error) {
        const isValidationError = error instanceof SyntaxError || (error instanceof Error && /too long|Invalid form/.test(error.message));
        response.statusCode = isValidationError ? 400 : 502;
        response.end(JSON.stringify({ error: isValidationError ? "Please check your answers and try again." : "We could not send your form right now. Please try again shortly." }));
      }
    });
  };
  return {
    name: "lens-sender-forms",
    configureServer(server) { attachHandler(server.middlewares); },
    configurePreviewServer(server) { attachHandler(server.middlewares); },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const adminAuth = adminAuthPlugin(env.ADMIN_PASSWORD);
  return {
    plugins: [
      react(),
      adminAuth.plugin,
      groqAiPlugin(env.GROQ_API_KEY, env.GROQ_MODEL || "openai/gpt-oss-20b", adminAuth.isAuthenticated),
      senderFormsPlugin(env.SENDER_API_TOKEN, {
        contact: env.SENDER_CONTACT_GROUP_ID,
        volunteer: env.SENDER_VOLUNTEER_GROUP_ID,
        partner: env.SENDER_PARTNER_GROUP_ID,
        podium: env.SENDER_PODIUM_GROUP_ID,
      }),
    ],
  };
});
