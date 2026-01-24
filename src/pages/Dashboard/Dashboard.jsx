import Header from "../../components/layout/Header/Header.jsx";
import Sidebar from "../../components/layout/Sidebar/Sidebar.jsx";
import StatusBadge from "../../components/squash/StatusBadge/StatusBadge.jsx";
import "./Dashboard.css";

export default function Dashboard({ projects = [], bugs = [] }) {
  // Bugs that are not resolved/closed
  const openBugs = bugs.filter(
    (bug) => bug.status !== "resolved" && bug.status !== "closed"
  );

  // Projects marked active
  const activeProjects = projects.filter(
    (project) => project.status === "active"
  );

  // Most recently updated bugs (latest 5)
  const recentActivity = [...bugs]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <main className="dashboard">
      <Header />

      <div className="dashboard__body">
        <Sidebar />

        <section className="dashboard__content">
          <header className="dashboard__page-header">
            <h1 className="dashboard__title">Dashboard</h1>
            <p className="dashboard__subtitle">
              Welcome back to Squash. Track bugs, projects, and progress here.
            </p>
          </header>

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
                Projects currently marked as active.
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
                <ul className="dashboard__activity-list">
                  {recentActivity.map((bug) => (
                    <li key={bug.id} className="dashboard__activity-item">
                      <div className="dashboard__activity-main">
                        <span className="dashboard__activity-bug-id">
                          {bug.id}
                        </span>
                        <span className="dashboard__activity-title">
                          {bug.title}
                        </span>
                      </div>

                      <div className="dashboard__activity-meta">
                        <StatusBadge status={bug.status} />
                        <span className="dashboard__activity-time">
                          Updated{" "}
                          {new Date(bug.updatedAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
