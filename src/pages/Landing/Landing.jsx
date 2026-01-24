import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <main className="landing">
      <h1 className="landing__title">Welcome to Squash 🐛</h1>
      <p className="landing__subtitle">Your bug reporting app for devs & QA.</p>

      <Link to="/login" className="landing__login-btn">
        Log In
      </Link>
    </main>
  );
}
