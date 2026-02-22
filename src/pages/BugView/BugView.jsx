import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import StatusBadge from "../../components/squash/StatusBadge/StatusBadge.jsx";
import PriorityTag from "../../components/squash/PriorityTag/PriorityTag.jsx";
import Button from "../../components/common/Button/Button.jsx";
import Tabs from "../../components/common/Tabs/Tabs.jsx";
import "./BugView.css";

export default function BugView({ bugs = [], projects = [] }) {
  const { bugId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("details"); // "details" | "activity"

  const bug = useMemo(
    () => bugs.find((b) => String(b._id) === String(bugId)),
    [bugs, bugId],
  );

  const project = useMemo(() => {
    if (!bug) return null;
    return (
      projects.find((p) => String(p._id) === String(bug.projectId)) || null
    );
  }, [projects, bug]);

  const createdAt = bug?.createdAt
    ? new Date(bug.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const updatedAt = bug?.updatedAt
    ? new Date(bug.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const displayId = bug ? String(bug._id) : String(bugId);

  return (
    <section className="bug">
      {/* NAV ROW: back + tabs */}
      <div className="bug__nav-row">
        <Button
          variant="ghost"
          size="sm"
          className="bug__back-button"
          onClick={() => navigate("/dashboard/bugs")}
        >
          ← Back to Bugs
        </Button>

        {bug && (
          <Tabs
            tabs={[
              { id: "details", label: "Details" },
              { id: "activity", label: "Activity" },
            ]}
            activeId={activeTab}
            onChange={setActiveTab}
            className="bug__tabs"
          />
        )}
      </div>

      {/* Header */}
      <header className="bug__header">
        <h1 className="bug__title">{bug ? bug.title : `Bug ${bugId}`}</h1>
        <p className="bug__subtitle">
          {bug
            ? `${displayId} • ${project ? project.name : "Unknown project"}`
            : "This bug could not be found."}
        </p>
      </header>

      {!bug ? (
        <p className="bug__empty">
          No bug data available. Check that the ID in the URL matches an
          existing bug.
        </p>
      ) : (
        <>
          {activeTab === "details" && (
            <section className="bug__layout">
              {/* Main details card */}
              <article className="bug__card bug__card--main">
                <h2 className="bug__card-title">Details</h2>

                <p className="bug__card-text">
                  {bug.description?.trim()
                    ? bug.description
                    : "No description provided yet."}
                </p>

                <dl className="bug__details">
                  <div className="bug__detail">
                    <dt className="bug__detail-label">Status</dt>
                    <dd className="bug__detail-value">
                      <StatusBadge status={bug.status} />
                    </dd>
                  </div>

                  <div className="bug__detail">
                    <dt className="bug__detail-label">Priority</dt>
                    <dd className="bug__detail-value">
                      {/* MVP: PriorityTag should accept `priority` (see note below) */}
                      <PriorityTag priority={bug.priority} />
                    </dd>
                  </div>

                  <div className="bug__detail">
                    <dt className="bug__detail-label">Assignee</dt>
                    <dd className="bug__detail-value">
                      {bug.assignee ? String(bug.assignee) : "Unassigned"}
                    </dd>
                  </div>

                  <div className="bug__detail">
                    <dt className="bug__detail-label">Project</dt>
                    <dd className="bug__detail-value">
                      {project ? project.name : String(bug.projectId)}
                    </dd>
                  </div>

                  <div className="bug__detail">
                    <dt className="bug__detail-label">Created</dt>
                    <dd className="bug__detail-value">
                      {createdAt || "Unknown"}
                    </dd>
                  </div>

                  <div className="bug__detail">
                    <dt className="bug__detail-label">Last updated</dt>
                    <dd className="bug__detail-value">
                      {updatedAt || "Unknown"}
                    </dd>
                  </div>
                </dl>
              </article>

              {/* Side column */}
              <aside className="bug__side">
                <article className="bug__card">
                  <h3 className="bug__card-title">Status</h3>
                  <p className="bug__card-text">
                    <StatusBadge status={bug.status} />
                  </p>
                </article>

                <article className="bug__card">
                  <h3 className="bug__card-title">Assignee</h3>
                  <p className="bug__card-text">
                    {bug.assignee ? String(bug.assignee) : "Unassigned"}
                  </p>
                </article>

                <article className="bug__card">
                  <h3 className="bug__card-title">Metadata</h3>
                  <p className="bug__card-text">
                    Project: {project ? project.name : String(bug.projectId)}
                    <br />
                    Priority: <PriorityTag priority={bug.priority} />
                  </p>
                </article>
              </aside>
            </section>
          )}

          {activeTab === "activity" && (
            <section className="bug__activity bug__tab-panel">
              <h2 className="bug__activity-title">Activity</h2>
              <p className="bug__activity-text">
                Comments, history, and status changes for this bug will appear
                here in a future version of Squash.
              </p>
            </section>
          )}
        </>
      )}
    </section>
  );
}
