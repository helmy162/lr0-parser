import { Wordmark } from "./Logo";
import { useTheme } from "../theme";

export default function AppHeader({ onHome }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <a
        className="brand-link"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          onHome();
        }}
        aria-label="LR(0) Parser home"
      >
        <Wordmark size={44} tagline="Build the parser step by step" />
      </a>

      <button
        type="button"
        className="icon-button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {theme === "dark" ? "☀" : "☾"}
      </button>
    </header>
  );
}
