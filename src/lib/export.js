export function exportProjectionCsv(data, input) {
  const headers = ['Year', 'Portfolio Value', 'Growth', 'Fees', 'Total Invested', 'Inflation Adjusted Value'];
  const rows = data.map((row) => [
    row.year,
    row.valueEndOfYear.toFixed(2),
    row.interest.toFixed(2),
    row.fees.toFixed(2),
    row.totalInvested.toFixed(2),
    row.inflationAdjustedValue.toFixed(2),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${slugify(input.goalName || 'investment-plan')}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function buildShareUrl(input) {
  const payload = encodeBase64Url(JSON.stringify(input));
  return `${window.location.origin}${window.location.pathname}#plan=${payload}`;
}

export function readSharedInput() {
  try {
    const hash = window.location.hash;
    if (!hash.startsWith('#plan=')) return null;
    return JSON.parse(decodeBase64Url(hash.slice(6)));
  } catch {
    return null;
  }
}

function escapeCsv(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'investment-plan';
}

function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function decodeBase64Url(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
