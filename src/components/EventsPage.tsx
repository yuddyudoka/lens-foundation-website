import { useEffect, useMemo, useRef, useState } from "react";
import { getSiteImage } from "../data/cms";
import { fallbackEvents, filterEvents, loadEvents, type ChapterFilter, type EventFilter, type EventRecord } from "../data/events";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const chapters: { value: ChapterFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Lagos", label: "Lagos" },
  { value: "Ghana", label: "Ghana" },
  { value: "London", label: "London" },
  { value: "USA", label: "US" },
];
const filters: EventFilter[] = ["All", "Upcoming", "Completed"];

function EventsHero() {
  const image = getSiteImage("events-hero");
  return (
    <section className="events-page-hero" data-node-id="464:2211" aria-labelledby="events-page-title">
      <img src={image.image} alt={image.alt} style={{ objectPosition: `${image.focalPoint.x}% ${image.focalPoint.y}%` }} />
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
      <img className="event-card-image" src={event.image} alt={`${event.title} flyer`} loading="lazy" style={{ objectPosition: `${event.imageFocalPoint?.x ?? 50}% ${event.imageFocalPoint?.y ?? 50}%` }} />
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
  const [chapter, setChapter] = useState<ChapterFilter>("All");
  const [status, setStatus] = useState<EventFilter>("All");
  const [events, setEvents] = useState<EventRecord[]>(fallbackEvents);

  useEffect(() => {
    let active = true;
    const refreshEvents = () => {
      void loadEvents().then((records) => { if (active) setEvents(records); });
    };
    const handleStorageUpdate = (event: StorageEvent) => {
      if (event.key === "lens-cms-events-v1") refreshEvents();
    };
    const handleCmsUpdate = (event: Event) => {
      if ((event as CustomEvent<string>).detail === "lens-cms-events-v1") refreshEvents();
    };

    refreshEvents();
    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("lens-cms-updated", handleCmsUpdate);

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("lens-cms-updated", handleCmsUpdate);
    };
  }, []);

  const chapterEvents = useMemo(
    () => filterEvents(events, chapter, "All"),
    [chapter, events],
  );

  const visibleEvents = useMemo(
    () => filterEvents(events, chapter, status),
    [chapter, events, status],
  );

  return (
    <section className="events-page-listing" data-node-id="185:419" aria-label="Events listing">
      <div className="content-wrapper events-page-listing-layout">
        <div className="events-page-controls">
          <div className="events-chapter-tabs" role="tablist" aria-label="Event chapters">
            {chapters.map((item) => (
              <button type="button" role="tab" aria-selected={chapter === item.value} key={item.value} onClick={() => setChapter(item.value)}>{item.label}</button>
            ))}
          </div>
          <StatusFilter value={status} onChange={setStatus} />
        </div>

        {visibleEvents.length > 0 ? (
          <div className="events-page-grid" aria-live="polite" aria-label={`${status} ${chapter === "All" ? "all chapters" : chapter} events`}>
            {visibleEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        ) : chapter !== "All" && chapterEvents.length === 0 ? <ChapterComingSoon /> : <FilteredEventsEmpty status={status} />}
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
