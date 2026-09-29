import { getAnnualReports, type AnnualReportRecord } from "../data/cms";

function AnnualReportCard({ report }: { report: AnnualReportRecord }) {
  return (
    <article className="annual-report-card">
      <div className="annual-report-cover" aria-label={`Cover placeholder for the ${report.year} annual report`}>
        <span>THE LENS<br />FOUNDATION</span>
        <strong>{report.year}</strong>
        <img src="/assets/annual-report-pattern.svg" alt="" />
      </div>
      <div className="annual-report-information">
        <div className="annual-report-copy">
          <span className="annual-report-year">{report.year}</span>
          <h3>{report.title}</h3>
          <p>{report.description}</p>
          <small>PDF REPORT&nbsp; • &nbsp;PUBLISHED {report.year}</small>
        </div>
        <a className="button button-primary annual-report-button" href={report.url}>
          View annual report
        </a>
      </div>
    </article>
  );
}

export function AnnualReports() {
  const annualReports = getAnnualReports()
    .filter((report) => report.status === "Published")
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 3);
  return (
    <section className="annual-reports" aria-labelledby="annual-reports-title" data-node-id="339:2110">
      <div className="content-wrapper annual-reports-layout">
        <header className="annual-reports-intro">
          <p>Annual Report</p>
          <h2 id="annual-reports-title">A clear view of<br />our impact</h2>
        </header>
        <div className="annual-reports-list">
          {annualReports.map((report) => (
            <AnnualReportCard key={report.year} report={report} />
          ))}
        </div>
      </div>
    </section>
  );
}
