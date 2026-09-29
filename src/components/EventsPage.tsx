import { useEffect, useMemo, useRef, useState } from "react";
import { fallbackEvents, loadEvents, type Chapter, type EventFilter, type EventRecord } from "../data/events";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const chapters: Chapter[] = ["Lagos", "Ghana", "USA", "London"];
const filters: EventFilter[] = ["All", "Upcoming", "Completed"];

function EventsHero() {
  return (
    <section className="events-page-hero" data-node-id="464:2211" aria-labelledby="events-page-title">
      <img src="/assets/events-page-hero.png" alt="Lens Foundation team members gathered at a community event" />
      <div className="events-page-hero-overlay" aria-hidden="true" />
      <div className="content-wrapper events-page-hero-content">
        <p>~EVENTS~</p>
        <h1 id="events-page-title">We Gather With Purpose</h1>
      </div>
    </section>
  );
}

function EventCard({ event }: { event: EventRecord }) {
  return (
    <a className="event-card" href={event.href} aria-label={`View ${event.title}`}>
      <img className="event-card-image" src={event.image} alt={`${event.title} flyer`} />
      <span className="event-status" data-status={event.status.toLowerCase()}>
        <img src={event.status === "Upcoming" ? "/assets/event-status-upcoming-dot.svg" : "/assets/event-status-completed-dot.svg"} alt="" />
        {event.status}
      </span>
      <div className="event-card-details">
        <p className="event-meta"><img src="/assets/event-calendar.svg" alt="" /><span>{event.date}</span></p>
        <h3 title={event.title}>{event.title}</h3>
        <p className="event-meta"><img src="/assets/event-location.svg" alt="" /><span>{event.location}</span></p>
      </div>
    </a>
  );
}

function ChapterComingSoon() {
  return (
    <div className="events-empty-state" role="status" data-node-id="220:3369">
      <img className="events-empty-icon" src="/assets/event-coming-soon.svg" alt="" />
      <h2>Chapter events are coming soon</h2>
      <p>We’re preparing meaningful gatherings for the community. Check back soon for the first event announcement.</p>
    </div>
  );
}

function FilteredEventsEmpty({ status }: { status: EventFilter }) {
  return (
    <div className="events-empty-state" role="status">
      <img className="events-empty-icon" src="/assets/event-coming-soon.svg" alt="" />
      <h2>{status === "Upcoming" ? "No upcoming events yet" : `No ${status.toLowerCase()} events found`}</h2>
      <p>New community programmes will appear here as soon as they are announced.</p>
    </div>
  );
}

function StatusFilter({ value, onChange }: { value: EventFilter; onChange: (filter: EventFilter) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="events-status-filter" ref={containerRef}>
      <button className="events-status-trigger" type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        <span>{value}</span>
        <img src="/assets/event-filter-chevron-figma.svg" alt="" aria-hidden="true" />
      </button>
      {open && (
        <div className="events-status-menu" role="listbox" aria-label="Filter events by status">
          {filters.map((filter) => (
            <button type="button" role="option" aria-selected={value === filter} key={filter} onClick={() => { onChange(filter); setOpen(false); }}>
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EventsListing() {
  const [chapter, setChapter] = useState<Chapter>("Lagos");
  const [status, setStatus] = useState<EventFilter>("All");
  const [events, setEvents] = useState<EventRecord[]>(fallbackEvents);

  useEffect(() => {
    let active = true;
    void loadEvents().then((records) => { if (active) setEvents(records); });
    return () => { active = false; };
  }, []);

  const visibleEvents = useMemo(
    () => events
      .filter((event) => event.chapter === chapter && (status === "All" || event.status === status))
      .sort((a, b) => b.dateValue.localeCompare(a.dateValue)),
    [chapter, events, status],
  );

  return (
    <section className="events-page-listing" data-node-id="185:419" aria-label="Events listing">
      <div className="content-wrapper events-page-listing-layout">
        <div className="events-page-controls">
          <div className="events-chapter-tabs" role="tablist" aria-label="Event chapters">
            {chapters.map((item) => (
              <button type="button" role="tab" aria-selected={chapter === item} key={item} onClick={() => setChapter(item)}>{item}</button>
            ))}
          </div>
          <StatusFilter value={status} onChange={setStatus} />
        </div>

        {chapter === "Lagos" && visibleEvents.length > 0 ? (
          <div className="events-page-grid" aria-live="polite" aria-label={`${status} Lagos events`}>
            {visibleEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        ) : chapter === "Lagos" ? <FilteredEventsEmpty status={status} /> : <ChapterComingSoon />}
      </div>
    </section>
  );
}

export function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="events-page">
        <EventsHero />
        <EventsListing />
        <FinalCta title="Be Part of the Next Moment That Matters" description="Join us at an upcoming Lens Foundation event, volunteer your time, or help make each community gathering possible." primaryLabel="Volunteer at an Event" primaryHref="/volunteer" secondaryLabel="Support Our Work" secondaryHref="#donate" nodeId="186:1110" />
      </main>
      <Footer />
    </>
  );
}
