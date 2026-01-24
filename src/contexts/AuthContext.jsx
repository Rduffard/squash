import { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("squash_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("squash_user");
      }
    }
    setIsLoading(false);
  }, []);

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
