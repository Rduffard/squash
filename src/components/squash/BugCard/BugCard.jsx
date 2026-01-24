// src/components/squash/BugCard/BugCard.jsx
import "./BugCard.css";
import StatusBadge from "../StatusBadge/StatusBadge.jsx";
import PriorityTag from "../PriorityTag/PriorityTag.jsx";

export default function BugCard({
  bug,
  project,
  onClick,
  className = "",
  showProject = true,
  showUpdatedAt = true,
}) {
  if (!bug) return null;

  const updatedAt =
    bug.updatedAt &&
    new Date(bug.updatedAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  const rootClasses = [
    "bug-card",
    onClick ? "bug-card--clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={rootClasses} onClick={onClick}>
      <div className="bug-card__top-row">
        <div className="bug-card__id-title">
          <span className="bug-card__id">{bug.id}</span>
          <span className="bug-card__title">{bug.title}</span>
        </div>
        <div className="bug-card__badges">
          <StatusBadge status={bug.status} />
          <PriorityTag severity={bug.severity} />
        </div>
      </div>

      {(showProject || (showUpdatedAt && updatedAt)) && (
        <div className="bug-card__meta">
          {showProject && (
            <span className="bug-card__project">
              {project ? project.name : bug.projectId}
            </span>
          )}
          {showUpdatedAt && updatedAt && (
            <span className="bug-card__updated">Updated {updatedAt}</span>
          )}
        </div>
      )}
    </article>
  );
}
