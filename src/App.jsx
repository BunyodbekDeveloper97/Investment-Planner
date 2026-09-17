import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import AppFooter from './components/AppFooter.jsx';
import ScenarioManager from './components/ScenarioManager.jsx';
import Toast from './components/Toast.jsx';
import MobileNav from './components/MobileNav.jsx';
import InvestmentForm from './features/calculator/InvestmentForm.jsx';
import SummaryCards from './features/calculator/SummaryCards.jsx';
import GrowthChart from './features/calculator/GrowthChart.jsx';
import CompositionCard from './features/calculator/CompositionCard.jsx';
import Breakdown from './features/calculator/Breakdown.jsx';
import GoalProgress from './features/goals/GoalProgress.jsx';
import ScenarioPanel from './features/scenarios/ScenarioPanel.jsx';
import { INITIAL_INPUT } from './features/calculator/calculator.presets.js';
import { getInvestmentSummary, validateInvestmentInput, toFiniteNumber } from './features/calculator/calculator.engine.js';
import { loadScenarios, loadTheme, saveScenarios, saveTheme, createId } from './lib/storage.js';
import { buildShareUrl, exportProjectionCsv, readSharedInput } from './lib/export.js';
import { normalizePersistedInput } from './features/calculator/input.utils.js';

function sanitizeInitialInput(sharedInput) {
  return normalizePersistedInput(sharedInput, INITIAL_INPUT);
}

function App() {
  const [input, setInput] = useState(() => sanitizeInitialInput(readSharedInput()));
  const [scenarios, setScenarios] = useState(loadScenarios);
  const [theme, setTheme] = useState(loadTheme);
  const [toast, setToast] = useState('');
  const toastTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(toastTimerRef.current), []);

  const errors = useMemo(() => validateInvestmentInput(input), [input]);
  const hasErrors = Object.keys(errors).length > 0;
  const summary = useMemo(() => (hasErrors ? null : getInvestmentSummary(input)), [hasErrors, input]);

  function handleChange(field, rawValue) {
    const textFields = ['goalName', 'contributionFrequency', 'currency'];
    setInput((current) => ({
      ...current,
      [field]: textFields.includes(field) ? rawValue : toFiniteNumber(rawValue),
    }));
  }

  function handleLoad(nextInput) {
    setInput(normalizePersistedInput(nextInput, INITIAL_INPUT));
    showToast('Scenario loaded.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleToggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
  }

  function showToast(message) {
    setToast(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(''), 3000);
  }

  function handleSave(name, scenarioInput) {
    const record = {
      id: createId(),
      name: name.trim().slice(0, 60),
      input: normalizePersistedInput(scenarioInput, INITIAL_INPUT),
      createdAt: new Date().toISOString(),
    };
    const next = [record, ...scenarios].slice(0, 12);
    setScenarios(next);
    saveScenarios(next);
    showToast(`Saved “${name}”.`);
  }

  function handleDelete(id) {
    const target = scenarios.find((scenario) => scenario.id === id);
    const next = scenarios.filter((scenario) => scenario.id !== id);
    setScenarios(next);
    saveScenarios(next);
    showToast(target ? `Deleted “${target.name}”.` : 'Scenario deleted.');
  }

  function handleExportCsv() {
    if (hasErrors) return;
    exportProjectionCsv(summary.data, input);
    showToast('CSV export started.');
  }

  async function handleShare() {
    if (hasErrors) return;
    const url = buildShareUrl(input);
    try {
      await navigator.clipboard.writeText(url);
      showToast('Share link copied to clipboard.');
    } catch {
      window.prompt('Copy your share link:', url);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleReset() {
    setInput({ ...INITIAL_INPUT });
    window.location.hash = '';
    showToast('Plan reset to the default example.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const contributionPerYear = input.contributionFrequency === 'monthly' ? input.contributionAmount * 12 : input.contributionAmount;

  return (
    <div className="app-shell" data-theme={theme} id="top">
      <Header theme={theme} onToggleTheme={handleToggleTheme} onPrint={handlePrint} />

      <main className="page-content">
        <section className="hero">
          <div className="hero-copy-wrap">
            <p className="eyebrow">Personal finance planning workspace</p>
            <h1>Turn saving assumptions into a plan you can understand.</h1>
            <p className="hero-copy">Project long-term growth, test return assumptions, see the effect of fees and inflation, and keep reusable scenarios in one place.</p>
            <div className="hero-actions">
              <a href="#planner" className="primary-button hero-button">Build your plan</a>
              <a href="#results" className="text-link">Jump to projection →</a>
            </div>
          </div>

          <div className="hero-panel">
            <span className="hero-panel-label">Current plan</span>
            <strong>{input.goalName || 'Untitled Plan'}</strong>
            <div className="hero-metrics">
              <span><small>Horizon</small><b>{input.duration}y</b></span>
              <span><small>Contribution</small><b>{input.contributionFrequency === 'monthly' ? 'Monthly' : 'Yearly'}</b></span>
              <span><small>Return</small><b>{Number(input.expectedReturn || 0).toFixed(1)}%</b></span>
            </div>
          </div>
        </section>

        <div className="layout-grid">
          <div className="main-column">
            <div id="planner" className="anchor-target" />
            <InvestmentForm input={input} errors={errors} onChange={handleChange} />

            {hasErrors ? (
              <section className="card alert-card" role="alert">
                <div>
                  <strong>Check your assumptions</strong>
                  <p>Correct the highlighted fields to generate a projection.</p>
                </div>
                <span className="alert-icon">!</span>
              </section>
            ) : (
              <>
                <div id="results" className="workspace-toolbar">
                  <div>
                    <span className="workspace-label">Plan actions</span>
                    <small>{input.duration} years • {input.contributionAmount.toLocaleString()} / {input.contributionFrequency === 'monthly' ? 'month' : 'year'} • {contributionPerYear.toLocaleString()} / year</small>
                  </div>
                  <div className="workspace-action-buttons">
                    <button type="button" className="ghost-button small" onClick={handleExportCsv}>Export CSV</button>
                    <button type="button" className="ghost-button small" onClick={handleShare}>Copy share link</button>
                    <button type="button" className="ghost-button small subtle-danger" onClick={handleReset}>Reset</button>
                  </div>
                </div>

                <SummaryCards summary={summary} input={input} />
                <GrowthChart data={summary.data} currency={input.currency} />
                <CompositionCard summary={summary} currency={input.currency} />
                <div id="goal" className="anchor-target" />
                <GoalProgress input={input} summary={summary} onChange={handleChange} />
                <ScenarioPanel input={input} />
                <Breakdown data={summary.data} currency={input.currency} />
              </>
            )}
          </div>

          <aside className="side-column">
            <section className="card side-summary">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Plan snapshot</p>
                  <h2>At a glance</h2>
                </div>
              </div>
              <div className="mini-stat"><span>Goal target</span><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: input.currency, maximumFractionDigits: 0 }).format(Number(input.goalTarget) || 0)}</strong></div>
              <div className="mini-stat"><span>Return assumption</span><strong>{Number(input.expectedReturn || 0).toFixed(1)}%</strong></div>
              <div className="mini-stat"><span>Annual fee</span><strong>{Number(input.annualFee || 0).toFixed(1)}%</strong></div>
              <div className="mini-stat"><span>Inflation</span><strong>{Number(input.inflationRate || 0).toFixed(1)}%</strong></div>
              <div className="mini-stat"><span>Projected value</span><strong>{hasErrors ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: input.currency, maximumFractionDigits: 0 }).format(summary.finalValue)}</strong></div>
              <div className="side-callout"><strong>Tip</strong><br />Try changing the return by just 1–2 percentage points to understand how sensitive long-term results can be.</div>
            </section>

            <div id="saved-scenarios" className="anchor-target" />
            <ScenarioManager canSave={!hasErrors} scenarios={scenarios} currentInput={input} onSave={handleSave} onLoad={handleLoad} onDelete={handleDelete} />

            <section className="card portfolio-notes">
              <p className="eyebrow">What this model does</p>
              <h2>Transparent assumptions</h2>
              <ul>
                <li>Recurring contributions are added at the end of each period.</li>
                <li>Fees reduce the modeled balance after each period’s growth.</li>
                <li>Inflation adjusts reported purchasing power; it does not change the nominal portfolio path.</li>
                <li>The model assumes contributions arrive at the end of each monthly or yearly period.</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>

      <MobileNav />
      <AppFooter />
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}

export default App;
