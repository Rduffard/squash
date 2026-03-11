import { useMemo, useState } from "react";
import ProjectCard from "../../components/squash/ProjectCard/ProjectCard.jsx";
import AddProjectModal from "../../components/squash/AddProjectModal/AddProjectModal.jsx";
import Button from "../../components/common/Button/Button.jsx";
import "./Projects.css";

export default function Projects({
  projects = [],
  bugs = [],
  addProject,
  loading,
  loadError,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  function handleOpenAdd() {
    setIsAddOpen(true);
  }

  function handleCloseAdd() {
    setIsAddOpen(false);
  }

  async function handleSubmitProject(payload) {
    try {
      await addProject(payload);
      handleCloseAdd();
    } catch (err) {
      alert(err.message);
    }
  }

  const projectsWithStats = useMemo(() => {
    return projects.map((project) => {
      const projectBugs = bugs.filter(
        (bug) => String(bug.projectId) === String(project._id),
      );

      const openBugs = projectBugs.filter(
        (bug) => bug.status !== "resolved" && bug.status !== "closed",
      );

      return {
        ...project,
        totalBugs: projectBugs.length,
        openBugs: openBugs.length,
      };
    });
  }, [projects, bugs]);

  return (
    <section className="projects-page">
      <header className="projects-page__header">
        <div>
          <h1 className="projects-page__title">Projects</h1>
          <p className="projects-page__subtitle">
            Browse your Squash projects and jump into their details.
          </p>

          {loadError && <p className="projects-page__error">{loadError}</p>}

          {loading && <p className="projects-page__loading">Loading…</p>}
        </div>

        <Button onClick={handleOpenAdd}>+ New Project</Button>
      </header>

      <AddProjectModal
        isOpen={isAddOpen}
        onClose={handleCloseAdd}
        onSubmit={handleSubmitProject}
      />

      {!loading && projectsWithStats.length === 0 ? (
        <div className="projects-page__empty-state">
          <p className="projects-page__empty">No projects yet.</p>
          <Button onClick={handleOpenAdd}>+ Create Your First Project</Button>
        </div>
      ) : (
        <ul className="projects-page__list">
          {projectsWithStats.map((project) => (
            <li key={project._id} className="projects-page__item">
              <ProjectCard
                id={project._id}
                name={project.name}
                description={project.description}
                totalBugs={project.totalBugs}
                openBugs={project.openBugs}
                to={`/dashboard/projects/${project._id}`}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
