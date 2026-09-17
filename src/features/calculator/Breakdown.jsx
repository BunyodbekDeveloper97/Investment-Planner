import { formatCurrency } from '../../lib/formatters.js';

export default function Breakdown({ data, currency }) {
  return (
    <section className="card table-card" aria-labelledby="breakdown-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Year-by-year</p>
          <h2 id="breakdown-heading">Projection breakdown</h2>
        </div>
        <span className="table-caption">Estimated values</span>
      </div>
      <div className="table-scroll desktop-breakdown">
        <table>
          <caption className="sr-only">Investment projection by year</caption>
          <thead>
            <tr>
              <th scope="col">Year</th>
              <th scope="col">Portfolio value</th>
              <th scope="col">Growth</th>
              <th scope="col">Fees</th>
              <th scope="col">Contributions</th>
              <th scope="col">Total invested</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{formatCurrency(row.valueEndOfYear, currency)}</td>
                <td>{formatCurrency(row.interest, currency)}</td>
                <td>{formatCurrency(row.fees, currency)}</td>
                <td>{formatCurrency(row.contributionAmount, currency)}</td>
                <td>{formatCurrency(row.totalInvested, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-breakdown" aria-label="Mobile investment projection by year">
        {data.map((row) => (
          <details className="mobile-year-card" key={`mobile-${row.year}`}>
            <summary>
              <span>Year {row.year}</span>
              <strong>{formatCurrency(row.valueEndOfYear, currency)}</strong>
            </summary>
            <div className="mobile-year-grid">
              <div><span>Growth</span><strong>{formatCurrency(row.interest, currency)}</strong></div>
              <div><span>Fees</span><strong>{formatCurrency(row.fees, currency)}</strong></div>
              <div><span>Contribution</span><strong>{formatCurrency(row.contributionAmount, currency)}</strong></div>
              <div><span>Total invested</span><strong>{formatCurrency(row.totalInvested, currency)}</strong></div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
