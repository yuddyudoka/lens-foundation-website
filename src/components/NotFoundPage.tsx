import { useEffect } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

type NotFoundPageProps = {
  title?: string;
  description?: string;
};

export function NotFoundPage({
  title = "This page wandered off.",
  description = "The page you’re looking for may have moved, changed, or never existed. Let’s get you back to the work that matters.",
}: NotFoundPageProps = {}) {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousDescription = descriptionMeta?.content;
    const previousRobots = robotsMeta?.content;
    const previousCanonical = canonicalLink?.href;

    document.title = "Page not found | The Lens Foundation";
    if (descriptionMeta) descriptionMeta.content = description;
    if (robotsMeta) robotsMeta.content = "noindex, nofollow";
    if (canonicalLink) canonicalLink.href = window.location.href;

    return () => {
      document.title = previousTitle;
      if (descriptionMeta && previousDescription !== undefined) descriptionMeta.content = previousDescription;
      if (robotsMeta && previousRobots !== undefined) robotsMeta.content = previousRobots;
      if (canonicalLink && previousCanonical !== undefined) canonicalLink.href = previousCanonical;
    };
  }, [description]);

  return (
    <>
      <Navbar solid />
      <main className="not-found-page">
        <section className="content-wrapper not-found-layout" aria-labelledby="not-found-title">
          <div className="not-found-copy">
            <h1 id="not-found-title">{title}</h1>
            <p>{description}</p>
            <div className="not-found-actions">
              <a className="button button-primary" href="/">Go to Homepage</a>
              <a className="button button-secondary" href="/events">Explore Events</a>
            </div>
            <p className="not-found-help">Still need help? <a href="/contact">Contact our team</a>.</p>
          </div>

          <div className="not-found-visual" aria-hidden="true">
            <span className="not-found-number">404</span>
            <span className="not-found-logo-ring">
              <img src="/assets/lens-logo-192-v2.webp" width="192" height="192" alt="" />
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
