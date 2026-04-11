// src/contexts/AuthContext.jsx
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const AUTH_KEY = "cw_auth";
const LEGACY_TOKEN_KEY = "squash_token";
const LEGACY_USER_KEY = "squash_user";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

function readAuth() {
  const raw = localStorage.getItem(AUTH_KEY);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const token = parsed?.token || null;
      const user = parsed?.user || null;

      return { token, user };
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
  }

  const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY);
  const legacyUserRaw = localStorage.getItem(LEGACY_USER_KEY);

  let legacyUser = null;

  if (legacyUserRaw) {
    try {
      legacyUser = JSON.parse(legacyUserRaw);
    } catch {
      localStorage.removeItem(LEGACY_USER_KEY);
    }
  }

  if (legacyToken) {
    const migrated = { token: legacyToken, user: legacyUser };

    localStorage.setItem(AUTH_KEY, JSON.stringify(migrated));
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);

    return migrated;
  }

  return { token: null, user: null };
}

function writeAuth({ token, user }) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
}

export function AuthProvider({ children }) {
  const initial = readAuth();

  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);
  const [isLoading, setIsLoading] = useState(Boolean(initial.token));

  function login(userData, newToken) {
    if (!newToken) return;

    setUser(userData);
    setToken(newToken);
    writeAuth({ token: newToken, user: userData });
  }

  function logout() {
    setUser(null);
    setToken(null);
    clearAuth();
  }

  useEffect(() => {
    const { token: storedToken } = readAuth();

    if (!storedToken) {
      return;
    }

    fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((me) => {
        setUser(me);
        writeAuth({ token: storedToken, user: me });
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        clearAuth();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = { user, token, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
