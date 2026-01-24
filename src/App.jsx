import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import ProjectView from "./pages/ProjectView/ProjectView.jsx";
import Bugs from "./pages/Bugs/Bugs.jsx"; // 👈 new
import BugView from "./pages/BugView/BugView.jsx";
import Settings from "./pages/Settings/Settings.jsx";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

import { demoProjects, demoBugs } from "./data/demoData.js";

function App() {
  const [projects, setProjects] = useState(demoProjects);
  const [bugs, setBugs] = useState(demoBugs);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard projects={projects} bugs={bugs} />}
        />

        {/* Projects */}
        <Route
          path="/projects"
          element={<Projects projects={projects} bugs={bugs} />}
        />
        <Route
          path="/projects/:projectId"
          element={<ProjectView projects={projects} bugs={bugs} />}
        />

        {/* Bugs */}
        <Route
          path="/bugs"
          element={<Bugs bugs={bugs} projects={projects} />}
        />

        <Route
          path="/bugs/:bugId"
          element={<BugView bugs={bugs} projects={projects} />}
        />

        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
