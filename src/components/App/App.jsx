// src/components/App/App.jsx
import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../../pages/Landing/Landing.jsx";
import Login from "../../pages/Login/Login.jsx";
import Register from "../../pages/Register/Register.jsx";

// Dashboard shell + subpages
import DashboardLayout from "../../pages/Dashboard/DashboardLayout/DashboardLayout.jsx";
import DashboardHome from "../../pages/Dashboard/DashboardHome/DashboardHome.jsx";

import Projects from "../../pages/Projects/Projects.jsx";
import ProjectView from "../../pages/ProjectView/ProjectView.jsx";
import Bugs from "../../pages/Bugs/Bugs.jsx";
import BugView from "../../pages/BugView/BugView.jsx";
import Settings from "../../pages/Settings/Settings.jsx";

import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute.jsx";
import { useAuth } from "../../hooks/useAuth";

// ✅ NEW
import Preloader from "../../components/common/Preloader/Preloader.jsx";

function App() {
  const { token, user } = useAuth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  const [projects, setProjects] = useState([]);
  const [bugs, setBugs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  function asArray(maybe) {
    if (Array.isArray(maybe)) return maybe;
    if (Array.isArray(maybe?.projects)) return maybe.projects;
    if (Array.isArray(maybe?.bugs)) return maybe.bugs;
    if (Array.isArray(maybe?.data)) return maybe.data;
    return [];
  }

  // --- initial load (when user+token are ready) ---
  useEffect(() => {
    let ignore = false;

    async function fetchJson(url) {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data?.message || data?.error || `Request failed (${res.status})`;
        throw new Error(message);
      }

      return data;
    }

    async function load() {
      if (!user || !token) {
        setProjects([]);
        setBugs([]);
        setLoadError("");
        return;
      }

      try {
        setLoading(true);
        setLoadError("");

        const [p, b] = await Promise.all([
          fetchJson(`${API_BASE}/squash/projects`),
          fetchJson(`${API_BASE}/squash/bugs`),
        ]);

        if (ignore) return;

        setProjects(asArray(p));
        setBugs(asArray(b));
      } catch (e) {
        if (ignore) return;
        setLoadError(e.message || "Failed to load data");
        setProjects([]);
        setBugs([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [API_BASE, user, token]);

  // --- Projects ---
  const addProject = useCallback(
    async (newProject) => {
      const res = await fetch(`${API_BASE}/squash/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      const created = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          created?.message || created?.error || "Failed to create project";
        throw new Error(message);
      }

      setProjects((prev) => [created, ...prev]);
      return created;
    },
    [API_BASE, token],
  );

  const updateProject = useCallback((projectId, patch) => {
    setProjects((prev) =>
      prev.map((p) =>
        String(p._id) === String(projectId) ? { ...p, ...patch } : p,
      ),
    );
  }, []);

  // --- Bugs ---
  const addBug = useCallback(
    async (newBug) => {
      const res = await fetch(`${API_BASE}/squash/bugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBug),
      });

      const created = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          created?.message || created?.error || "Failed to create bug";
        throw new Error(message);
      }

      setBugs((prev) => [created, ...prev]);
      return created;
    },
    [API_BASE, token],
  );

  const updateBug = useCallback((bugId, patch) => {
    setBugs((prev) =>
      prev.map((b) =>
        String(b._id) === String(bugId) ? { ...b, ...patch } : b,
      ),
    );
  }, []);

  // ✅ NEW: Full-screen preloader during initial authenticated fetch
  // (Does not block Landing/Login/Register when logged out)
  if (user && token && loading) {
    return <Preloader text="Loading your workspace..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<DashboardLayout loading={loading} loadError={loadError} />}
        >
          <Route
            index
            element={
              <DashboardHome
                projects={projects}
                bugs={bugs}
                loading={loading}
                loadError={loadError}
              />
            }
          />

          <Route
            path="projects"
            element={
              <Projects
                projects={projects}
                bugs={bugs}
                addProject={addProject}
                updateProject={updateProject}
                loading={loading}
                loadError={loadError}
              />
            }
          />

          <Route
            path="projects/:projectId"
            element={
              <ProjectView
                projects={projects}
                bugs={bugs}
                addBug={addBug}
                updateBug={updateBug}
                updateProject={updateProject}
                loading={loading}
                loadError={loadError}
              />
            }
          />

          <Route
            path="bugs"
            element={
              <Bugs
                bugs={bugs}
                projects={projects}
                addBug={addBug}
                updateBug={updateBug}
                loading={loading}
                loadError={loadError}
              />
            }
          />

          <Route
            path="bugs/:bugId"
            element={
              <BugView
                bugs={bugs}
                projects={projects}
                updateBug={updateBug}
                loading={loading}
                loadError={loadError}
              />
            }
          />

          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
