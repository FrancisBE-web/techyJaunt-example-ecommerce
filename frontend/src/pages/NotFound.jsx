import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="panel glass page center">
      <p className="eyebrow mono">404</p>
      <h1 className="title">Lost in the void.</h1>
      <p className="muted">This page drifted out of range.</p>
      <Link className="button" to="/">
        Return home
      </Link>
    </section>
  );
}
