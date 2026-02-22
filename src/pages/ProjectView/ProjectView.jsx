import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import ProjectHeader from "./components/ProjectHeader.jsx";
import ProjectOverview from "./tabs/ProjectOverview.jsx";
import ProjectDefectsTab from "./tabs/ProjectDefectsTab.jsx";
import ProjectActivityTab from "./tabs/ProjectActivityTab.jsx";

import "./ProjectView.css";

export default function ProjectView({ projects = [], bugs = [] }) {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const project = useMemo(
    () => projects.find((p) => String(p._id) === String(projectId)),
    [projects, projectId],
  );

  const projectBugs = useMemo(
    () => bugs.filter((bug) => String(bug.projectId) === String(projectId)),
    [bugs, projectId],
  );

  return (
    <section className="project">
      <ProjectHeader
        project={project}
        projectId={projectId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {!project ? (
        <p className="project__empty">
          No project data available. Check that the ID in the URL matches one
          from your database.
        </p>
      ) : (
        <>
          {activeTab === "overview" && (
            <ProjectOverview project={project} projectBugs={projectBugs} />
          )}

          {activeTab === "bugs" && (
            <ProjectDefectsTab project={project} projectBugs={projectBugs} />
          )}

          {activeTab === "activity" && (
            <ProjectActivityTab projectBugs={projectBugs} />
          )}
        </>
      )}
    </section>
  );
}
