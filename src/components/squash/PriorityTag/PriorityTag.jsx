import "./PriorityTag.css";

const LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export default function PriorityTag({ priority, severity }) {
  // Support both props temporarily for safety
  const value = priority ?? severity;
  if (!value) return null;

  const normalized = String(value).toLowerCase();
  const label = LABELS[normalized] || normalized;

  return (
    <span className={`priority-tag priority-tag--${normalized}`}>{label}</span>
  );
}
