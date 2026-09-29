import { getSiteImage } from "../data/cms";

export function VolunteerCta() {
  const image = getSiteImage("home-volunteer-cta");
  return (
    <section className="volunteer-cta" aria-labelledby="volunteer-cta-title" data-node-id="29:564">
      <img className="volunteer-cta-background" src={image.image} alt={image.alt} style={{ objectPosition: `${image.focalPoint.x}% ${image.focalPoint.y}%` }} />
      <div className="volunteer-cta-overlay" aria-hidden="true" />
      <div className="volunteer-cta-layout">
        <div className="volunteer-cta-card">
          <span className="volunteer-cta-sticker">Become a Volunteer</span>
          <div className="volunteer-cta-copy">
            <h2 id="volunteer-cta-title">Be the helping hand your community needs</h2>
            <p>Join The Lens Foundation as a volunteer and use your time &amp; skills to bring support &amp; practical help to people in need</p>
          </div>
          <a className="button volunteer-cta-button" href="/volunteer">Become a Volunteer</a>
        </div>
      </div>
    </section>
  );
}
