import "./StatusBadge.css";

const LABELS = {
  open: "Open",
  "in-progress": "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase();
  const label = LABELS[normalized] || status;

  return (
    <span className={`status-badge status-badge--${normalized}`}>{label}</span>
  );
}
