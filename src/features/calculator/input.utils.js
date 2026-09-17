const NUMERIC_FIELDS = [
  'initialInvestment',
  'contributionAmount',
  'expectedReturn',
  'duration',
  'annualFee',
  'inflationRate',
  'goalTarget',
];

const FREQUENCIES = new Set(['monthly', 'annual']);
const CURRENCIES = new Set(['USD', 'KRW', 'EUR', 'GBP', 'UZS']);

export function normalizePersistedInput(candidate, fallback) {
  const source = candidate && typeof candidate === 'object' ? candidate : {};
  const next = { ...fallback };

  if (typeof source.goalName === 'string' && source.goalName.trim()) {
    next.goalName = source.goalName.trim().slice(0, 60);
  }

  for (const field of NUMERIC_FIELDS) {
    const value = Number(source[field]);
    if (Number.isFinite(value)) next[field] = value;
  }

  if (FREQUENCIES.has(source.contributionFrequency)) {
    next.contributionFrequency = source.contributionFrequency;
  }

  if (CURRENCIES.has(source.currency)) {
    next.currency = source.currency;
  }

  return next;
}
