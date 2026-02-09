import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">Navigation</h2>

      <nav className="sidebar__nav">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link_active" : "")
          }
        >
          Overview
        </NavLink>

        <NavLink
          to="/dashboard/projects"
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link_active" : "")
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/dashboard/bugs"
          className={({ isActive }) =>
            "sidebar__link" + (isActive ? " sidebar__link_active" : "")
          }
        >
          Bugs
        </NavLink>
      </nav>
    </aside>
  );
}
