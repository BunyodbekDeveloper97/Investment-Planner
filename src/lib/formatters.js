export function getCurrencyFormatter(currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatCurrency(value, currency = 'USD') {
  const number = Number(value);
  return getCurrencyFormatter(currency).format(Number.isFinite(number) ? number : 0);
}

export function formatPercent(value, digits = 1) {
  const number = Number(value);
  return `${Number.isFinite(number) ? number.toFixed(digits) : '0.0'}%`;
}

export function formatCompactNumber(value, currency = 'USD') {
  const number = Number(value);
  if (!Number.isFinite(number)) return formatCurrency(0, currency);
  const abs = Math.abs(number);
  if (abs < 1000) return formatCurrency(number, currency);

  const suffix = abs >= 1_000_000_000 ? 'B' : abs >= 1_000_000 ? 'M' : 'K';
  const divisor = suffix === 'B' ? 1_000_000_000 : suffix === 'M' ? 1_000_000 : 1_000;
  const symbol = getCurrencyFormatter(currency).formatToParts(0).find((part) => part.type === 'currency')?.value ?? currency;
  return `${number < 0 ? '-' : ''}${symbol}${(abs / divisor).toFixed(1)}${suffix}`;
}

export function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}
