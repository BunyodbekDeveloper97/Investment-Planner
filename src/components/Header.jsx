export default function Header({ theme, onToggleTheme, onPrint }) {
  return (
    <header className="app-header">
      <a className="brand" href="#top" aria-label="Investment Planner home">
        <img src="/investment-calculator-logo.png" alt="" />
        <span>
          <strong>Investment Planner</strong>
          <small>Plan • Compare • Understand</small>
        </span>
      </a>

      <div className="header-actions">
        <button type="button" className="ghost-button" onClick={onPrint}>
          Print / Save PDF
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  );
}
