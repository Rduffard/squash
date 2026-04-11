import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import ProjectHeader from "./components/ProjectHeader.jsx";
import ProjectOverview from "./tabs/ProjectOverview.jsx";
import ProjectDefectsTab from "./tabs/ProjectDefectsTab.jsx";
import ProjectActivityTab from "./tabs/ProjectActivityTab.jsx";

import AddBugModal from "../../components/squash/AddBugModal/AddBugModal.jsx";
import LinkRepoModal from "../../components/squash/LinkRepoModal/LinkRepoModal.jsx";

import { updateProject as apiUpdateProject } from "../../utils/api.js";
import { getRepo, getRepoIssues } from "../../utils/githubApi.js";

import "./ProjectView.css";

export default function ProjectView({
  projects = [],
  bugs = [],
  addBug,
  updateProject, // from App (state patcher)
}) {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const [isAddBugOpen, setIsAddBugOpen] = useState(false);
  const [isLinkRepoOpen, setIsLinkRepoOpen] = useState(false);

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

  // --- GitHub data state ---
  const [ghRepo, setGhRepo] = useState(null);
  const [ghIssues, setGhIssues] = useState([]);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadGitHub() {
      const repoFullName = project?.repoFullName?.trim();

      if (!repoFullName) {
        setGhRepo(null);
        setGhIssues([]);
        setGhLoading(false);
        setGhError("");
        return;
      }

      setGhLoading(true);
      setGhError("");

      try {
        const [repo, issues] = await Promise.all([
          getRepo(repoFullName),
          getRepoIssues(repoFullName, { state: "open", perPage: 10 }),
        ]);

        if (cancelled) return;
        setGhRepo(repo);
        setGhIssues(issues);
      } catch (e) {
        if (cancelled) return;
        setGhRepo(null);
        setGhIssues([]);
        setGhError(e?.message || "Failed to load GitHub data");
      } finally {
        if (!cancelled) {
          setGhLoading(false);
        }
      }
    }

    loadGitHub();

    return () => {
      cancelled = true;
    };
  }, [project?._id, project?.repoFullName]);

  // --- Save repoFullName (Pattern A) ---
  async function handleSaveRepoFullName(repoFullName) {
    // 1) Persist to backend (token comes from localStorage inside utils/api.js)
    const updated = await apiUpdateProject(projectId, { repoFullName });

    // 2) Patch App state (Pattern A)
    if (typeof updateProject === "function") {
      const nextRepo =
        updated?.repoFullName !== undefined
          ? updated.repoFullName
          : repoFullName;

      updateProject(projectId, { repoFullName: nextRepo });
    }
  }

  return (
    <section className="project">
      <ProjectHeader
        project={project}
        projectId={projectId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewBug={handleOpenAddBug}
        onLinkRepo={() => setIsLinkRepoOpen(true)}
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
            projects={projects}
            defaultProjectId={projectId}
          />

          <LinkRepoModal
            isOpen={isLinkRepoOpen}
            onClose={() => setIsLinkRepoOpen(false)}
            initialValue={project.repoFullName || ""}
            onSave={handleSaveRepoFullName}
          />

          {activeTab === "overview" && (
            <ProjectOverview
              project={project}
              projectBugs={projectBugs}
              ghRepo={ghRepo}
              ghIssues={ghIssues}
              ghLoading={ghLoading}
              ghError={ghError}
            />
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
