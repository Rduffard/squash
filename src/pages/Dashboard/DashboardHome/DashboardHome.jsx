// src/pages/Dashboard/DashboardHome/DashboardHome.jsx
import { useNavigate } from "react-router-dom";
import BugCard from "../../../components/squash/BugCard/BugCard.jsx";
import "./DashboardHome.css";

export default function DashboardHome({
  projects = [],
  bugs = [],
  loading,
  loadError,
}) {
  const navigate = useNavigate();

  const openBugs = bugs.filter(
    (bug) => bug.status !== "resolved" && bug.status !== "closed",
  );

  // MVP: projects don't have a status field in the backend yet
  // Treat all accessible projects as "active"
  const activeProjects = Array.isArray(projects) ? projects : [];

  // Most recent first
  const recentActivity = [...bugs]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0),
    )
    .slice(0, 5);

  const handleBugClick = (bugId) => {
    navigate(`/dashboard/bugs/${bugId}`);
  };

  return (
    <section className="dashboard">
      <header className="dashboard__page-header">
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__subtitle">
          Welcome back to Squash. Track bugs, projects, and progress here.
        </p>
      </header>

      {loadError ? <p className="dashboard__error">{loadError}</p> : null}

      {loading ? <p className="dashboard__loading">Loading…</p> : null}

      <section className="dashboard__grid">
        {/* Open Bugs */}
        <article className="dashboard__card">
          <h2 className="dashboard__card-title">Open Bugs</h2>
          <p className="dashboard__card-value">{openBugs.length}</p>
          <p className="dashboard__card-label">
            {openBugs.length === 0
              ? "All clear for now."
              : "Bugs that aren’t resolved or closed."}
          </p>
        </article>

        {/* Active Projects */}
        <article className="dashboard__card">
          <h2 className="dashboard__card-title">Active Projects</h2>
          <p className="dashboard__card-value">{activeProjects.length}</p>
          <p className="dashboard__card-label">
            Projects you currently have access to.
          </p>
        </article>

        {/* Recent Activity */}
        <article className="dashboard__card dashboard__card--wide">
          <h2 className="dashboard__card-title">Recent Activity</h2>

          {recentActivity.length === 0 ? (
            <p className="dashboard__card-label">
              You’ll see your latest bug updates and comments here.
            </p>
          ) : (
            <div className="dashboard__activity-cards">
              {recentActivity.map((bug) => {
                const project = projects.find(
                  (p) => String(p._id) === String(bug.projectId),
                );

                return (
                  <BugCard
                    key={bug._id}
                    bug={bug}
                    project={project}
                    onClick={() => handleBugClick(bug._id)}
                    className="dashboard__activity-card"
                    showProject={true}
                    showUpdatedAt={true}
                  />
                );
              })}
            </div>
          )}
        </article>
      </section>
    </section>
  );
}
