import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import ProjectHeader from "./components/ProjectHeader.jsx";
import ProjectOverview from "./tabs/ProjectOverview.jsx";
import ProjectDefectsTab from "./tabs/ProjectDefectsTab.jsx";
import ProjectActivityTab from "./tabs/ProjectActivityTab.jsx";

import AddBugModal from "../../components/squash/AddBugModal/AddBugModal.jsx";

import "./ProjectView.css";

export default function ProjectView({ projects = [], bugs = [], addBug }) {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const [isAddBugOpen, setIsAddBugOpen] = useState(false);

  const project = useMemo(
    () => projects.find((p) => String(p._id) === String(projectId)),
    [projects, projectId],
  );

  const projectBugs = useMemo(
    () => bugs.filter((bug) => String(bug.projectId) === String(projectId)),
    [bugs, projectId],
  );

  function handleOpenAddBug() {
    setIsAddBugOpen(true);
  }

  function handleCloseAddBug() {
    setIsAddBugOpen(false);
  }

  async function handleSubmitBug(payload) {
    if (typeof addBug !== "function") {
      throw new Error("ProjectView: addBug(payload) is not wired yet.");
    }
    await addBug(payload);
  }

  return (
    <section className="project">
      <ProjectHeader
        project={project}
        projectId={projectId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewBug={handleOpenAddBug}
      />

      {!project ? (
        <p className="project__empty">
          No project data available. Check that the ID in the URL matches one
          from your database.
        </p>
      ) : (
        <>
          <AddBugModal
            isOpen={isAddBugOpen}
            onClose={handleCloseAddBug}
            onSubmit={handleSubmitBug}
            projects={projects} // not used when defaultProjectId exists, but harmless
            defaultProjectId={projectId}
          />

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
