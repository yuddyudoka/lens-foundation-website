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
    document.title = "Page not found | The Lens Foundation";
    return () => { document.title = previousTitle; };
  }, []);

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
              <img src="/assets/lens-logo.png" alt="" />
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
