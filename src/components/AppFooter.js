export default function AppFooter({ onNavigate }) {
  const go = (view) => (event) => {
    event.preventDefault();
    onNavigate(view);
  };

  return (
    <footer className="app-footer">
      <nav className="footer-links" aria-label="Legal">
        <a href="/terms" onClick={go("terms")}>
          Terms &amp; Conditions
        </a>
        <a href="/privacy" onClick={go("privacy")}>
          Privacy Policy
        </a>
      </nav>

      <p className="footer-credit">
        © 2023-2026 · Made with ❤️ by{" "}
        <a href="https://www.linkedin.com/in/helmy16/" target="_blank" rel="noreferrer">
          Mohamed Abdelmaksoud
        </a>
      </p>

      <p className="footer-support">
        Found this helpful?{" "}
        <a href="https://www.buymeacoffee.com/helmy16" target="_blank" rel="noreferrer">
          Buy me a coffee
        </a>
      </p>
    </footer>
  );
}
