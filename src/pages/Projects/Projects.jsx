import ProjectCard from "../../components/squash/ProjectCard/ProjectCard.jsx";
import "./Projects.css";

export default function Projects({ projects = [], bugs = [] }) {
  const projectsWithStats = projects.map((project) => {
    const projectBugs = bugs.filter((bug) => bug.projectId === project.id);
    const openBugs = projectBugs.filter(
      (bug) => bug.status !== "resolved" && bug.status !== "closed",
    );

    return {
      ...project,
      totalBugs: projectBugs.length,
      openBugs: openBugs.length,
    };
  });

  return (
    <section className="projects-page">
      <header className="projects-page__header">
        <h1 className="projects-page__title">Projects</h1>
        <p className="projects-page__subtitle">
          Browse your Squash projects and jump into their details.
        </p>
      </header>

      {projectsWithStats.length === 0 ? (
        <p className="projects-page__empty">
          No projects yet. Add some demo data or connect to your backend.
        </p>
      ) : (
        <ul className="projects-page__list">
          {projectsWithStats.map((project) => (
            <li key={project.id} className="projects-page__item">
              <ProjectCard
                id={project.id}
                name={project.name}
                description={project.description}
                status={project.status}
                totalBugs={project.totalBugs}
                openBugs={project.openBugs}
                // ✅ new nested route
                to={`/dashboard/projects/${project.id}`}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
