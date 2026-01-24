import { useMemo } from "react";

export default function ProjectActivityTab({ projectBugs = [] }) {
  const recentActivity = useMemo(
    () =>
      [...projectBugs]
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
        .slice(0, 5),
    [projectBugs]
  );

  return (
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
                  <span className="project__activity-bug-id">{bug.id}</span>
                  <span className="project__activity-title">{bug.title}</span>
                </div>
                <div className="project__activity-meta">
                  <span className="project__activity-time">
                    Updated{" "}
                    {new Date(bug.updatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
