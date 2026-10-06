import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeSlash, LockKey } from "@phosphor-icons/react";
import { AdminDashboard } from "./AdminDashboard";

export function AdminAccess() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/admin/session", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((payload: { authenticated?: boolean }) => setAuthenticated(Boolean(payload.authenticated)))
      .catch(() => setError("Admin access is temporarily unavailable. Please restart the server and try again."))
      .finally(() => setChecking(false));
  }, []);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json() as { authenticated?: boolean; error?: string };
      if (!response.ok || !payload.authenticated) throw new Error(payload.error || "Unable to sign in.");
      setPassword("");
      setAuthenticated(true);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    setAuthenticated(false);
  };

  if (checking) return <main className="admin-login-page"><div className="admin-login-loading" role="status">Checking secure access…</div></main>;
  if (authenticated) return <AdminDashboard onLogout={() => void signOut()} />;

  return <main className="admin-login-page">
    <section className="admin-login-card" aria-labelledby="admin-login-title">
      <a href="/" className="admin-login-brand" aria-label="Return to The Lens Foundation homepage"><img src="/assets/lens-logo-192-v2.webp" width="192" height="192" alt="" /><span>The Lens Foundation</span></a>
      <div className="admin-login-icon"><LockKey size={28} weight="duotone" /></div>
      <h1 id="admin-login-title">Admin access</h1>
      <p>Enter the administrator password to manage website content.</p>
      <form onSubmit={signIn}>
        <label htmlFor="admin-password">Password</label>
        <div className="admin-password-field">
          <input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus />
          <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}</button>
        </div>
        {error && <p className="admin-login-error" role="alert">{error}</p>}
        <button className="admin-login-submit" type="submit" disabled={submitting || !password}>{submitting ? "Signing in…" : "Sign in securely"}</button>
      </form>
      <a className="admin-login-back" href="/">Back to website</a>
    </section>
  </main>;
}
