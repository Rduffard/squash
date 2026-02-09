import { useCallback, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../../pages/Landing/Landing.jsx";
import Login from "../../pages/Login/Login.jsx";
import Register from "../../pages/Register/Register.jsx";

// NEW
import DashboardLayout from "../../pages/Dashboard/DashboardLayout/DashboardLayout.jsx";
import DashboardHome from "../../pages/Dashboard/DashboardHome.jsx";

import Projects from "../../pages/Projects/Projects.jsx";
import ProjectView from "../../pages/ProjectView/ProjectView.jsx";
import Bugs from "../../pages/Bugs/Bugs.jsx";
import BugView from "../../pages/BugView/BugView.jsx";
import Settings from "../../pages/Settings/Settings.jsx";

import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute.jsx";

import { demoProjects, demoBugs } from "../../data/demoData.js";

function App() {
  const [projects, setProjects] = useState(demoProjects);
  const [bugs, setBugs] = useState(demoBugs);

  // --- Projects ---
  const addProject = useCallback((newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  }, []);

  const updateProject = useCallback((projectId, patch) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, ...patch } : p)),
    );
  }, []);

  // --- Bugs ---
  const addBug = useCallback((newBug) => {
    setBugs((prev) => [newBug, ...prev]);
  }, []);

  const updateBug = useCallback((bugId, patch) => {
    setBugs((prev) =>
      prev.map((b) => (b.id === bugId ? { ...b, ...patch } : b)),
    );
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard shell stays mounted for all subpages */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* /dashboard */}
          <Route
            index
            element={<DashboardHome projects={projects} bugs={bugs} />}
          />

          {/* /dashboard/projects */}
          <Route
            path="projects"
            element={
              <Projects
                projects={projects}
                bugs={bugs}
                addProject={addProject}
                updateProject={updateProject}
              />
            }
          />

          {/* /dashboard/projects/:projectId */}
          <Route
            path="projects/:projectId"
            element={
              <ProjectView
                projects={projects}
                bugs={bugs}
                addBug={addBug}
                updateBug={updateBug}
                updateProject={updateProject}
              />
            }
          />

          {/* /dashboard/bugs */}
          <Route
            path="bugs"
            element={
              <Bugs
                bugs={bugs}
                projects={projects}
                addBug={addBug}
                updateBug={updateBug}
              />
            }
          />

          {/* /dashboard/bugs/:bugId */}
          <Route
            path="bugs/:bugId"
            element={
              <BugView bugs={bugs} projects={projects} updateBug={updateBug} />
            }
          />

          {/* /dashboard/settings */}
          <Route path="settings" element={<Settings />} />

          {/* Optional: unknown dashboard route -> /dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Optional: unknown global route -> / */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
