import { CURRENCY_OPTIONS, GOAL_PRESETS } from './calculator.presets.js';

function Field({ id, label, hint, value, onChange, error, min, max, step = 'any', prefix, suffix }) {
  return (
    <div className="field">
      <div className="field-heading">
        <label htmlFor={id}>{label}</label>
        {hint && <span>{hint}</span>}
      </div>
      <div className={`input-shell ${error ? 'invalid' : ''}`}>
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input
          id={id}
          name={id}
          type="number"
          inputMode="decimal"
          value={Number.isNaN(value) ? '' : value}
          onChange={(event) => onChange(id, event.target.value)}
          min={min}
          max={max}
          step={step}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <small id={`${id}-error`} className="field-error">{error}</small>}
    </div>
  );
}

export default function InvestmentForm({ input, errors, onChange }) {
  const currencySymbol = input.currency === 'KRW' ? '₩' : input.currency === 'EUR' ? '€' : input.currency === 'GBP' ? '£' : input.currency === 'UZS' ? 'soʻm' : '$';

  function applyPreset(preset) {
    onChange('goalName', preset.name);
    onChange('goalTarget', preset.target);
    onChange('duration', preset.duration);
  }

  return (
    <section className="card planner-card" aria-labelledby="planner-heading">
      <div className="section-heading section-heading-wrap">
        <div>
          <p className="eyebrow">Plan your future</p>
          <h2 id="planner-heading">Investment assumptions</h2>
        </div>
        <div className="frequency-switch" role="group" aria-label="Contribution frequency">
          <button type="button" className={input.contributionFrequency === 'monthly' ? 'active' : ''} aria-pressed={input.contributionFrequency === 'monthly'} onClick={() => onChange('contributionFrequency', 'monthly')}>Monthly</button>
          <button type="button" className={input.contributionFrequency === 'annual' ? 'active' : ''} aria-pressed={input.contributionFrequency === 'annual'} onClick={() => onChange('contributionFrequency', 'annual')}>Yearly</button>
        </div>
      </div>

      <div className="preset-row" aria-label="Goal templates">
        <span>Start from a goal:</span>
        {GOAL_PRESETS.map((preset) => (
          <button key={preset.name} type="button" className="chip-button" onClick={() => applyPreset(preset)}>
            {preset.name.replace(' Plan', '')}
          </button>
        ))}
      </div>

      <div className="goal-name-row">
        <div className="field">
          <div className="field-heading">
            <label htmlFor="goalName">Goal name</label>
            <span>Personalize your plan</span>
          </div>
          <input id="goalName" name="goalName" type="text" value={input.goalName} onChange={(event) => onChange('goalName', event.target.value)} maxLength={60} />
        </div>
      </div>

      <div className="form-grid">
        <Field id="initialInvestment" label="Initial investment" hint="Starting balance" value={input.initialInvestment} onChange={onChange} error={errors.initialInvestment} min="0" prefix={currencySymbol} />
        <Field id="contributionAmount" label={input.contributionFrequency === 'monthly' ? 'Monthly contribution' : 'Annual contribution'} hint="Added at period end" value={input.contributionAmount} onChange={onChange} error={errors.contributionAmount} min="0" prefix={currencySymbol} />
        <Field id="expectedReturn" label="Expected return" hint="Annual assumption" value={input.expectedReturn} onChange={onChange} error={errors.expectedReturn} min="0" max="100" step="0.1" suffix="%" />
        <Field id="duration" label="Investment horizon" hint="Years" value={input.duration} onChange={onChange} error={errors.duration} min="1" max="100" step="1" suffix="years" />
        <Field id="annualFee" label="Annual investment fee" hint="Fund / platform fee" value={input.annualFee} onChange={onChange} error={errors.annualFee} min="0" max="20" step="0.1" suffix="%" />
        <Field id="inflationRate" label="Inflation" hint="Purchasing-power estimate" value={input.inflationRate} onChange={onChange} error={errors.inflationRate} min="0" max="50" step="0.1" suffix="%" />
        <Field id="goalTarget" label="Goal target" hint="Amount you want to reach" value={input.goalTarget} onChange={onChange} error={errors.goalTarget} min="1" prefix={currencySymbol} />
        <div className="field">
          <div className="field-heading">
            <label htmlFor="currency">Currency</label>
            <span>Display only</span>
          </div>
          <select id="currency" name="currency" value={input.currency} onChange={(event) => onChange('currency', event.target.value)}>
            {CURRENCY_OPTIONS.map((currency) => <option key={currency.value} value={currency.value}>{currency.label}</option>)}
          </select>
        </div>
      </div>

      <div className="form-note">
        <strong>Model, don’t predict.</strong> Returns, inflation, and fees are assumptions for planning—not guarantees.
      </div>
    </section>
  );
}
