import { useState } from 'react';
import { formatCurrency, formatDate, formatPercent } from '../lib/formatters.js';

export default function ScenarioManager({ scenarios, onSave, onLoad, onDelete, currentInput, canSave = true }) {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(currentInput.goalName || 'Investment Scenario');

  function submitSave(event) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    onSave(cleanName, currentInput);
    setIsSaving(false);
  }

  function openSaveForm() {
    if (!canSave) return;
    setName(currentInput.goalName?.trim() || 'Investment Scenario');
    setIsSaving(true);
  }

  return (
    <section className="card saved-card" aria-labelledby="saved-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Persistence</p>
          <h2 id="saved-heading">Saved scenarios</h2>
        </div>
        <button type="button" className="primary-button small" onClick={openSaveForm} disabled={!canSave}>+ Save current</button>
      </div>

      {isSaving && (
        <form className="save-form" onSubmit={submitSave}>
          <label htmlFor="scenario-name">Scenario name</label>
          <div className="save-form-row">
            <input id="scenario-name" type="text" value={name} onChange={(event) => setName(event.target.value)} maxLength={60} autoFocus />
            <button type="submit" className="primary-button small">Save</button>
            <button type="button" className="ghost-button small" onClick={() => setIsSaving(false)}>Cancel</button>
          </div>
        </form>
      )}

      {scenarios.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">↗</div>
          <strong>No saved scenarios yet</strong>
          <p>Save a plan to quickly revisit or compare your assumptions later.</p>
        </div>
      ) : (
        <div className="saved-list">
          {scenarios.map((scenario) => (
            <article className="saved-item" key={scenario.id}>
              <div className="saved-copy">
                <strong>{scenario.name}</strong>
                <span>{formatCurrency(scenario.input.goalTarget, scenario.input.currency)} target • {formatPercent(scenario.input.expectedReturn)} return</span>
                <small>Saved {formatDate(scenario.createdAt)}</small>
              </div>
              <div className="saved-actions">
                <button type="button" className="ghost-button small" onClick={() => onLoad(scenario.input)}>Load</button>
                <button type="button" className="icon-button danger" onClick={() => onDelete(scenario.id)} aria-label={`Delete ${scenario.name}`}>×</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
