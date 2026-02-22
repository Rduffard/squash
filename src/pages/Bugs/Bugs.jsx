// src/pages/Bugs/Bugs.jsx
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Tabs from "../../components/common/Tabs/Tabs.jsx";
import BugFilters from "../../components/squash/BugFilters/BugFilters.jsx";
import Button from "../../components/common/Button/Button.jsx";
import AddBugModal from "../../components/squash/AddBugModal/AddBugModal.jsx";
import "./Bugs.css";

export default function Bugs({ bugs = [], projects = [], addBug }) {
  const navigate = useNavigate();

  const [isAddOpen, setIsAddOpen] = useState(false);

  // Tabs across top
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "open" | "closed"

  // Extra filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  function handleOpenAdd() {
    setIsAddOpen(true);
  }

  function handleCloseAdd() {
    setIsAddOpen(false);
  }

  async function handleSubmitBug(payload) {
    if (typeof addBug !== "function") {
      throw new Error("Bugs page: addBug(payload) is not wired yet.");
    }
    await addBug(payload);
  }

  // Map projectId -> project once
  const projectById = useMemo(
    () =>
      projects.reduce((acc, project) => {
        acc[String(project._id)] = project;
        return acc;
      }, {}),
    [projects],
  );

  // Apply filters
  const filteredBugs = useMemo(() => {
    let result = [...bugs];

    // Tab filter first
    if (activeFilter === "open") {
      result = result.filter(
        (bug) => bug.status !== "resolved" && bug.status !== "closed",
      );
    } else if (activeFilter === "closed") {
      result = result.filter(
        (bug) => bug.status === "resolved" || bug.status === "closed",
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((bug) => bug.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      result = result.filter((bug) => bug.priority === priorityFilter);
    }

    // Search
    const trimmed = searchTerm.trim().toLowerCase();
    if (trimmed) {
      result = result.filter((bug) => {
        const idMatch = String(bug._id).toLowerCase().includes(trimmed);
        const titleMatch = String(bug.title || "")
          .toLowerCase()
          .includes(trimmed);
        return idMatch || titleMatch;
      });
    }

    // Sort newest updated first
    result.sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
    );

    return result;
  }, [bugs, activeFilter, statusFilter, priorityFilter, searchTerm]);

  const formatUpdated = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const priorityIcon = (priority) => {
    switch (priority) {
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
    <section className="bugs">
      {/* Top row: title + tabs */}
      <div className="bugs__header-row">
        <div className="bugs__header-left">
          <h1 className="bugs__title">Defects</h1>
          <p className="bugs__subtitle">
            {bugs.length} total issues across all projects
          </p>
        </div>

        <div className="bugs__header-right">
          <Button onClick={handleOpenAdd}>+ New Bug</Button>

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

      <AddBugModal
        isOpen={isAddOpen}
        onClose={handleCloseAdd}
        onSubmit={handleSubmitBug}
        projects={projects}
      />

      {/* Reusable filter component */}
      <BugFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        searchTerm={searchTerm}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onSearchChange={setSearchTerm}
      />

      {/* Table header + rows */}
      <div className="bugs__table">
        <div className="bugs__row bugs__row--header">
          <div className="bugs__cell bugs__cell--icon" aria-hidden="true" />
          <div className="bugs__cell bugs__cell--id">ID</div>
          <div className="bugs__cell bugs__cell--title">Title</div>
          <div className="bugs__cell bugs__cell--status">Status</div>
          <div className="bugs__cell bugs__cell--severity">Priority</div>
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
            const project = projectById[String(bug.projectId)];

            return (
              <button
                key={bug._id}
                type="button"
                className="bugs__row bugs__row--clickable"
                onClick={() => navigate(`/dashboard/bugs/${bug._id}`)}
              >
                <div className="bugs__cell bugs__cell--icon">
                  <span className="bugs__icon">
                    {priorityIcon(bug.priority)}
                  </span>
                </div>

                <div className="bugs__cell bugs__cell--id">
                  <span className="bugs__id">{String(bug._id)}</span>
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
                    className={`bugs__severity-pill bugs__severity-pill--${bug.priority}`}
                  >
                    {bug.priority}
                  </span>
                </div>

                <div className="bugs__cell bugs__cell--project">
                  <span className="bugs__project-name">
                    {project ? project.name : String(bug.projectId)}
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
  );
}
