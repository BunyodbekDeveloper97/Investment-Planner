import { formatCurrency, formatPercent } from '../../lib/formatters.js';
import { calculateInvestmentResults } from '../calculator/calculator.engine.js';

export default function ScenarioPanel({ input }) {
  const base = Number(input.expectedReturn);
  const scenarios = [
    { name: 'Conservative', returnRate: Math.max(base - 2, 0), description: 'Lower return assumption' },
    { name: 'Base case', returnRate: base, description: 'Your current assumption' },
    { name: 'Higher return', returnRate: Math.min(base + 2, 100), description: 'Higher return assumption' },
  ];

  const rows = scenarios.map((scenario) => {
    const data = calculateInvestmentResults({ ...input, expectedReturn: scenario.returnRate });
    return {
      ...scenario,
      finalValue: data.at(-1)?.valueEndOfYear ?? Number(input.initialInvestment),
    };
  });

  const min = Math.min(...rows.map((row) => row.finalValue));
  const max = Math.max(...rows.map((row) => row.finalValue), 1);
  const spread = max - min || 1;

  return (
    <section className="card scenario-card" aria-labelledby="scenario-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Sensitivity</p>
          <h2 id="scenario-heading">Compare return assumptions</h2>
        </div>
        <span className="table-caption">±2 percentage points</span>
      </div>

      <div className="scenario-list">
        {rows.map((row, index) => (
          <div className="scenario-row" key={row.name}>
            <div className="scenario-title">
              <strong>{row.name}</strong>
              <span>{row.description}</span>
            </div>
            <div className="scenario-bar-track">
              <div className={`scenario-bar bar-${index}`} style={{ width: `${Math.max(8, ((row.finalValue - min) / spread) * 92 + 8)}%` }} />
            </div>
            <div className="scenario-result">
              <strong>{formatCurrency(row.finalValue, input.currency)}</strong>
              <span>{formatPercent(row.returnRate)} return</span>
            </div>
          </div>
        ))}
      </div>

      <div className="scenario-footer">
        <span>Scenario range:</span>
        <strong>{formatCurrency(min, input.currency)} → {formatCurrency(max, input.currency)}</strong>
      </div>
      <p className="scenario-note">These cases are sensitivity tests around your assumption. They are not predictions of future market performance.</p>
    </section>
  );
}
