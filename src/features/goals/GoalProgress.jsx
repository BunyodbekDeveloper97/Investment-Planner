import { formatCurrency, formatPercent } from '../../lib/formatters.js';
import { requiredContributionForGoal } from '../calculator/calculator.engine.js';

export default function GoalProgress({ input, summary, onChange }) {
  const target = Number(input.goalTarget);
  const projected = summary.finalValue;
  const progress = Number.isFinite(target) && target > 0 ? Math.min((projected / target) * 100, 100) : 0;
  const gap = Number.isFinite(target) ? target - projected : 0;
  const onTrack = gap <= 0;
  const required = onTrack ? 0 : requiredContributionForGoal(input);
  const frequencyLabel = input.contributionFrequency === 'monthly' ? 'month' : 'year';

  function changeContributionToRequired() {
    if (required === null) return;
    onChange('contributionAmount', required);
  }

  return (
    <section className="card goal-card" aria-labelledby="goal-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Goal planning</p>
          <h2 id="goal-heading">{input.goalName}</h2>
        </div>
        <span className={`status-pill ${onTrack ? 'success' : 'warning'}`}>{onTrack ? 'Target reached' : 'Gap to target'}</span>
      </div>

      <div className="goal-numbers">
        <div><span>Target</span><strong>{formatCurrency(target, input.currency)}</strong></div>
        <div><span>Projected</span><strong>{formatCurrency(projected, input.currency)}</strong></div>
        <div><span>Progress</span><strong>{formatPercent(progress)}</strong></div>
      </div>

      <div className="progress-track" aria-label={`Goal progress ${progress.toFixed(0)} percent`}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="goal-message">
        {onTrack ? (
          <p>Under the assumptions you entered, the model reaches your target within the selected horizon.</p>
        ) : required === null ? (
          <p>The target is outside the model’s supported contribution range. Try a longer horizon or different assumptions.</p>
        ) : (
          <div className="goal-action">
            <div>
              <strong>Suggested contribution</strong>
              <span>{formatCurrency(required, input.currency)} / {frequencyLabel} to reach the target under the current model.</span>
            </div>
            <button type="button" className="ghost-button small" onClick={changeContributionToRequired}>Use this amount</button>
          </div>
        )}
      </div>

      {!onTrack && <p className="goal-gap">Current gap: <strong>{formatCurrency(Math.abs(gap), input.currency)}</strong></p>}
    </section>
  );
}
