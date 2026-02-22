import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import "./Login.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Signin failed");

      const { token } = data;

      const meRes = await fetch(`${API_BASE}/auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const me = await meRes.json().catch(() => ({}));
      if (!meRes.ok) throw new Error(me.message || "Failed to fetch user");

      login(me, token);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    }
  }

  return (
    <main className="login">
      <div className="login__card fade-in">
        <h1 className="login__title">Login</h1>

        <form className="login__form" onSubmit={handleSubmit}>
          <label className="login__label">
            Email
            <input
              className="login__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="login__label">
            Password
            <input
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="login__error">{error}</p> : null}

          <button className="login__button" type="submit">
            Log in
          </button>
        </form>

        <p className="login__hint">
          New to Squash? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
