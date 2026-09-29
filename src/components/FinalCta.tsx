type FinalCtaProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string | null;
  secondaryHref?: string;
  nodeId?: string;
};

export function FinalCta({
  title = "Your Compassion Can Help Change Someone’s Tomorrow",
  description = "Every act of generosity helps us reach more children, families, and communities with the support they need. Join us in turning compassion into meaningful action.",
  primaryLabel = "Make a Donation",
  primaryHref = "#donate",
  secondaryLabel = "Become a Volunteer",
  secondaryHref = "/volunteer",
  nodeId = "139:1807",
}: FinalCtaProps = {}) {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title" data-node-id={nodeId}>
      <img className="final-cta-world" src="/assets/final-cta-world.png" alt="" />

      <div className="final-cta-decoration final-cta-person final-cta-person-one" aria-hidden="true">
        <img src="/assets/final-cta-person-1.png" alt="" />
      </div>
      <img className="final-cta-decoration final-cta-gift" src="/assets/final-cta-gift.svg" alt="" />
      <img className="final-cta-decoration final-cta-giving" src="/assets/final-cta-giving.svg" alt="" />
      <div className="final-cta-decoration final-cta-person final-cta-person-two" aria-hidden="true">
        <img src="/assets/final-cta-person-2.png" alt="" />
      </div>

      <div className="content-wrapper final-cta-layout">
        <div className="final-cta-copy">
          <h2 id="final-cta-title">{title}</h2>
          <p>{description}</p>
        </div>
        <div className="final-cta-actions">
          <a className="button button-primary" href={primaryHref}>{primaryLabel}</a>
          {secondaryLabel && <a className="button button-outline-dark" href={secondaryHref}>{secondaryLabel}</a>}
        </div>
      </div>
    </section>
  );
}
