import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BugFilters from "../../components/squash/BugFilters/BugFilters.jsx";
import BugCard from "../../components/squash/BugCard/BugCard.jsx";

export default function ProjectDefectsTab({ project, projectBugs = [] }) {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const openBugs = useMemo(
    () =>
      projectBugs.filter(
        (bug) => bug.status !== "resolved" && bug.status !== "closed"
      ),
    [projectBugs]
  );

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
  );
}
