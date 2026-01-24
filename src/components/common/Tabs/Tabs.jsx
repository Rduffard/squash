import "./Tabs.css";

export default function Tabs({
  tabs = [],
  activeId,
  onChange,
  className = "",
}) {
  return (
    <nav className={`tabs ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;

        return (
          <button
            key={tab.id}
            type="button"
            className={`tabs__tab ${isActive ? "tabs__tab--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
