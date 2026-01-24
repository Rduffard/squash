import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth.js";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="app-header">
      <div className="app-header__left">
        <span className="app-header__logo">Squash 🐛</span>
      </div>

      <nav className="app-header__nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            "app-header__link" + (isActive ? " app-header__link_active" : "")
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            "app-header__link" + (isActive ? " app-header__link_active" : "")
          }
        >
          Settings
        </NavLink>
      </nav>

      <div className="app-header__right">
        {user && <span className="app-header__user">{user.email}</span>}
        <button
          className="app-header__button"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
