import Header from "../../components/layout/Header/Header.jsx";
import Sidebar from "../../components/layout/Sidebar/Sidebar.jsx";
import ProjectCard from "../../components/squash/ProjectCard/ProjectCard.jsx";
import "./Projects.css";

export default function Projects({ projects = [], bugs = [] }) {
  const projectWithStats = projects.map((project) => {
    const projectBugs = bugs.filter((bug) => bug.projectId === project.id);
    const openBugs = projectBugs.filter(
      (bug) => bug.status !== "resolved" && bug.status !== "closed"
    );

    return {
      ...project,
      totalBugs: projectBugs.length,
      openBugs: openBugs.length,
    };
  });

  return (
    <main className="projects-page">
      <Header />

      <div className="projects-page__body">
        <Sidebar />

        <section className="projects-page__content">
          <header className="projects-page__header">
            <h1 className="projects-page__title">Projects</h1>
            <p className="projects-page__subtitle">
              Browse your Squash projects and jump into their details.
            </p>
          </header>

          {projectWithStats.length === 0 ? (
            <p className="projects-page__empty">
              No projects yet. Add some demo data or connect to your backend.
            </p>
          ) : (
            <ul className="projects-page__list">
              {projectWithStats.map((project) => (
                <li key={project.id} className="projects-page__item">
                  <ProjectCard
                    id={project.id}
                    name={project.name}
                    description={project.description}
                    status={project.status}
                    totalBugs={project.totalBugs}
                    openBugs={project.openBugs}
                    to={`/projects/${project.id}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
