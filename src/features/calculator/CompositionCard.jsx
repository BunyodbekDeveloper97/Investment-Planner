import { formatCurrency, formatPercent } from '../../lib/formatters.js';

export default function CompositionCard({ summary, currency }) {
  const finalValue = Number(summary.finalValue);
  const invested = Number(summary.totalInvested);
  const netGrowth = Number(summary.growth);
  const investedShare = finalValue > 0 ? Math.min(Math.max((invested / finalValue) * 100, 0), 100) : 0;
  const growthShare = finalValue > invested && finalValue > 0 ? 100 - investedShare : 0;
  const hasLoss = netGrowth < 0;

  return (
    <section className="card composition-card" aria-labelledby="composition-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Portfolio composition</p>
          <h2 id="composition-heading">Where the final value comes from</h2>
        </div>
      </div>

      {hasLoss ? (
        <div className="composition-warning" role="status">
          Fees and modeled growth result in a value below total invested under the current assumptions.
        </div>
      ) : (
        <div
          className="composition-bar"
          aria-label={`Total invested ${investedShare.toFixed(0)} percent and net growth ${growthShare.toFixed(0)} percent`}
        >
          <div className="composition-invested" style={{ width: `${investedShare}%` }} />
          <div className="composition-growth" style={{ width: `${growthShare}%` }} />
        </div>
      )}

      <div className="composition-grid">
        <div>
          <span><i className="legend-swatch invested" /> Total invested</span>
          <strong>{formatCurrency(invested, currency)}</strong>
          <small>{hasLoss ? 'Capital added' : formatPercent(investedShare)}</small>
        </div>
        <div>
          <span><i className="legend-swatch growth" /> Net growth</span>
          <strong className={hasLoss ? 'negative-value' : ''}>{formatCurrency(netGrowth, currency)}</strong>
          <small>{hasLoss ? 'Below invested amount' : formatPercent(growthShare)}</small>
        </div>
        <div>
          <span>Fees paid</span>
          <strong>{formatCurrency(summary.totalFees, currency)}</strong>
          <small>Modeled cost</small>
        </div>
      </div>
    </section>
  );
}
