import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Header from "../../components/layout/Header/Header.jsx";
import Sidebar from "../../components/layout/Sidebar/Sidebar.jsx";
import Button from "../../components/common/Button/Button.jsx";
import BugCard from "../../components/squash/BugCard/BugCard.jsx";
import Tabs from "../../components/common/Tabs/Tabs.jsx";
import BugFilters from "../../components/squash/BugFilters/BugFilters.jsx";
import "./ProjectView.css";

export default function ProjectView({ projects = [], bugs = [] }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "bugs" | "activity"

  // Filters for the Defects tab
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Project + bugs scoped to this project
  const project = projects.find((p) => p.id === projectId);
  const projectBugs = bugs.filter((bug) => bug.projectId === projectId);

  const openBugs = projectBugs.filter(
    (bug) => bug.status !== "resolved" && bug.status !== "closed"
  );

  // Most recent updates for this project (for Activity tab)
  const recentActivity = [...projectBugs]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  // ----- Overview metrics -----

  const statusCounts = useMemo(() => {
    const counts = {
      new: 0,
      "in-progress": 0,
      blocked: 0,
      resolved: 0,
      closed: 0,
      other: 0,
    };

    projectBugs.forEach((bug) => {
      const key = bug.status;
      if (counts[key] !== undefined) {
        counts[key] += 1;
      } else {
        counts.other += 1;
      }
    });

    return counts;
  }, [projectBugs]);

  const severityCounts = useMemo(() => {
    const counts = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      other: 0,
    };

    projectBugs.forEach((bug) => {
      const key = bug.severity;
      if (counts[key] !== undefined) {
        counts[key] += 1;
      } else {
        counts.other += 1;
      }
    });

    return counts;
  }, [projectBugs]);

  const lastUpdatedBug =
    projectBugs.length > 0
      ? [...projectBugs].sort(
          (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
        )[0]
      : null;

  const lastUpdatedLabel = lastUpdatedBug?.updatedAt
    ? new Date(lastUpdatedBug.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "—";

  // ----- Filters for the Defects tab (applied to projectBugs only) -----

  const filteredProjectBugs = useMemo(() => {
    let result = [...projectBugs];

    if (statusFilter !== "all") {
      result = result.filter((bug) => bug.status === statusFilter);
    }

    if (severityFilter !== "all") {
      result = result.filter((bug) => bug.severity === severityFilter);
    }

    const trimmed = searchTerm.trim().toLowerCase();
    if (trimmed) {
      result = result.filter((bug) => {
        const idMatch = bug.id.toLowerCase().includes(trimmed);
        const titleMatch = bug.title.toLowerCase().includes(trimmed);
        return idMatch || titleMatch;
      });
    }

    result.sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    );

    return result;
  }, [projectBugs, statusFilter, severityFilter, searchTerm]);

  return (
    <main className="project">
      <Header />

      <div className="project__body">
        <Sidebar />

        <section className="project__content">
          {/* NAV ROW: back + tabs */}
          <div className="project__nav-row">
            <Button
              variant="ghost"
              size="sm"
              className="project__back-button"
              onClick={() => navigate("/projects")}
            >
              ← Back to Projects
            </Button>

            {project && (
              <Tabs
                tabs={[
                  { id: "overview", label: "Overview" },
                  { id: "bugs", label: "Defects" },
                  { id: "activity", label: "Activity" },
                ]}
                activeId={activeTab}
                onChange={setActiveTab}
                className="project__tabs"
              />
            )}
          </div>

          {/* Header */}
          <header className="project__header">
            <h1 className="project__title">
              {project ? project.name : `Project ${projectId}`}
            </h1>
            <p className="project__subtitle">
              {project
                ? `ID: ${project.id} • Status: ${project.status}`
                : "This project could not be found."}
            </p>
          </header>

          {!project ? (
            <p className="project__empty">
              No project data available. Check that the ID in the URL matches
              one from your demo data (e.g. <code>PRJ-1</code>,{" "}
              <code>PRJ-2</code>).
            </p>
          ) : (
            <>
              {/* ---------------- OVERVIEW TAB ---------------- */}
              {activeTab === "overview" && (
                <section className="project__grid">
                  {/* Summary card */}
                  <article className="project__card">
                    <h2 className="project__card-title">Summary</h2>

                    <p className="project__card-text project__card-text--muted">
                      {project.description || "No description provided yet."}
                    </p>

                    <dl className="project__stats">
                      <div className="project__stat">
                        <dt className="project__stat-label">Total bugs</dt>
                        <dd className="project__stat-value">
                          {projectBugs.length}
                        </dd>
                      </div>
                      <div className="project__stat">
                        <dt className="project__stat-label">Open bugs</dt>
                        <dd className="project__stat-value project__stat-value--accent">
                          {openBugs.length}
                        </dd>
                      </div>
                      <div className="project__stat">
                        <dt className="project__stat-label">
                          Resolved / closed
                        </dt>
                        <dd className="project__stat-value">
                          {projectBugs.length - openBugs.length}
                        </dd>
                      </div>
                    </dl>
                  </article>

                  {/* Status overview card */}
                  <article className="project__card">
                    <h2 className="project__card-title">Status overview</h2>
                    <p className="project__card-text project__card-text--muted">
                      Current distribution of issues by workflow state.
                    </p>

                    <ul className="project__pill-list">
                      <li className="project__pill-row">
                        <span className="project__pill-label">New</span>
                        <span className="project__pill-value">
                          {statusCounts.new}
                        </span>
                      </li>
                      <li className="project__pill-row">
                        <span className="project__pill-label">In progress</span>
                        <span className="project__pill-value">
                          {statusCounts["in-progress"]}
                        </span>
                      </li>
                      <li className="project__pill-row">
                        <span className="project__pill-label">Blocked</span>
                        <span className="project__pill-value">
                          {statusCounts.blocked}
                        </span>
                      </li>
                      <li className="project__pill-row">
                        <span className="project__pill-label">Resolved</span>
                        <span className="project__pill-value">
                          {statusCounts.resolved}
                        </span>
                      </li>
                      <li className="project__pill-row">
                        <span className="project__pill-label">Closed</span>
                        <span className="project__pill-value">
                          {statusCounts.closed}
                        </span>
                      </li>
                    </ul>
                  </article>

                  {/* Severity & recency card */}
                  <article className="project__card">
                    <h2 className="project__card-title">
                      Risk &amp; recent activity
                    </h2>

                    <p className="project__card-text project__card-text--muted">
                      Quick look at severity mix and the most recent change.
                    </p>

                    <ul className="project__pill-list">
                      <li className="project__pill-row">
                        <span className="project__pill-label">
                          Critical issues
                        </span>
                        <span className="project__pill-value project__pill-value--critical">
                          {severityCounts.critical}
                        </span>
                      </li>
                      <li className="project__pill-row">
                        <span className="project__pill-label">High</span>
                        <span className="project__pill-value project__pill-value--high">
                          {severityCounts.high}
                        </span>
                      </li>
                      <li className="project__pill-row">
                        <span className="project__pill-label">Medium</span>
                        <span className="project__pill-value">
                          {severityCounts.medium}
                        </span>
                      </li>
                      <li className="project__pill-row">
                        <span className="project__pill-label">Low</span>
                        <span className="project__pill-value">
                          {severityCounts.low}
                        </span>
                      </li>
                    </ul>

                    <div className="project__recent">
                      <div className="project__recent-label">
                        Last updated bug
                      </div>
                      {lastUpdatedBug ? (
                        <div className="project__recent-body">
                          <span className="project__recent-id">
                            {lastUpdatedBug.id}
                          </span>
                          <span className="project__recent-title">
                            {lastUpdatedBug.title}
                          </span>
                          <span className="project__recent-date">
                            Updated {lastUpdatedLabel}
                          </span>
                        </div>
                      ) : (
                        <div className="project__recent-body project__recent-body--empty">
                          No activity yet.
                        </div>
                      )}
                    </div>
                  </article>
                </section>
              )}

              {/* ---------------- BUGS / DEFECTS TAB ---------------- */}
              {activeTab === "bugs" && (
                <section className="project__tab-panel">
                  <BugFilters
                    statusFilter={statusFilter}
                    severityFilter={severityFilter}
                    searchTerm={searchTerm}
                    onStatusChange={setStatusFilter}
                    onSeverityChange={setSeverityFilter}
                    onSearchChange={setSearchTerm}
                    className="project__filters"
                  />

                  <article className="project__card project__card--full">
                    <div className="project__card-header-row">
                      <h2 className="project__card-title">Defects</h2>
                      <p className="project__card-meta">
                        {projectBugs.length} total • {openBugs.length} open
                      </p>
                    </div>

                    {filteredProjectBugs.length === 0 ? (
                      <p className="project__card-text">
                        No bugs match these filters for this project yet.
                      </p>
                    ) : (
                      <ul className="project__bug-list">
                        {filteredProjectBugs.map((bug) => (
                          <li key={bug.id} className="project__bug-item">
                            <BugCard
                              bug={bug}
                              project={project}
                              onClick={() => navigate(`/bugs/${bug.id}`)}
                              className="project__bug-card"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </section>
              )}

              {/* ---------------- ACTIVITY TAB ---------------- */}
              {activeTab === "activity" && (
                <section className="project__tab-panel">
                  <article className="project__card project__card--full">
                    <h2 className="project__card-title">Recent Activity</h2>

                    {recentActivity.length === 0 ? (
                      <p className="project__card-text">
                        No recent updates for this project yet.
                      </p>
                    ) : (
                      <ul className="project__activity-list">
                        {recentActivity.map((bug) => (
                          <li key={bug.id} className="project__activity-item">
                            <div className="project__activity-main">
                              <span className="project__activity-bug-id">
                                {bug.id}
                              </span>
                              <span className="project__activity-title">
                                {bug.title}
                              </span>
                            </div>
                            <div className="project__activity-meta">
                              <span className="project__activity-time">
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
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
