import { getSiteImage } from "../data/cms";

const avatars = [
  "/assets/impact-avatar-1.png",
  "/assets/impact-avatar-2.png",
  "/assets/impact-avatar-3.png",
];

export function Impact() {
  const communityImage = getSiteImage("home-impact-community");
  const outreachImage = getSiteImage("home-impact-outreach");
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
                <strong>₦10M+</strong>
                <h3>Invested in Community Impact</h3>
                <p>Total investment across LENS projects and programmes since inception.</p>
              </div>
            </article>

            <article className="impact-card impact-card-blue impact-card-centered">
              <img className="impact-pattern impact-pattern-blue-top" src="/assets/impact-pattern-2.svg" alt="" />
              <img className="impact-pattern impact-pattern-blue-bottom" src="/assets/impact-pattern-3.svg" alt="" />
              <div className="impact-metric">
                <strong>300+</strong>
                <h3>Households Reached</h3>
                <p>Verified direct beneficiaries across LENS initiatives.</p>
              </div>
              <div className="impact-avatars" aria-label="Lens Foundation community members">
                {avatars.map((avatar, index) => (
                  <img key={avatar} src={avatar} alt={`Community member ${index + 1}`} />
                ))}
              </div>
            </article>

            <article className="impact-card impact-card-lemon">
              <img className="impact-pattern impact-pattern-lemon" src="/assets/impact-pattern-4.svg" alt="" />
              <strong>5+</strong>
              <div className="impact-card-copy">
                <h3>Children Receiving Ongoing Educational Support</h3>
                <p>Children currently in school with LENS supporting their education through graduation.</p>
              </div>
            </article>

            <figure className="impact-card impact-photo-card">
              <img
                src={communityImage.image}
                alt={communityImage.alt}
                loading="lazy"
                style={{ objectPosition: `${communityImage.focalPoint.x}% ${communityImage.focalPoint.y}%` }}
              />
            </figure>
          </div>

          <article className="impact-feature-card">
            <img src={outreachImage.image} alt={outreachImage.alt} loading="lazy" style={{ objectPosition: `${outreachImage.focalPoint.x}% ${outreachImage.focalPoint.y}%` }} />
            <div className="impact-feature-copy">
              <strong>7+</strong>
              <h3>Individuals Economically Empowered</h3>
              <p>Beneficiaries supported to establish businesses and sustainable sources of income.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
