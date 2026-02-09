import { createContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("squash_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem("squash_user");
      return null;
    }
  });

  const isLoading = false;

  function login(userData) {
    setUser(userData);
    localStorage.setItem("squash_user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("squash_user");
  }

  const value = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
