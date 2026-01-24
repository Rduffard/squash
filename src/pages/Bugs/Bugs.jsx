// src/pages/Bugs/Bugs.jsx
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Header from "../../components/layout/Header/Header.jsx";
import Sidebar from "../../components/layout/Sidebar/Sidebar.jsx";
import Tabs from "../../components/common/Tabs/Tabs.jsx";
import BugFilters from "../../components/squash/BugFilters/BugFilters.jsx";
import "./Bugs.css";

export default function Bugs({ bugs = [], projects = [] }) {
  const navigate = useNavigate();

  // Tabs across top
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "open" | "closed"

  // Extra filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Map projectId -> project once
  const projectById = useMemo(
    () =>
      projects.reduce((acc, project) => {
        acc[project.id] = project;
        return acc;
      }, {}),
    [projects]
  );

  // Apply filters
  const filteredBugs = useMemo(() => {
    let result = [...bugs];

    // Tab filter first
    if (activeFilter === "open") {
      result = result.filter(
        (bug) => bug.status !== "resolved" && bug.status !== "closed"
      );
    } else if (activeFilter === "closed") {
      result = result.filter(
        (bug) => bug.status === "resolved" || bug.status === "closed"
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((bug) => bug.status === statusFilter);
    }

    // Severity filter
    if (severityFilter !== "all") {
      result = result.filter((bug) => bug.severity === severityFilter);
    }

    // Search
    const trimmed = searchTerm.trim().toLowerCase();
    if (trimmed) {
      result = result.filter((bug) => {
        const idMatch = bug.id.toLowerCase().includes(trimmed);
        const titleMatch = bug.title.toLowerCase().includes(trimmed);
        return idMatch || titleMatch;
      });
    }

    // Sort newest updated first
    result.sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    );

    return result;
  }, [bugs, activeFilter, statusFilter, severityFilter, searchTerm]);

  const formatUpdated = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const severityIcon = (severity) => {
    switch (severity) {
      case "critical":
        return "🔥";
      case "high":
        return "⚠️";
      case "medium":
        return "🛠️";
      case "low":
        return "🪲";
      default:
        return "•";
    }
  };

  return (
    <main className="bugs">
      <Header />

      <div className="bugs__body">
        <Sidebar />

        <section className="bugs__content">
          {/* Top row: title + tabs */}
          <div className="bugs__header-row">
            <div className="bugs__header-left">
              <h1 className="bugs__title">Defects</h1>
              <p className="bugs__subtitle">
                {bugs.length} total issues across all projects
              </p>
            </div>

            <div className="bugs__header-right">
              <Tabs
                tabs={[
                  { id: "all", label: "All" },
                  { id: "open", label: "Open" },
                  { id: "closed", label: "Resolved / Closed" },
                ]}
                activeId={activeFilter}
                onChange={setActiveFilter}
                className="bugs__tabs"
              />
            </div>
          </div>

          {/* Reusable filter component */}
          <BugFilters
            statusFilter={statusFilter}
            severityFilter={severityFilter}
            searchTerm={searchTerm}
            onStatusChange={setStatusFilter}
            onSeverityChange={setSeverityFilter}
            onSearchChange={setSearchTerm}
          />

          {/* Table header + rows */}
          <div className="bugs__table">
            <div className="bugs__row bugs__row--header">
              <div className="bugs__cell bugs__cell--icon" aria-hidden="true">
                {/* icon col */}
              </div>
              <div className="bugs__cell bugs__cell--id">ID</div>
              <div className="bugs__cell bugs__cell--title">Title</div>
              <div className="bugs__cell bugs__cell--status">Status</div>
              <div className="bugs__cell bugs__cell--severity">Severity</div>
              <div className="bugs__cell bugs__cell--project">Project</div>
              <div className="bugs__cell bugs__cell--updated">Updated</div>
            </div>

            {filteredBugs.length === 0 ? (
              <div className="bugs__empty-row">
                <p className="bugs__empty">
                  No bugs match this filter yet. Try switching views or clearing
                  filters.
                </p>
              </div>
            ) : (
              filteredBugs.map((bug) => {
                const project = projectById[bug.projectId];
                return (
                  <button
                    key={bug.id}
                    type="button"
                    className="bugs__row bugs__row--clickable"
                    onClick={() => navigate(`/bugs/${bug.id}`)}
                  >
                    <div className="bugs__cell bugs__cell--icon">
                      <span className="bugs__icon">
                        {severityIcon(bug.severity)}
                      </span>
                    </div>
                    <div className="bugs__cell bugs__cell--id">
                      <span className="bugs__id">{bug.id}</span>
                    </div>
                    <div className="bugs__cell bugs__cell--title">
                      <span className="bugs__title-text">{bug.title}</span>
                    </div>
                    <div className="bugs__cell bugs__cell--status">
                      <span
                        className={`bugs__status-pill bugs__status-pill--${bug.status}`}
                      >
                        {bug.status}
                      </span>
                    </div>
                    <div className="bugs__cell bugs__cell--severity">
                      <span
                        className={`bugs__severity-pill bugs__severity-pill--${bug.severity}`}
                      >
                        {bug.severity}
                      </span>
                    </div>
                    <div className="bugs__cell bugs__cell--project">
                      <span className="bugs__project-name">
                        {project ? project.name : bug.projectId}
                      </span>
                    </div>
                    <div className="bugs__cell bugs__cell--updated">
                      <span className="bugs__updated-text">
                        {formatUpdated(bug.updatedAt)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
