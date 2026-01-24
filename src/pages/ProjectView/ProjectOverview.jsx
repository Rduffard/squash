import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/layout/Header/Header.jsx";
import Sidebar from "../../components/layout/Sidebar/Sidebar.jsx";
import Button from "../../components/common/Button/Button.jsx";
import Tabs from "../../components/common/Tabs/Tabs.jsx";
import ProjectOverviewTab from "./ProjectOverviewTab.jsx";
import ProjectDefectsTab from "./ProjectDefectsTab.jsx";
import ProjectActivityTab from "./ProjectActivityTab.jsx";
import "./ProjectView.css";

export default function ProjectView({ projects = [], bugs = [] }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "bugs" | "activity"

  const project = projects.find((p) => p.id === projectId);
  const projectBugs = bugs.filter((bug) => bug.projectId === projectId);

  return (
    <main className="project">
      <Header />

      <div className="project__body">
        <Sidebar />

        <section className="project__content">
          {/* NAV ROW: back + tabs */}
          <div className="project__nav-row">
            <Button
              variant="ghost"
              size="sm"
              className="project__back-button"
              onClick={() => navigate("/projects")}
            >
              ← Back to Projects
            </Button>

            {project && (
              <Tabs
                tabs={[
                  { id: "overview", label: "Overview" },
                  { id: "bugs", label: "Defects" },
                  { id: "activity", label: "Activity" },
                ]}
                activeId={activeTab}
                onChange={setActiveTab}
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
              {project
                ? `ID: ${project.id} • Status: ${project.status}`
                : "This project could not be found."}
            </p>
          </header>

          {!project ? (
            <p className="project__empty">
              No project data available. Check that the ID in the URL matches
              one from your demo data (e.g. <code>PRJ-1</code>,{" "}
              <code>PRJ-2</code>).
            </p>
          ) : (
            <>
              {activeTab === "overview" && (
                <ProjectOverviewTab
                  project={project}
                  projectBugs={projectBugs}
                />
              )}

              {activeTab === "bugs" && (
                <ProjectDefectsTab
                  project={project}
                  projectBugs={projectBugs}
                />
              )}

              {activeTab === "activity" && (
                <ProjectActivityTab projectBugs={projectBugs} />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
