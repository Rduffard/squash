// src/components/squash/BugFilters/BugFilters.jsx
import "./BugFilters.css";

export default function BugFilters({
  statusFilter,
  priorityFilter,
  searchTerm,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
  className = "",
}) {
  return (
    <div className={`bug-filters ${className}`}>
      <div className="bug-filters__group">
        <label className="bug-filters__label" htmlFor="statusFilter">
          Status
        </label>
        <select
          id="statusFilter"
          className="bug-filters__select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="bug-filters__group">
        <label className="bug-filters__label" htmlFor="priorityFilter">
          Priority
        </label>
        <select
          id="priorityFilter"
          className="bug-filters__select"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="bug-filters__group bug-filters__group--search">
        <label className="bug-filters__label" htmlFor="bugSearch">
          Search
        </label>
        <input
          id="bugSearch"
          className="bug-filters__input"
          type="text"
          placeholder="Search by ID or title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
