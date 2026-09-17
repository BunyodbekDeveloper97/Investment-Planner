export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile planner navigation">
      <a href="#planner" className="mobile-nav-link">
        <span aria-hidden="true">✎</span>
        <span>Plan</span>
      </a>
      <a href="#results" className="mobile-nav-link">
        <span aria-hidden="true">↗</span>
        <span>Results</span>
      </a>
      <a href="#goal" className="mobile-nav-link">
        <span aria-hidden="true">◎</span>
        <span>Goal</span>
      </a>
      <a href="#saved-scenarios" className="mobile-nav-link">
        <span aria-hidden="true">▣</span>
        <span>Saved</span>
      </a>
    </nav>
  );
}
