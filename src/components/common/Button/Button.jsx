import "./Button.css";

export default function Button({
  variant = "primary", // "primary" | "ghost" | "link"
  size = "md", // "sm" | "md"
  className = "",
  children,
  ...rest
}) {
  const classes = ["btn", `btn--${variant}`, `btn--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
