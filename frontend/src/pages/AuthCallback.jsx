import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { setToken } from "../auth";
import AuthShell from "../components/AuthShell";
import { useApp } from "../store";

export default function AuthCallback() {
  const { login } = useApp();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  // Google's code works once; StrictMode runs effects twice in dev.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state || params.get("error")) {
      navigate("/login?error=google", { replace: true });
      return;
    }

    api("/api/v1/auth/google/callback", { method: "POST", body: { code, state } })
      .then((data) => {
        setToken(data.token);
        login(data.user);
        navigate("/", { replace: true });
      })
      .catch(() => navigate("/login?error=google", { replace: true }));
  }, [navigate, login, params]);

  return (
    <AuthShell eyebrow="Google" title="Signing you in">
      <div className="loader" aria-label="Loading" />
    </AuthShell>
  );
}
