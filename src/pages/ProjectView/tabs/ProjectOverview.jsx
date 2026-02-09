import { useMemo } from "react";

export default function ProjectOverview({ project, projectBugs = [] }) {
  const openBugs = useMemo(() => {
    return projectBugs.filter(
      (bug) => bug.status !== "resolved" && bug.status !== "closed",
    );
  }, [projectBugs]);

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
      if (counts[key] !== undefined) counts[key] += 1;
      else counts.other += 1;
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
      if (counts[key] !== undefined) counts[key] += 1;
      else counts.other += 1;
    });

    return counts;
  }, [projectBugs]);

  const lastUpdatedBug = useMemo(() => {
    if (projectBugs.length === 0) return null;
    return [...projectBugs].sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
    )[0];
  }, [projectBugs]);

  const lastUpdatedLabel = lastUpdatedBug?.updatedAt
    ? new Date(lastUpdatedBug.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
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
            <dd className="project__stat-value">{projectBugs.length}</dd>
          </div>

          <div className="project__stat">
            <dt className="project__stat-label">Open bugs</dt>
            <dd className="project__stat-value project__stat-value--accent">
              {openBugs.length}
            </dd>
          </div>

          <div className="project__stat">
            <dt className="project__stat-label">Resolved / closed</dt>
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
            <span className="project__pill-value">{statusCounts.new}</span>
          </li>
          <li className="project__pill-row">
            <span className="project__pill-label">In progress</span>
            <span className="project__pill-value">
              {statusCounts["in-progress"]}
            </span>
          </li>
          <li className="project__pill-row">
            <span className="project__pill-label">Blocked</span>
            <span className="project__pill-value">{statusCounts.blocked}</span>
          </li>
          <li className="project__pill-row">
            <span className="project__pill-label">Resolved</span>
            <span className="project__pill-value">{statusCounts.resolved}</span>
          </li>
          <li className="project__pill-row">
            <span className="project__pill-label">Closed</span>
            <span className="project__pill-value">{statusCounts.closed}</span>
          </li>
        </ul>
      </article>

      {/* Severity & recency card */}
      <article className="project__card">
        <h2 className="project__card-title">Risk &amp; recent activity</h2>

        <p className="project__card-text project__card-text--muted">
          Quick look at severity mix and the most recent change.
        </p>

        <ul className="project__pill-list">
          <li className="project__pill-row">
            <span className="project__pill-label">Critical issues</span>
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
            <span className="project__pill-value">{severityCounts.medium}</span>
          </li>
          <li className="project__pill-row">
            <span className="project__pill-label">Low</span>
            <span className="project__pill-value">{severityCounts.low}</span>
          </li>
        </ul>

        <div className="project__recent">
          <div className="project__recent-label">Last updated bug</div>

          {lastUpdatedBug ? (
            <div className="project__recent-body">
              <span className="project__recent-id">{lastUpdatedBug.id}</span>
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
  );
}
