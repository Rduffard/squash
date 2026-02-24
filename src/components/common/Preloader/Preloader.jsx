import "./Preloader.css";

export default function Preloader({
  text = "Loading...",
  variant = "fullscreen", // "fullscreen" | "inline"
}) {
  return (
    <div className={`preloader preloader--${variant}`}>
      <div className="circle-preloader" />
      <p className="preloader__text">{text}</p>
    </div>
  );
}
