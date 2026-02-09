import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import ProjectHeader from "./components/ProjectHeader.jsx";
import ProjectOverview from "./tabs/ProjectOverview.jsx";
import ProjectDefectsTab from "./tabs/ProjectDefectsTab.jsx";
import ProjectActivityTab from "./tabs/ProjectActivityTab.jsx";

import "./ProjectView.css";

export default function ProjectView({ projects = [], bugs = [] }) {
  const { projectId } = useParams();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "bugs" | "activity"

  const project = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId],
  );

  const projectBugs = useMemo(
    () => bugs.filter((bug) => bug.projectId === projectId),
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
          from your demo data (e.g. <code>PRJ-1</code>, <code>PRJ-2</code>).
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
