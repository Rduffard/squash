import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import "./Register.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // 1) signup
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          avatar: avatar || undefined,
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Signup failed");

      // 2) signin immediately after signup
      const loginRes = await fetch(`${API_BASE}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok) throw new Error(loginData.message || "Signin failed");

      const { token } = loginData;

      // 3) fetch /me
      const meRes = await fetch(`${API_BASE}/auth/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const me = await meRes.json().catch(() => ({}));
      if (!meRes.ok) throw new Error(me.message || "Failed to fetch user");

      // 4) store
      login(me, token);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Register failed");
    }
  }

  return (
    <main className="register">
      <div className="register__card fade-in">
        <h1 className="register__title">Create account</h1>

        <form className="register__form" onSubmit={handleSubmit}>
          <label className="register__label">
            Name
            <input
              className="register__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={30}
              required
            />
          </label>

          <label className="register__label">
            Avatar URL (optional)
            <input
              className="register__input"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="register__label">
            Email
            <input
              className="register__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="register__label">
            Password
            <input
              className="register__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          {error ? <p className="register__error">{error}</p> : null}

          <button className="register__button" type="submit">
            Create account
          </button>
        </form>

        <p className="register__hint">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
