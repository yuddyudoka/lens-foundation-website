import { getSiteImage } from "../data/cms";

export function Hero() {
  const image = getSiteImage("home-hero");
  const usesBundledHero = image.image === "/assets/hero-team-1-v1.webp";
  return (
    <section className="hero" aria-labelledby="hero-title" data-node-id="7:136">
      <img
        className="hero-image"
        src={image.image}
        srcSet={usesBundledHero ? "/assets/hero-team-1-768-v2.webp 768w, /assets/hero-team-1-1280-v2.webp 1280w, /assets/hero-team-1-v1.webp 1600w" : undefined}
        sizes="100vw"
        alt={image.alt}
        width="1600"
        height="1200"
        fetchPriority="high"
        decoding="async"
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
