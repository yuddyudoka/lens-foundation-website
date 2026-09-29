import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fallbackEvents, getLatestEvents, loadEvents, type EventRecord } from "../data/events";

function EventCard({ event }: { event: EventRecord }) {
  return (
    <a className="event-card" href={event.href} aria-label={`View ${event.title}`}>
      <img className="event-card-image" src={event.image} alt={`${event.title} flyer`} />
      <span className="event-status" data-status={event.status.toLowerCase()}>
        <img src={event.status === "Upcoming" ? "/assets/event-status-upcoming-dot.svg" : "/assets/event-status-completed-dot.svg"} alt="" />
        {event.status}
      </span>
      <div className="event-card-details">
        <p className="event-meta">
          <img src="/assets/event-calendar.svg" alt="" />
          <span>{event.date}</span>
        </p>
        <h3 title={event.title}>{event.title}</h3>
        <p className="event-meta">
          <img src="/assets/event-location.svg" alt="" />
          <span>{event.location}</span>
        </p>
      </div>
    </a>
  );
}

export function Events() {
  const railRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<EventRecord[]>(() => getLatestEvents(fallbackEvents));
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const hasCarouselNavigation = events.length > 4;

  useEffect(() => {
    let active = true;
    void loadEvents().then((records) => {
      if (active) setEvents(getLatestEvents(records));
    });
    return () => { active = false; };
  }, []);

  const updateControls = () => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
    setAtStart(rail.scrollLeft <= 2);
    setAtEnd(rail.scrollLeft >= maxScrollLeft - 2);
  };

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const resetToFirstCard = () => {
      rail.scrollLeft = 0;
      updateControls();
    };

    resetToFirstCard();
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      resetToFirstCard();
      secondFrame = window.requestAnimationFrame(resetToFirstCard);
    });
    const observer = new ResizeObserver(updateControls);
    observer.observe(rail);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      observer.disconnect();
    };
  }, [events]);

  const moveRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const firstCard = rail.querySelector<HTMLElement>(".event-card");
    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 20;
    rail.scrollBy({ left: direction * ((firstCard?.offsetWidth ?? 321) + gap), behavior: "smooth" });
  };

  return (
    <section className="events-section" id="events" aria-labelledby="events-title" data-node-id="42:642">
      <div className="content-wrapper events-layout">
        <header className="events-heading-row">
          <div className="events-heading">
            <p>Latest Events</p>
            <h2 id="events-title">Bringing People Together for Greater Impact</h2>
          </div>
          <a className="button button-primary events-view-all events-view-all-desktop" href="/events">
            View all Events
          </a>
        </header>

        <div className="events-rail" ref={railRef} onScroll={updateControls}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="events-controls events-controls-desktop" aria-label="Event carousel controls">
          <button type="button" onClick={() => moveRail(-1)} disabled={!hasCarouselNavigation || atStart} aria-label="Previous events">
            <img className="events-arrow-previous" src="/assets/event-arrow-active.svg" alt="" />
          </button>
          <button type="button" onClick={() => moveRail(1)} disabled={!hasCarouselNavigation || atEnd} aria-label="Next events">
            <img src="/assets/event-arrow-active.svg" alt="" />
          </button>
        </div>

        <div className="events-footer-mobile" aria-label="Event carousel controls">
            <button type="button" onClick={() => moveRail(-1)} disabled={!hasCarouselNavigation || atStart} aria-label="Previous events">
              <img className="events-arrow-previous" src="/assets/event-arrow-active.svg" alt="" />
            </button>
            <a className="button button-primary events-view-all" href="/events">
              View all Events
            </a>
            <button type="button" onClick={() => moveRail(1)} disabled={!hasCarouselNavigation || atEnd} aria-label="Next events">
              <img src="/assets/event-arrow-active.svg" alt="" />
            </button>
        </div>
      </div>
    </section>
  );
}
