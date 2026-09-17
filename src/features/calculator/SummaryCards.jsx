import { formatCurrency, formatPercent } from '../../lib/formatters.js';

function SummaryCard({ label, value, detail, accent = '' }) {
  return (
    <article className={`summary-card ${accent}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}

export default function SummaryCards({ summary, input }) {
  const contributionLabel = input.contributionFrequency === 'monthly' ? 'monthly contribution' : 'annual contribution';
  const growthShare = summary.finalValue > 0 ? Math.max(0, summary.growth / summary.finalValue) * 100 : 0;

  return (
    <section className="summary-grid" aria-label="Projection summary">
      <SummaryCard label="Projected value" value={formatCurrency(summary.finalValue, input.currency)} detail={`After ${input.duration} years`} accent="primary" />
      <SummaryCard label="Total invested" value={formatCurrency(summary.totalInvested, input.currency)} detail={`${formatCurrency(input.contributionAmount, input.currency)} / ${contributionLabel}`} />
      <SummaryCard label="Investment growth" value={formatCurrency(summary.growth, input.currency)} detail={`${formatPercent(growthShare)} of final value`} />
      <SummaryCard label="After inflation" value={formatCurrency(summary.inflationAdjustedValue, input.currency)} detail={`At ${formatPercent(input.inflationRate)} inflation`} accent="muted" />
    </section>
  );
}
