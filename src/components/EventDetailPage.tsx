import { useEffect, useState } from "react";
import { fallbackEvents, getEventDetails, loadEvents, type EventRecord } from "../data/events";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { NotFoundPage } from "./NotFoundPage";

function EventNotFound() {
  return <NotFoundPage title="This event could not be found." description="The event may have moved or is no longer available. Explore our current events and completed community projects instead." />;
}

export function EventDetailPage({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<EventRecord | undefined>(() => fallbackEvents.find((item) => item.id === eventId));

  useEffect(() => {
    let active = true;
    void loadEvents().then((records) => {
      if (active) setEvent(records.find((item) => item.id === eventId));
    });
    return () => { active = false; };
  }, [eventId]);

  useEffect(() => {
    if (!event) return;

    const details = getEventDetails(event);
    const canonicalUrl = `https://thelensfoundation.org/events/${encodeURIComponent(event.id)}`;
    const title = `${event.title} | The Lens Foundation`;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const socialTags = [
      document.querySelector<HTMLMetaElement>('meta[property="og:title"]'),
      document.querySelector<HTMLMetaElement>('meta[property="og:description"]'),
      document.querySelector<HTMLMetaElement>('meta[property="og:url"]'),
      document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]'),
      document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]'),
    ];
    const previousTitle = document.title;
    const previousDescription = descriptionMeta?.content;
    const previousCanonical = canonicalLink?.href;
    const previousSocialValues = socialTags.map((tag) => tag?.content);

    document.title = title;
    if (descriptionMeta) descriptionMeta.content = details.summary;
    if (canonicalLink) canonicalLink.href = canonicalUrl;
    if (socialTags[0]) socialTags[0].content = title;
    if (socialTags[1]) socialTags[1].content = details.summary;
    if (socialTags[2]) socialTags[2].content = canonicalUrl;
    if (socialTags[3]) socialTags[3].content = title;
    if (socialTags[4]) socialTags[4].content = details.summary;

    return () => {
      document.title = previousTitle;
      if (descriptionMeta && previousDescription !== undefined) descriptionMeta.content = previousDescription;
      if (canonicalLink && previousCanonical !== undefined) canonicalLink.href = previousCanonical;
      socialTags.forEach((tag, index) => {
        const value = previousSocialValues[index];
        if (tag && value !== undefined) tag.content = value;
      });
    };
  }, [event]);

  if (!event) return <EventNotFound />;

  const details = getEventDetails(event);
  const dateLabel = event.status === "Completed" ? `Held: ${event.date}` : `Next outreach: ${event.date}`;

  return (
    <>
      <Navbar solid />
      <main className="event-detail-page" data-node-id="196:1012">
        <div className="content-wrapper event-detail-layout">
          <nav className="event-detail-breadcrumb" aria-label="Breadcrumb">
            <a href="/events">Events</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{event.title}</span>
          </nav>

          <header className="event-detail-header">
            <h1>{event.title}</h1>
            <p>{details.summary}</p>
          </header>

          <div className="event-detail-content">
            <article className="event-detail-article">
              <div className="event-detail-media">
                <img
                  className="event-detail-feature-image"
                  src={details.image ?? event.image}
                  alt={`${event.title} flyer`}
                  style={{ objectPosition: `${event.imageFocalPoint?.x ?? 50}% ${event.imageFocalPoint?.y ?? 50}%` }}
                />
              </div>

              <div className="event-detail-body">
                <div className="event-detail-metadata">
                  <p><img src="/assets/event-detail-location.svg" alt="" /><span>{event.location}</span></p>
                  <p><img src="/assets/event-detail-calendar.svg" alt="" /><span>{dateLabel}</span></p>
                </div>

                <section>
                  <h2>Overview</h2>
                  <p>{details.overview}</p>
                </section>

                <section>
                  <h2>{event.status === "Completed" ? "What We Delivered" : "What to Expect"}</h2>
                  <ul className="event-detail-expectations">
                    {details.expectations.map((expectation) => (
                      <li key={expectation}>
                        <img src="/assets/event-detail-bullet.svg" alt="" />
                        <span>{expectation}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2>{event.status === "Completed" ? "Why It Mattered" : "Why Attend?"}</h2>
                  <p>{details.whyAttend}</p>
                </section>
              </div>
            </article>

            <aside className="event-detail-donation-card">
              <h2>Support meaningful change</h2>
              <p>Your generosity helps us continue supporting children and communities through meaningful programmes and essential assistance.</p>
              <a className="button button-primary" href="/#donate">Make a Donation</a>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
