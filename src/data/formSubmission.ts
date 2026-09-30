export type FormKind = "contact" | "volunteer" | "partner";

export async function submitSiteForm(kind: FormKind, form: HTMLFormElement) {
  const fields: Record<string, string | string[]> = {};
  const data = new FormData(form);
  for (const key of new Set(data.keys())) {
    const values = data.getAll(key).map((value) => String(value).trim()).filter(Boolean);
    fields[key] = values.length > 1 ? values : (values[0] ?? "");
  }

  let response: Response;
  try {
    response = await fetch(`/api/forms/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
  } catch {
    throw new Error("We could not connect right now. Please try again shortly.");
  }

  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(result.error || "Your form could not be sent. Please try again.");
  }
}
