import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, startGoogleSignIn } from "../api";
import { setToken } from "../auth";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(
    params.get("error") === "google" ? "Google sign-in did not finish." : "",
  );

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await api("/api/v1/user/login", { method: "POST", body: form });
      setToken(data.token);
      onLogin(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="panel page">
      <p className="eyebrow">Enter</p>
      <h1>Sign in</h1>
      <form onSubmit={submit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="button" type="submit">
          Continue
        </button>
      </form>
      <button
        className="button ghost"
        type="button"
        onClick={() => startGoogleSignIn().catch((err) => setError(err.message))}
      >
        Continue with Google
      </button>
      <p className="muted">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </section>
  );
}
