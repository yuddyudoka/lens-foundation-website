import { getSiteImage } from "../data/cms";

export function Hero() {
  const image = getSiteImage("home-hero");
  return (
    <section className="hero" aria-labelledby="hero-title" data-node-id="7:136">
      <img
        className="hero-image"
        src={image.image}
        alt={image.alt}
        style={{ objectPosition: `${image.focalPoint.x}% ${image.focalPoint.y}%` }}
      />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="content-wrapper hero-layout">
        <div className="hero-content">
          <div className="hero-copy">
            <h1 id="hero-title">Turning Compassion Into Action, One Life at a Time</h1>
            <p>
              At The Lens Foundation, we turn generosity into practical support for children,
              families, and communities facing real challenges
            </p>
          </div>

          <div className="hero-actions">
            <a className="button button-primary" href="#donate">
              Donate to Lens Foundation
            </a>
            <a className="button button-secondary" href="/volunteer">
              Become a Volunteer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
