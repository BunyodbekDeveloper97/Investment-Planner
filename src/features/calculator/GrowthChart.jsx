import { formatCompactNumber } from '../../lib/formatters.js';

const CHART_WIDTH = 820;
const CHART_HEIGHT = 360;
const PADDING = { top: 26, right: 22, bottom: 48, left: 74 };

function getPoints(data, key, maxValue) {
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const lastIndex = Math.max(data.length - 1, 1);

  return data.map((row, index) => {
    const rawValue = Number(row[key]);
    const value = Number.isFinite(rawValue) ? rawValue : 0;
    const x = PADDING.left + (index / lastIndex) * plotWidth;
    const y = PADDING.top + (1 - value / maxValue) * plotHeight;

    return {
      x,
      y,
      value,
      year: row.year,
    };
  });
}

function pointsToString(points) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
}

function areaPath(points) {
  if (!points.length) return '';

  const baseline = CHART_HEIGHT - PADDING.bottom;
  const first = points[0];
  const last = points.at(-1);

  return [
    `M ${first.x.toFixed(1)} ${baseline}`,
    ...points.map((point) => `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`),
    `L ${last.x.toFixed(1)} ${baseline}`,
    'Z',
  ].join(' ');
}

export default function GrowthChart({ data = [], currency }) {
  const safeData = Array.isArray(data)
    ? data.filter((row) => Number.isFinite(Number(row?.valueEndOfYear)))
    : [];

  const maxDataValue = safeData.reduce((max, row) => {
    const nominal = Number(row.valueEndOfYear) || 0;
    const real = Number(row.inflationAdjustedValue) || 0;
    return Math.max(max, nominal, real);
  }, 0);

  const maxValue = Math.max(maxDataValue * 1.1, 1);
  const nominalPoints = getPoints(safeData, 'valueEndOfYear', maxValue);
  const realPoints = getPoints(safeData, 'inflationAdjustedValue', maxValue);
  const nominalLine = pointsToString(nominalPoints);
  const realLine = pointsToString(realPoints);
  const milestones = safeData.filter(
    (_, index) =>
      index === 0 ||
      index === safeData.length - 1 ||
      (index + 1) % Math.max(Math.ceil(safeData.length / 5), 1) === 0,
  );

  return (
    <section className="card chart-card" aria-labelledby="growth-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Projection</p>
          <h2 id="growth-heading">Portfolio growth over time</h2>
        </div>
        <div className="chart-total">
          {safeData.at(-1)
            ? formatCompactNumber(safeData.at(-1).valueEndOfYear, currency)
            : '—'}
        </div>
      </div>

      {safeData.length === 0 ? (
        <div className="chart-empty" role="status">
          Enter valid investment values to generate the growth chart.
        </div>
      ) : (
        <div className="chart-wrap">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-labelledby="growth-chart-title growth-chart-desc"
          >
            <defs>
              <linearGradient id="nominalFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.24" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            <title id="growth-chart-title">Projected portfolio growth</title>
            <desc id="growth-chart-desc">
              A line chart comparing nominal portfolio value with inflation-adjusted purchasing power.
            </desc>

            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = PADDING.top + (1 - ratio) * (CHART_HEIGHT - PADDING.top - PADDING.bottom);
              return (
                <line
                  key={ratio}
                  x1={PADDING.left}
                  x2={CHART_WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  className="chart-gridline"
                />
              );
            })}

            <path d={areaPath(nominalPoints)} fill="url(#nominalFill)" className="chart-area" />

            <polyline
              points={nominalLine}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chart-line"
            />

            <polyline
              points={realLine}
              fill="none"
              stroke="var(--info)"
              strokeWidth="3"
              strokeDasharray="8 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chart-line"
            />

            {safeData.length <= 30 &&
              nominalPoints.map((point) => (
                <circle
                  key={point.year}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="var(--surface)"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                />
              ))}

            <text
              x={PADDING.left - 12}
              y={PADDING.top + 4}
              textAnchor="end"
              className="chart-label"
            >
              {formatCompactNumber(maxValue, currency)}
            </text>
            <text
              x={PADDING.left - 12}
              y={CHART_HEIGHT - PADDING.bottom + 4}
              textAnchor="end"
              className="chart-label"
            >
              0
            </text>

            {milestones.map((row) => {
              const index = row.year - 1;
              const x = PADDING.left +
                (index / Math.max(safeData.length - 1, 1)) *
                  (CHART_WIDTH - PADDING.left - PADDING.right);

              return (
                <text
                  key={`label-${row.year}`}
                  x={x}
                  y={CHART_HEIGHT - 16}
                  textAnchor="middle"
                  className="chart-label"
                >
                  Y{row.year}
                </text>
              );
            })}
          </svg>
        </div>
      )}

      <div className="chart-legend">
        <span><i className="legend-swatch nominal" /> Nominal value</span>
        <span><i className="legend-swatch real" /> Inflation-adjusted</span>
        <span>Illustrative model, not a forecast</span>
      </div>
    </section>
  );
}
