import { useState } from "react";
import { Link } from "react-router-dom";
import { api, startGoogleSignIn } from "../api";
import AuthShell, { GoogleButton } from "../components/AuthShell";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("details");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const send = async (path, body, nextStep) => {
    setError("");
    setPending(true);
    try {
      const data = await api(path, { method: "POST", body });
      setMessage(data.message);
      setStep(nextStep);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    send("/api/v1/user/signup", form, "verify");
  };

  const verify = (event) => {
    event.preventDefault();
    send("/api/v1/user/verify-otp", { email: form.email, otp }, "done");
  };

  if (step === "done") {
    return (
      <AuthShell eyebrow="Verified" title="You're in.">
        <p className="muted">{message}</p>
        <Link className="button grow" to="/login">
          Sign in
        </Link>
      </AuthShell>
    );
  }

  if (step === "verify") {
    return (
      <AuthShell eyebrow="Step 2 of 2" title="Check your email">
        <p className="muted">{message}</p>
        <form onSubmit={verify} className="form">
          <label>
            <span>Code</span>
            <input
              className="field code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="button grow" type="submit" disabled={pending}>
            {pending ? "Verifying…" : "Verify email"}
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Step 1 of 2" title="Create an account">
      <form onSubmit={submit} className="form">
        <div className="form-row">
          <label>
            <span>First name</span>
            <input
              className="field"
              name="firstName"
              autoComplete="given-name"
              value={form.firstName}
              onChange={update}
              required
            />
          </label>
          <label>
            <span>Last name</span>
            <input
              className="field"
              name="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={update}
              required
            />
          </label>
        </div>
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
            autoComplete="new-password"
            value={form.password}
            onChange={update}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="button grow" type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create account"}
        </button>
      </form>
      <GoogleButton onClick={() => startGoogleSignIn().catch((err) => setError(err.message))} />
      <p className="muted small-print">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}
