import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({
  id,
  name,
  description,
  status,
  totalBugs = 0,
  openBugs = 0,
  to,
  className = "",
  ...rest
}) {
  const cardContent = (
    <article className={`project-card ${className}`.trim()} {...rest}>
      <div className="project-card__header">
        <h2 className="project-card__title">{name}</h2>
        {status && (
          <span
            className={`project-card__status project-card__status--${status}`}
          >
            {status}
          </span>
        )}
      </div>

      {description && (
        <p className="project-card__description">{description}</p>
      )}

      <div className="project-card__meta">
        <span>
          <strong>{openBugs}</strong> open bugs
        </span>
        <span>
          <strong>{totalBugs}</strong> total bugs
        </span>
        <span className="project-card__id">ID: {id}</span>
      </div>
    </article>
  );

  // If a `to` prop is provided, wrap the card in a Link so the whole card is clickable.
  if (to) {
    return (
      <Link to={to} className="project-card__link">
        {cardContent}
      </Link>
    );
  }

  // Otherwise it's just a static card
  return cardContent;
}
