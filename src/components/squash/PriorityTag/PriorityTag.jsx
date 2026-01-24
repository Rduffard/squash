import "./PriorityTag.css";

const LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function PriorityTag({ severity }) {
  if (!severity) return null;

  const normalized = String(severity).toLowerCase();
  const label = LABELS[normalized] || severity;

  return (
    <span className={`priority-tag priority-tag--${normalized}`}>{label}</span>
  );
}
