import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, startGoogleSignIn } from "../api";
import { setToken } from "../auth";
import AuthShell, { GoogleButton } from "../components/AuthShell";
import { useApp } from "../store";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // Only follow same-site paths, never "//other.site".
  const nextParam = params.get("next") || "";
  const next = /^\/(?!\/)/.test(nextParam) ? nextParam : "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(
    params.get("error") === "google" ? "Google sign-in did not finish." : "",
  );

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const data = await api("/api/v1/user/login", { method: "POST", body: form });
      setToken(data.token);
      login(data.user);
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell eyebrow="Welcome back" title="Sign in">
      <form onSubmit={submit} className="form">
        <label>
          <span>Email</span>
          <input
            className="field"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update}
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            className="field"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={update}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="button grow" type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Continue"}
        </button>
      </form>
      <GoogleButton onClick={() => startGoogleSignIn().catch((err) => setError(err.message))} />
      <p className="muted small-print">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}
