import { fallbackEvents } from "../src/data/events";
import {
  defaultAnnualReports,
  defaultFaqs,
  defaultSiteImages,
  defaultTeamMembers,
  defaultTestimonials,
} from "../src/data/cms";

type KVNamespaceLike = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
};

type AssetsBinding = { fetch(request: Request): Promise<Response> };

type Env = {
  ASSETS: AssetsBinding;
  CMS_KV: KVNamespaceLike;
  ADMIN_PASSWORD: string;
  GROQ_API_KEY: string;
  GROQ_MODEL?: string;
  SENDER_API_TOKEN: string;
  SENDER_CONTACT_GROUP_ID: string;
  SENDER_VOLUNTEER_GROUP_ID: string;
  SENDER_PARTNER_GROUP_ID: string;
  SENDER_PODIUM_GROUP_ID: string;
};

type CmsCollectionName = "events" | "reports" | "testimonials" | "faqs" | "siteImages" | "team";
type FormKind = "contact" | "volunteer" | "partner" | "podium";

const CMS_COLLECTIONS: CmsCollectionName[] = ["events", "reports", "testimonials", "faqs", "siteImages", "team"];
const SESSION_COOKIE = "lens_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;

const DEFAULT_CMS: Record<CmsCollectionName, unknown[]> = {
  events: fallbackEvents,
  reports: defaultAnnualReports,
  testimonials: defaultTestimonials,
  faqs: defaultFaqs,
  siteImages: defaultSiteImages,
  team: defaultTeamMembers,
};

const senderFieldNames: Record<FormKind, Record<string, string>> = {
  contact: { subject: "lens_contact_subject", message: "lens_contact_message" },
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

function json(payload: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

async function readJson(request: Request, maxBytes = 50_000) {
  const body = await request.text();
  if (body.length > maxBytes) throw new Error("Request is too large.");
  return JSON.parse(body || "{}");
}

function readCookie(request: Request, name: string) {
  const cookies = request.headers.get("Cookie")?.split(";") ?? [];
  const entry = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.trim().slice(name.length + 1)) : "";
}

function toBase64Url(bytes: ArrayBuffer) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function secureMatch(left: string, right: string) {
  const encoder = new TextEncoder();
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const a = new Uint8Array(leftHash);
  const b = new Uint8Array(rightHash);
  let difference = a.length ^ b.length;
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) difference |= (a[index] || 0) ^ (b[index] || 0);
  return difference === 0;
}

async function isAuthenticated(request: Request, env: Env) {
  if (!env.ADMIN_PASSWORD) return false;
  const token = readCookie(request, SESSION_COOKIE);
  const separator = token.lastIndexOf(".");
  if (separator < 1) return false;
  const expires = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!/^\d+$/.test(expires) || Number(expires) <= Date.now()) return false;
  return secureMatch(signature, await sign(expires, env.ADMIN_PASSWORD));
}

async function handleAdmin(request: Request, env: Env, pathname: string) {
  if (request.method === "GET" && pathname === "/api/admin/session") {
    return json({ authenticated: await isAuthenticated(request, env), configured: Boolean(env.ADMIN_PASSWORD) });
  }
  if (request.method === "POST" && pathname === "/api/admin/login") {
    if (!env.ADMIN_PASSWORD) return json({ error: "Admin access is not configured." }, 503);
    try {
      const supplied = String((await readJson(request, 10_000) as { password?: string }).password || "");
      if (!await secureMatch(supplied, env.ADMIN_PASSWORD)) return json({ error: "Incorrect password. Please try again." }, 401);
      const expires = String(Date.now() + SESSION_SECONDS * 1000);
      const token = `${expires}.${await sign(expires, env.ADMIN_PASSWORD)}`;
      return json({ authenticated: true }, 200, {
        "Set-Cookie": `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`,
      });
    } catch {
      return json({ error: "Unable to sign in." }, 400);
    }
  }
  if (request.method === "POST" && pathname === "/api/admin/logout") {
    return json({ authenticated: false }, 200, {
      "Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
    });
  }
  return null;
}

async function readCmsCollection(env: Env, collection: CmsCollectionName) {
  const stored = await env.CMS_KV.get(`cms:${collection}`);
  if (!stored) return DEFAULT_CMS[collection];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : DEFAULT_CMS[collection];
  } catch {
    return DEFAULT_CMS[collection];
  }
}

async function handleCms(request: Request, env: Env, pathname: string) {
  if (request.method === "GET" && pathname === "/api/cms") {
    const values = await Promise.all(CMS_COLLECTIONS.map((collection) => readCmsCollection(env, collection)));
    return json(Object.fromEntries(CMS_COLLECTIONS.map((collection, index) => [collection, values[index]])));
  }
  const match = pathname.match(/^\/api\/cms\/([A-Za-z]+)$/);
  if (request.method === "PUT" && match) {
    const collection = match[1] as CmsCollectionName;
    if (!CMS_COLLECTIONS.includes(collection)) return json({ error: "Unknown CMS collection." }, 404);
    if (!await isAuthenticated(request, env)) return json({ error: "Your admin session has expired. Sign in again." }, 401);
    try {
      const value = await readJson(request, 24_000_000);
      if (!Array.isArray(value)) return json({ error: "CMS collections must be arrays." }, 400);
      await env.CMS_KV.put(`cms:${collection}`, JSON.stringify(value));
      return json({ success: true, collection, records: value.length });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Unable to save CMS content." }, 400);
    }
  }
  return null;
}

async function handleAi(request: Request, env: Env, pathname: string) {
  if (pathname !== "/api/ai/generate" || request.method !== "POST") return null;
  if (!await isAuthenticated(request, env)) return json({ error: "Your admin session has expired. Sign in again to use Groq." }, 401);
  if (!env.GROQ_API_KEY) return json({ error: "Groq is not configured." }, 503);
  try {
    const body = await readJson(request) as { kind?: "event" | "report"; context?: Record<string, unknown> };
    const context = body.context ?? {};
    const foundationContext = "The Lens Foundation is a community-focused nonprofit that turns compassion into practical help for children, families, and underserved communities through food assistance, education support, medical-bill support, direct aid, outreach, and partnerships. It is not an eye-care or optometry organisation.";
    const eventInstruction = `${foundationContext} Write accurate website copy for a Lens Foundation community event. Return JSON only with: summary (1 concise sentence), overview (80-120 words), expectations (exactly 4 concise strings), and whyAttend (45-70 words). The status determines the tense: Upcoming uses future-facing language and explains what guests can expect and why to attend; Completed uses past tense and explains what happened and why it mattered. Never invent figures, beneficiaries, partners, locations, or outcomes that are not supplied. If information is limited, keep the copy general rather than guessing. Context: ${JSON.stringify(context)}`;
    const reportInstruction = `${foundationContext} Write supporting copy for a Lens Foundation annual report card. Return JSON only with one key: description. Write 25-40 words in a clear, accountable nonprofit voice. When no achievements or statistics are supplied, describe the report as a transparent record of programmes, partnerships, community reach, learning, and progress without claiming specific results. Context: ${JSON.stringify(context)}`;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.GROQ_MODEL || "openai/gpt-oss-20b",
        temperature: 0.45,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are the careful editorial assistant for The Lens Foundation. Produce polished, factual JSON with no markdown." },
          { role: "user", content: body.kind === "report" ? reportInstruction : eventInstruction },
        ],
      }),
    });
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };
    if (!response.ok) return json({ error: payload.error?.message || "Groq could not generate content." }, response.status);
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return json({ error: "Groq returned an empty response." }, 502);
    return json({ content: JSON.parse(content) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Content generation failed." }, 500);
  }
}

async function handleForm(request: Request, env: Env, pathname: string) {
  const match = pathname.match(/^\/api\/forms\/(contact|volunteer|partner|podium)$/);
  if (!match || request.method !== "POST") return null;
  const kind = match[1] as FormKind;
  const groupIds: Record<FormKind, string> = {
    contact: env.SENDER_CONTACT_GROUP_ID,
    volunteer: env.SENDER_VOLUNTEER_GROUP_ID,
    partner: env.SENDER_PARTNER_GROUP_ID,
    podium: env.SENDER_PODIUM_GROUP_ID,
  };
  if (!env.SENDER_API_TOKEN || !groupIds[kind]) return json({ error: "This form is temporarily unavailable. Please try again later." }, 503);

  try {
    const submitted = await readJson(request, 30_000) as Record<string, unknown>;
    const read = (name: string) => {
      const value = submitted[name];
      return (Array.isArray(value) ? value.map(String).join(", ") : typeof value === "string" ? value : "").trim();
    };
    const email = read("email").toLowerCase();
    const name = kind === "volunteer" ? `${read("firstName")} ${read("surname")}`.trim() : read("fullName");
    const requiredByKind: Record<FormKind, string[]> = {
      contact: ["fullName", "email", "subject", "message"],
      volunteer: ["firstName", "surname", "email", "sex", "birthMonth", "birthDay", "nationality", "currentLocation", "phone", "preferredChapter", "education", "profession", "contribution"],
      partner: ["partnerType", "fullName", "email", "phone", "location", "contactMode", "heardFrom"],
      podium: ["fullName", "email", "age", "gender", "gradeLevel", "aboutYourself", "motivation", "previousSpeakingExperience", "mediaConsent"],
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || requiredByKind[kind].some((field) => !read(field))) {
      return json({ error: "Please complete all required fields and enter a valid email address." }, 400);
    }
    if (kind === "partner" && read("partnerType") === "organization" && !read("aboutOrganization")) {
      return json({ error: "Please tell us about your organization." }, 400);
    }
    if (kind === "podium") {
      const age = Number(read("age"));
      if (!Number.isInteger(age) || age < 11 || age > 19) return json({ error: "The participant must be between 11 and 19 years old." }, 400);
      if (age < 18 && ["guardianName", "guardianEmail", "guardianPhone", "guardianConsent"].some((field) => !read(field))) {
        return json({ error: "A parent or legal guardian must provide their details and consent for applicants under 18." }, 400);
      }
      if (age < 18 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(read("guardianEmail"))) return json({ error: "Please enter a valid guardian email address." }, 400);
    }

    const firstName = kind === "volunteer" ? read("firstName") : name.split(/\s+/)[0];
    const lastName = kind === "volunteer" ? read("surname") : name.split(/\s+/).slice(1).join(" ");
    const phone = kind === "podium" ? read("guardianPhone") : read("phone");
    const senderPhone = /^\+[1-9]\d{7,14}$/.test(phone) ? { phone } : {};
    const fields: Record<string, string> = { "{$lens_form_type}": kind };
    for (const [formName, senderName] of Object.entries(senderFieldNames[kind])) {
      const value = read(formName);
      if (value.length > 5_000) return json({ error: "One of your answers is too long." }, 400);
      if (value) fields[`{$${senderName}}`] = value;
    }
    const senderHeaders = { Authorization: `Bearer ${env.SENDER_API_TOKEN}`, "Content-Type": "application/json", Accept: "application/json" };
    const senderFetch = (path: string, method: string, body?: unknown) => fetch(`https://api.sender.net/v2${path}`, {
      method,
      headers: senderHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const existing = await senderFetch(`/subscribers/${encodeURIComponent(email)}`, "GET");
    if (existing.status === 404) {
      const created = await senderFetch("/subscribers", "POST", { email, firstname: firstName, lastname: lastName, ...senderPhone, groups: [groupIds[kind]], fields, trigger_automation: false });
      if (!created.ok) throw new Error("Sender could not save the application.");
    } else if (existing.ok) {
      const existingData = await existing.json() as { data?: { subscriber_tags?: Array<{ id?: string }>; columns?: Array<{ id?: string; value?: unknown }> } };
      const groups = Array.from(new Set([...(existingData.data?.subscriber_tags || []).map((group) => group.id).filter((id): id is string => Boolean(id)), groupIds[kind]]));
      const fieldResponse = await senderFetch("/fields?limit=100", "GET");
      if (!fieldResponse.ok) throw new Error("Sender could not read the contact fields.");
      const fieldData = await fieldResponse.json() as { data?: Array<{ id?: string; name?: string }> };
      const senderNames = new Map((fieldData.data || []).map((field) => [field.id, field.name]));
      const existingFields: Record<string, string> = {};
      for (const column of existingData.data?.columns || []) {
        const fieldName = senderNames.get(column.id)?.match(/^\{\{([a-z0-9_]+)\}\}$/i)?.[1];
        if (fieldName && column.value !== null && column.value !== undefined) existingFields[`{$${fieldName}}`] = String(column.value);
      }
      const updated = await senderFetch(`/subscribers/${encodeURIComponent(email)}`, "PATCH", { firstname: firstName, lastname: lastName, ...senderPhone, groups, fields: { ...existingFields, ...fields }, trigger_automation: false });
      if (!updated.ok) throw new Error("Sender could not update the application.");
    } else {
      throw new Error("Sender could not check the contact.");
    }
    const properties: Record<string, string> = { form: kind, name };
    for (const field of Object.keys(senderFieldNames[kind])) {
      const value = read(field);
      if (value) properties[field] = value.slice(0, 1_800);
    }
    await senderFetch("/events", "POST", { subscriber: { email }, type: `lens_${kind}_submitted`, properties });
    return json({ success: true });
  } catch {
    return json({ error: "We could not send your form right now. Please try again shortly." }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const pathname = new URL(request.url).pathname;
    const apiResponse = await handleAdmin(request, env, pathname)
      ?? await handleCms(request, env, pathname)
      ?? await handleAi(request, env, pathname)
      ?? await handleForm(request, env, pathname);
    if (apiResponse) return apiResponse;
    if (pathname.startsWith("/api/")) return json({ error: "Not found." }, 404);
    const response = await env.ASSETS.fetch(request);
    if (pathname.startsWith("/.well-known/") && response.headers.get("Content-Type")?.includes("text/html")) {
      return json({ error: "Not found." }, 404);
    }
    if (!response.ok) return response;
    const headers = new Headers(response.headers);
    if (["/robots.txt", "/sitemap.xml", "/llms.txt"].includes(pathname)) {
      headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
    if (!pathname.startsWith("/assets/")) return response;
    const versioned = /(?:-v\d+|index-[A-Za-z0-9_-]+)\.[^.]+$/.test(pathname);
    headers.set("Cache-Control", versioned
      ? "public, max-age=31536000, immutable"
      : "public, max-age=86400, stale-while-revalidate=604800");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
