const avatars = [
  "/assets/impact-avatar-1.png",
  "/assets/impact-avatar-2.png",
  "/assets/impact-avatar-3.png",
];

export function Impact() {
  return (
    <section className="impact" aria-labelledby="impact-title" data-node-id="25:563">
      <div className="content-wrapper impact-layout">
        <header className="impact-heading">
          <p className="impact-eyebrow">Our Impact</p>
          <h2 id="impact-title">Real People, Real Support, Real Change That Truly Matters</h2>
        </header>

        <div className="impact-grid">
          <div className="impact-left-grid">
            <article className="impact-card impact-card-dark">
              <div className="impact-handshake" aria-hidden="true">
                <img src="/assets/impact-handshake-1.svg" alt="" />
                <img src="/assets/impact-handshake-2.svg" alt="" />
                <img src="/assets/impact-handshake-3.svg" alt="" />
              </div>
              <img className="impact-pattern impact-pattern-dark" src="/assets/impact-pattern-1.svg" alt="" />
              <div className="impact-card-copy">
                <strong>₦3.45M</strong>
                <h3>Spent on Outreach</h3>
                <p>Bringing practical support directly to people and communities who need it most.</p>
              </div>
            </article>

            <article className="impact-card impact-card-blue impact-card-centered">
              <img className="impact-pattern impact-pattern-blue-top" src="/assets/impact-pattern-2.svg" alt="" />
              <img className="impact-pattern impact-pattern-blue-bottom" src="/assets/impact-pattern-3.svg" alt="" />
              <div className="impact-metric">
                <strong>300+</strong>
                <h3>Households Reached</h3>
              </div>
              <div className="impact-avatars" aria-label="Lens Foundation community members">
                {avatars.map((avatar, index) => (
                  <img key={avatar} src={avatar} alt={`Community member ${index + 1}`} />
                ))}
              </div>
            </article>

            <article className="impact-card impact-card-lemon">
              <img className="impact-pattern impact-pattern-lemon" src="/assets/impact-pattern-4.svg" alt="" />
              <strong>₦1M</strong>
              <div className="impact-card-copy">
                <h3>Food Support Distributed</h3>
                <p>Food support delivered through community outreach.</p>
              </div>
            </article>

            <figure className="impact-card impact-photo-card">
              <img src="/assets/impact-community.jpg" alt="Lens Foundation team members with children in the community" />
            </figure>
          </div>

          <article className="impact-feature-card">
            <img src="/assets/impact-outreach.jpg" alt="Lens Foundation volunteers preparing supplies during an outreach" />
            <div className="impact-feature-copy">
              <strong>₦450K</strong>
              <h3>Direct Street Support</h3>
              <p>Direct support delivered to people and communities through practical street outreach.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
