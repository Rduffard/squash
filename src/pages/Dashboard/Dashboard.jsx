import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header/Header.jsx";
import Sidebar from "../../components/layout/Sidebar/Sidebar.jsx";
import BugCard from "../../components/squash/BugCard/BugCard.jsx";
import "./Dashboard.css";

export default function Dashboard({ projects = [], bugs = [] }) {
  const navigate = useNavigate();

  const openBugs = bugs.filter(
    (bug) => bug.status !== "resolved" && bug.status !== "closed",
  );

  const activeProjects = projects.filter(
    (project) => project.status === "active",
  );

  const recentActivity = [...bugs]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const handleBugClick = (bugId) => {
    navigate(`/bugs/${bugId}`);
  };

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
                <div className="dashboard__activity-cards">
                  {recentActivity.map((bug) => {
                    const project = projects.find(
                      (p) => p.id === bug.projectId,
                    );

                    return (
                      <BugCard
                        key={bug.id}
                        bug={bug}
                        project={project}
                        onClick={() => handleBugClick(bug.id)}
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
      </div>
    </main>
  );
}
