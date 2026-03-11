import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button/Button.jsx";
import Tabs from "../../../components/common/Tabs/Tabs.jsx";

export default function ProjectHeader({
  project,
  projectId,
  activeTab,
  onTabChange,
  onNewBug,
  onLinkRepo, // NEW
}) {
  const navigate = useNavigate();

  const hasRepo = Boolean(
    project?.repoFullName && String(project.repoFullName).trim(),
  );

  return (
    <>
      {/* NAV ROW: back + actions + tabs */}
      <div className="project__nav-row">
        <Button
          variant="ghost"
          size="sm"
          className="project__back-button"
          onClick={() => navigate("/dashboard/projects")}
        >
          ← Back to Projects
        </Button>

        {project && (
          <div className="project__actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLinkRepo}
              className="project__link-repo-btn"
            >
              {hasRepo ? "Edit GitHub Repo" : "Link GitHub Repo"}
            </Button>

            <Button onClick={onNewBug} className="project__new-bug-btn">
              + New Bug
            </Button>
          </div>
        )}

        {project && (
          <Tabs
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "bugs", label: "Defects" },
              { id: "activity", label: "Activity" },
            ]}
            activeId={activeTab}
            onChange={onTabChange}
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
          {project ? `ID: ${project._id}` : "This project could not be found."}
        </p>

        {/* Optional small hint row */}
        {project?.repoFullName ? (
          <p className="project__subtitle">
            GitHub: <span>{project.repoFullName}</span>
          </p>
        ) : null}
      </header>
    </>
  );
}
