import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowSquareOut,
  CalendarDots,
  CaretDown,
  CaretUp,
  Check,
  FileText,
  House,
  ImageSquare,
  List,
  MagnifyingGlass,
  Plus,
  Question,
  Quotes,
  Sparkle,
  SignOut,
  UploadSimple,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { fallbackEvents, getEventDetails, loadEvents, type EventRecord, type EventStatus } from "../data/events";
import {
  getAnnualReports,
  getFaqs,
  getTestimonials,
  getSiteImages,
  getTeamMembers,
  saveAnnualReports,
  saveFaqs,
  saveLocalEvents,
  saveTestimonials,
  saveSiteImages,
  saveTeamMembers,
  type AnnualReportRecord,
  type FaqRecord,
  type TestimonialRecord,
  type FocalPoint,
  type SiteImageRecord,
  type SiteImagePage,
  type TeamMemberRecord,
} from "../data/cms";

type Section = "overview" | "events" | "reports" | "testimonials" | "team" | "media" | "faqs" | "podium-faqs";
type Editor =
  | { kind: "event"; item: EventRecord }
  | { kind: "report"; item: AnnualReportRecord }
  | { kind: "testimonial"; item: TestimonialRecord }
  | { kind: "team"; item: TeamMemberRecord }
  | { kind: "faq"; item: FaqRecord }
  | null;

const navItems: { id: Section; label: string; icon: typeof House }[] = [
  { id: "overview", label: "Overview", icon: House },
  { id: "events", label: "Events", icon: CalendarDots },
  { id: "reports", label: "Annual reports", icon: FileText },
  { id: "testimonials", label: "Testimonials", icon: Quotes },
  { id: "team", label: "Team", icon: UsersThree },
  { id: "media", label: "Page images", icon: ImageSquare },
  { id: "faqs", label: "FAQs", icon: Question },
  { id: "podium-faqs", label: "Podium FAQs", icon: Question },
];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function displayDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const day = date.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${date.toLocaleDateString("en-GB", { weekday: "short" })}, ${day}${suffix} ${date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`;
}

function blankEvent(): EventRecord {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: "",
    title: "",
    date: displayDate(today),
    dateValue: today,
    createdAt: new Date().toISOString(),
    location: "",
    status: "Upcoming",
    chapter: "Lagos",
    image: "",
    imageFocalPoint: { x: 50, y: 50 },
    href: "",
    details: { summary: "", overview: "", expectations: [""], whyAttend: "" },
  };
}

const blankReport = (): AnnualReportRecord => ({ id: "", year: String(new Date().getFullYear()), title: "", description: "", url: "", status: "Draft" });
const blankTestimonial = (): TestimonialRecord => ({ id: "", quote: "", name: "", role: "", image: "", focalPoint: { x: 50, y: 50 }, status: "Draft" });
const blankFaq = (page: FaqRecord["page"]): FaqRecord => ({ id: "", page, question: "", answer: "", status: "Draft" });

export function AdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const [section, setSection] = useState<Section>("overview");
  const [events, setEvents] = useState<EventRecord[]>(fallbackEvents);
  const [reports, setReports] = useState(getAnnualReports);
  const [testimonials, setTestimonials] = useState(getTestimonials);
  const [teamMembers, setTeamMembers] = useState(getTeamMembers);
  const [siteImages, setSiteImages] = useState(getSiteImages);
  const [faqs, setFaqs] = useState(getFaqs);
  const [query, setQuery] = useState("");
  const [eventFilter, setEventFilter] = useState<"All" | EventStatus>("All");
  const [editor, setEditor] = useState<Editor>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { void loadEvents().then(setEvents); }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const handleSaveError = () => setNotice("The browser copy was saved, but Cloudflare KV could not be updated. Please try again.");
    window.addEventListener("lens-cms-save-error", handleSaveError);
    return () => window.removeEventListener("lens-cms-save-error", handleSaveError);
  }, []);

  const counts = { events: events.length, reports: reports.length, testimonials: testimonials.length, team: teamMembers.length, media: siteImages.length, faqs: faqs.filter((faq) => faq.page === "Home").length, "podium-faqs": faqs.filter((faq) => faq.page === "Lens Podium").length };
  const publishedCount = reports.filter((item) => item.status === "Published").length + testimonials.filter((item) => item.status === "Published").length + faqs.filter((item) => item.status === "Published").length + events.length;
  const upcomingCount = events.filter((item) => item.status === "Upcoming").length;
  const q = query.trim().toLowerCase();

  const filteredEvents = useMemo(() => events
    .filter((item) => eventFilter === "All" || item.status === eventFilter)
    .filter((item) => !q || `${item.title} ${item.location} ${item.chapter}`.toLowerCase().includes(q))
    .sort((a, b) => Date.parse(b.dateValue) - Date.parse(a.dateValue)), [events, eventFilter, q]);

  function showSection(next: Section) {
    setSection(next);
    setQuery("");
    setMenuOpen(false);
  }

  function persistEvents(next: EventRecord[]) { setEvents(next); saveLocalEvents(next); setNotice("Events updated on the website."); }
  function persistReports(next: AnnualReportRecord[]) { const normalized = saveAnnualReports(next); setReports(normalized); setNotice("Annual reports updated. Only the three newest published years appear on the homepage."); }
  function persistTestimonials(next: TestimonialRecord[]) { setTestimonials(next); saveTestimonials(next); setNotice("Testimonials updated on the website."); }
  function persistTeam(next: TeamMemberRecord[]) { setTeamMembers(next); saveTeamMembers(next); setNotice("Team section updated on the website."); }
  function moveTeamMember(id: string, direction: -1 | 1) {
    const index = teamMembers.findIndex((member) => member.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= teamMembers.length) return;
    const next = [...teamMembers];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    persistTeam(next);
  }
  function persistSiteImages(next: SiteImageRecord[]) { setSiteImages(next); saveSiteImages(next); setNotice("Page imagery updated on the website."); }
  function persistFaqs(next: FaqRecord[]) { setFaqs(next); saveFaqs(next); setNotice("FAQs updated on the website."); }

  function deleteItem(kind: Exclude<Editor, null>["kind"], id: string) {
    if (!window.confirm("Delete this item? This change will be reflected on the website.")) return;
    if (kind === "event") persistEvents(events.filter((item) => item.id !== id));
    if (kind === "report") persistReports(reports.filter((item) => item.id !== id));
    if (kind === "testimonial") persistTestimonials(testimonials.filter((item) => item.id !== id));
    if (kind === "faq") persistFaqs(faqs.filter((item) => item.id !== id));
  }

  function renderOverview() {
    const recentEvents = [...events].sort((a, b) => Date.parse(b.dateValue) - Date.parse(a.dateValue)).slice(0, 4);
    return (
      <>
        <div className="admin-page-heading">
          <div><p>Content overview</p><h1>Good day, Lens team</h1><span>Manage what visitors see across the Lens Foundation website.</span></div>
          <button className="admin-primary-action" onClick={() => setEditor({ kind: "event", item: blankEvent() })}><Plus size={19} weight="bold" /> Add event</button>
        </div>
        <div className="admin-metric-grid">
          <article><span>Published content</span><strong>{publishedCount}</strong><small>Across four collections</small></article>
          <article><span>Total events</span><strong>{events.length}</strong><small>{upcomingCount} upcoming</small></article>
          <article><span>Annual reports</span><strong>{reports.length}</strong><small>{reports.filter((item) => item.status === "Draft").length} drafts</small></article>
          <article><span>Community stories</span><strong>{testimonials.length}</strong><small>Testimonials on homepage</small></article>
        </div>
        <div className="admin-overview-grid">
          <section className="admin-panel">
            <div className="admin-panel-heading"><div><p>Recent events</p><span>Newest activity in the events collection</span></div><button onClick={() => showSection("events")}>Manage all</button></div>
            <div className="admin-recent-list">
              {recentEvents.map((event) => <button key={event.id} onClick={() => setEditor({ kind: "event", item: { ...event, details: getEventDetails(event) } })}><img src={event.image} alt="" /><span><strong>{event.title}</strong><small>{event.date} · {event.chapter}</small></span><em className={`admin-status ${event.status.toLowerCase()}`}>{event.status}</em></button>)}
            </div>
          </section>
          <aside className="admin-panel admin-quick-panel">
            <div className="admin-panel-heading"><div><p>Quick actions</p><span>Create or review content</span></div></div>
            <button onClick={() => setEditor({ kind: "event", item: blankEvent() })}><CalendarDots size={22} /><span><strong>Create an event</strong><small>Add details, image and status</small></span></button>
            <button onClick={() => setEditor({ kind: "report", item: blankReport() })}><FileText size={22} /><span><strong>Add annual report</strong><small>Publish a new report link</small></span></button>
            <button onClick={() => setEditor({ kind: "testimonial", item: blankTestimonial() })}><Quotes size={22} /><span><strong>Add a testimonial</strong><small>Share a community story</small></span></button>
          </aside>
        </div>
      </>
    );
  }

  function renderEvents() {
    return (
      <>
        <CollectionHeading eyebrow="Events collection" title="Events" description="Create, update and organise event content shown on the homepage and events page." action="Add event" onAction={() => setEditor({ kind: "event", item: blankEvent() })} />
        <div className="admin-toolbar">
          <SearchBox query={query} setQuery={setQuery} label="Search events" />
          <label className="admin-select"><span className="sr-only">Filter by status</span><select value={eventFilter} onChange={(event) => setEventFilter(event.target.value as typeof eventFilter)}><option>All</option><option>Upcoming</option><option>Completed</option></select><CaretDown size={16} weight="bold" /></label>
        </div>
        <div className="admin-panel admin-table-panel">
          <div className="admin-table admin-event-table">
            <div className="admin-table-head"><span>Event</span><span>Date</span><span>Chapter</span><span>Status</span><span>Actions</span></div>
            {filteredEvents.map((event) => <div className="admin-table-row" key={event.id}>
              <div className="admin-record-primary"><img src={event.image} alt="" /><span><strong>{event.title}</strong><small>{event.location}</small></span></div>
              <span data-label="Date">{event.date}</span><span data-label="Chapter">{event.chapter}</span><span data-label="Status"><em className={`admin-status ${event.status.toLowerCase()}`}>{event.status}</em></span>
              <div className="admin-row-actions"><button onClick={() => setEditor({ kind: "event", item: { ...event, details: getEventDetails(event) } })}>Edit</button><a href={event.href} target="_blank" rel="noreferrer">View</a><button className="danger" onClick={() => deleteItem("event", event.id)}>Delete</button></div>
            </div>)}
          </div>
          {filteredEvents.length === 0 && <EmptyState title="No events found" description="Try a different search or add a new event." />}
        </div>
      </>
    );
  }

  function renderReports() {
    const items = reports.filter((item) => !q || `${item.year} ${item.title}`.toLowerCase().includes(q));
    return <><CollectionHeading eyebrow="Reports collection" title="Annual reports" description="Manage the reports and publication links displayed on the homepage." action="Add report" onAction={() => setEditor({ kind: "report", item: blankReport() })} /><div className="admin-toolbar"><SearchBox query={query} setQuery={setQuery} label="Search reports" /></div><div className="admin-card-grid">{items.map((item) => <ContentCard key={item.id} title={item.title} meta={`${item.year} annual report`} status={item.status} href={item.url} onEdit={() => setEditor({ kind: "report", item })} onDelete={() => deleteItem("report", item.id)} />)}</div></>;
  }

  function renderTestimonials() {
    const items = testimonials.filter((item) => !q || `${item.name} ${item.role} ${item.quote}`.toLowerCase().includes(q));
    return <><CollectionHeading eyebrow="Stories collection" title="Testimonials" description="Review the community stories that appear in the homepage carousel." action="Add testimonial" onAction={() => setEditor({ kind: "testimonial", item: blankTestimonial() })} /><div className="admin-toolbar"><SearchBox query={query} setQuery={setQuery} label="Search testimonials" /></div><div className="admin-card-grid">{items.map((item) => <article className="admin-content-card" key={item.id}><div className="admin-content-card-person"><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>{item.role}</small></span><em className={`admin-status ${item.status.toLowerCase()}`}>{item.status}</em></div><p>“{item.quote}”</p><div><button onClick={() => setEditor({ kind: "testimonial", item })}>Edit</button><button className="danger" onClick={() => deleteItem("testimonial", item.id)}>Delete</button></div></article>)}</div></>;
  }

  function renderTeam() {
    const items = teamMembers.filter((item) => !q || `${item.name} ${item.role}`.toLowerCase().includes(q));
    return <><CollectionHeading eyebrow="About Us collection" title="Team" description="Manage and reorder the six profiles shown in the draggable About Us carousel." action="View About Us" onAction={() => window.open("/about#about-team-title", "_blank", "noopener,noreferrer")} /><div className="admin-toolbar"><SearchBox query={query} setQuery={setQuery} label="Search team members" /></div><div className="admin-card-grid admin-team-card-grid">{items.map((item) => { const position = teamMembers.findIndex((member) => member.id === item.id); return <article className="admin-content-card admin-team-card" key={item.id}><div className="admin-team-card-person">{item.image ? <img src={item.image} alt="" style={{ objectPosition: `${item.focalPoint.x}% ${item.focalPoint.y}%` }} /> : <span className="admin-team-placeholder">LF</span>}<div><strong>{item.name}</strong><small>{item.role}</small><span className="admin-team-position">Position {position + 1}</span></div></div><div className="admin-team-actions"><button onClick={() => setEditor({ kind: "team", item })}>Edit profile</button><span className="admin-team-order" aria-label={`Reorder ${item.name}`}><button type="button" onClick={() => moveTeamMember(item.id, -1)} disabled={position === 0} aria-label={`Move ${item.name} earlier`}><CaretUp size={17} weight="bold" /></button><button type="button" onClick={() => moveTeamMember(item.id, 1)} disabled={position === teamMembers.length - 1} aria-label={`Move ${item.name} later`}><CaretDown size={17} weight="bold" /></button></span></div></article>; })}</div></>;
  }

  function renderMedia() {
    const pages: SiteImagePage[] = ["Home", "About Us", "Events", "Lens Podium", "Volunteer", "Partner", "Contact Us"];
    const updateImage = (id: string, patch: Partial<SiteImageRecord>) => {
      persistSiteImages(siteImages.map((record) => record.id === id ? { ...record, ...patch } : record));
    };
    return <>
      <div className="admin-page-heading"><div><p>Website media</p><h1>Page images</h1><span>Replace content photography and choose the visible focal point for each responsive crop. Decorative artwork, icons, the organogram, event cards, testimonials, and team profiles are managed elsewhere or remain code-controlled.</span></div></div>
      <div className="admin-media-pages">
        {pages.map((page) => {
          const items = siteImages.filter((record) => record.page === page);
          return <section className="admin-media-page" key={page} aria-labelledby={`admin-media-${slugify(page)}`}>
            <header><div><h2 id={`admin-media-${slugify(page)}`}>{page}</h2><p>{items.length} editable {items.length === 1 ? "image" : "images"}</p></div><a href={page === "Home" ? "/" : page === "About Us" ? "/about" : page === "Events" ? "/events" : page === "Lens Podium" ? "/lens-podium" : `/${page.toLowerCase().replace(" us", "").replace(" ", "-")}`} target="_blank" rel="noreferrer">View page <ArrowSquareOut size={16} /></a></header>
            <div className="admin-media-grid">{items.map((record) => <article className="admin-media-card" key={record.id}>
              <div className="admin-media-card-copy"><h3>{record.label}</h3><p>{record.description}</p></div>
              <ImageUploadField label="Image" value={record.image} aspect={record.aspect === "square" ? "square" : "landscape"} focalPoint={record.focalPoint} onFocalPointChange={(focalPoint) => updateImage(record.id, { focalPoint })} onChange={(image) => updateImage(record.id, { image })} />
              <label className="admin-media-alt"><span>Alternative text</span><input value={record.alt} onChange={(event) => updateImage(record.id, { alt: event.target.value })} /></label>
            </article>)}</div>
          </section>;
        })}
      </div>
    </>;
  }

  function renderFaqs(page: FaqRecord["page"]) {
    const items = faqs.filter((item) => item.page === page && (!q || `${item.question} ${item.answer}`.toLowerCase().includes(q)));
    const isPodium = page === "Lens Podium";
    return <><CollectionHeading eyebrow={isPodium ? "LENS the Podium collection" : "Support collection"} title={isPodium ? "Podium FAQs" : "FAQs"} description={isPodium ? "Manage the questions shown below the LENS the Podium application form." : "Keep common questions and answers useful, current and easy to understand."} action="Add FAQ" onAction={() => setEditor({ kind: "faq", item: blankFaq(page) })} /><div className="admin-toolbar"><SearchBox query={query} setQuery={setQuery} label={`Search ${isPodium ? "Podium " : ""}FAQs`} /></div><div className="admin-faq-list">{items.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.question}</strong><p>{item.answer}</p></div><em className={`admin-status ${item.status.toLowerCase()}`}>{item.status}</em><div className="admin-row-actions"><button onClick={() => setEditor({ kind: "faq", item })}>Edit</button><button className="danger" onClick={() => deleteItem("faq", item.id)}>Delete</button></div></article>)}</div></>;
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <a className="admin-brand" href="/" aria-label="Lens Foundation website"><img src="/assets/lens-logo.png" alt="" /><span><strong>Lens Foundation</strong><small>Content management</small></span></a>
        <nav aria-label="Admin navigation">{navItems.map((item) => { const Icon = item.icon; return <button className={section === item.id ? "active" : ""} key={item.id} onClick={() => showSection(item.id)}><Icon size={20} weight={section === item.id ? "fill" : "regular"} /><span>{item.label}</span>{item.id !== "overview" && <small>{counts[item.id as keyof typeof counts]}</small>}</button>; })}</nav>
        <div className="admin-sidebar-footer"><div>LF</div><span><strong>Lens team</strong><small>Administrator</small></span>{onLogout && <button type="button" onClick={onLogout} aria-label="Sign out"><SignOut size={18} /></button>}</div>
      </aside>
      {menuOpen && <button className="admin-menu-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <div className="admin-workspace">
        <header className="admin-topbar"><button className="admin-menu-button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><List size={24} /></button><span>{navItems.find((item) => item.id === section)?.label}</span><a href="/" target="_blank" rel="noreferrer">View website <ArrowSquareOut size={18} /></a></header>
        <main className="admin-content">{section === "overview" ? renderOverview() : section === "events" ? renderEvents() : section === "reports" ? renderReports() : section === "testimonials" ? renderTestimonials() : section === "team" ? renderTeam() : section === "media" ? renderMedia() : section === "podium-faqs" ? renderFaqs("Lens Podium") : renderFaqs("Home")}</main>
      </div>
      {editor && <EditorModal editor={editor} events={events} reports={reports} testimonials={testimonials} faqs={faqs} close={() => setEditor(null)} saveEvent={(item) => { persistEvents(events.some((record) => record.id === item.id) ? events.map((record) => record.id === item.id ? item : record) : [item, ...events]); setEditor(null); }} saveReport={(item) => { persistReports(reports.some((record) => record.id === item.id) ? reports.map((record) => record.id === item.id ? item : record) : [item, ...reports]); setEditor(null); }} saveTestimonial={(item) => { persistTestimonials(testimonials.some((record) => record.id === item.id) ? testimonials.map((record) => record.id === item.id ? item : record) : [item, ...testimonials]); setEditor(null); }} saveTeam={(item) => { persistTeam(teamMembers.map((record) => record.id === item.id ? item : record)); setEditor(null); }} saveFaq={(item) => { persistFaqs(faqs.some((record) => record.id === item.id) ? faqs.map((record) => record.id === item.id ? item : record) : [item, ...faqs]); setEditor(null); }} />}
      {notice && <div className="admin-notice" role="status"><Check size={18} weight="bold" />{notice}</div>}
    </div>
  );
}

function CollectionHeading({ eyebrow, title, description, action, onAction }: { eyebrow: string; title: string; description: string; action: string; onAction: () => void }) {
  return <div className="admin-page-heading"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div><button className="admin-primary-action" onClick={onAction}><Plus size={19} weight="bold" />{action}</button></div>;
}

function SearchBox({ query, setQuery, label }: { query: string; setQuery: (value: string) => void; label: string }) {
  return <label className="admin-search"><MagnifyingGlass size={19} /><span className="sr-only">{label}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={label} /></label>;
}

function ContentCard({ title, meta, status, href, onEdit, onDelete }: { title: string; meta: string; status: string; href?: string; onEdit: () => void; onDelete: () => void }) {
  return <article className="admin-content-card"><div className="admin-document-icon"><FileText size={25} /></div><em className={`admin-status ${status.toLowerCase()}`}>{status}</em><h2>{title}</h2><p>{meta}</p><div><button onClick={onEdit}>Edit</button>{href && <a href={href} target="_blank" rel="noreferrer">View report</a>}<button className="danger" onClick={onDelete}>Delete</button></div></article>;
}

function EmptyState({ title, description }: { title: string; description: string }) { return <div className="admin-empty"><MagnifyingGlass size={28} /><strong>{title}</strong><span>{description}</span></div>; }

function EditorModal({ editor, close, saveEvent, saveReport, saveTestimonial, saveTeam, saveFaq }: { editor: Exclude<Editor, null>; events: EventRecord[]; reports: AnnualReportRecord[]; testimonials: TestimonialRecord[]; faqs: FaqRecord[]; close: () => void; saveEvent: (item: EventRecord) => void; saveReport: (item: AnnualReportRecord) => void; saveTestimonial: (item: TestimonialRecord) => void; saveTeam: (item: TeamMemberRecord) => void; saveFaq: (item: FaqRecord) => void }) {
  const [item, setItem] = useState(editor.item);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const isNew = !item.id;
  const heading = `${isNew ? "Add" : "Edit"} ${editor.kind === "faq" ? "FAQ" : editor.kind}`;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (editor.kind === "event") { const value = item as EventRecord; const id = value.id || slugify(value.title); saveEvent({ ...value, id, href: `/events/${id}`, date: displayDate(value.dateValue), createdAt: value.createdAt || new Date().toISOString() }); }
    if (editor.kind === "report") { const value = item as AnnualReportRecord; saveReport({ ...value, id: value.id || `report-${slugify(value.year || value.title)}` }); }
    if (editor.kind === "testimonial") { const value = item as TestimonialRecord; saveTestimonial({ ...value, id: value.id || slugify(value.name) }); }
    if (editor.kind === "team") saveTeam(item as TeamMemberRecord);
    if (editor.kind === "faq") { const value = item as FaqRecord; saveFaq({ ...value, id: value.id || slugify(value.question) }); }
  }

  async function generateWithAi() {
    if (editor.kind !== "event" && editor.kind !== "report") return;
    const eventItem = item as EventRecord;
    const reportItem = item as AnnualReportRecord;
    if (editor.kind === "event" && !eventItem.title.trim()) {
      setGenerationError("Add the event title first so Groq has enough context.");
      return;
    }
    if (editor.kind === "report" && !reportItem.year.trim()) {
      setGenerationError("Add the report year first so Groq has enough context.");
      return;
    }

    setGenerating(true);
    setGenerationError("");
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: editor.kind,
          context: editor.kind === "event"
            ? { title: eventItem.title, date: eventItem.dateValue, status: eventItem.status, chapter: eventItem.chapter, location: eventItem.location }
            : { year: reportItem.year, title: reportItem.title },
        }),
      });
      const payload = await response.json() as { content?: Record<string, unknown>; error?: string };
      if (!response.ok || !payload.content) throw new Error(payload.error || "Content generation failed.");

      if (editor.kind === "event") {
        const content = payload.content as { summary?: string; overview?: string; expectations?: string[]; whyAttend?: string };
        setItem({ ...eventItem, details: {
          summary: content.summary || "",
          overview: content.overview || "",
          expectations: Array.isArray(content.expectations) ? content.expectations : [""],
          whyAttend: content.whyAttend || "",
        } });
      } else {
        setItem({ ...reportItem, description: String(payload.content.description || "") });
      }
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Content generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  return <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title"><header><div><p>{isNew ? "Create content" : "Update content"}</p><h2 id="admin-editor-title">{heading}</h2></div><button type="button" aria-label="Close editor" onClick={close}><X size={22} /></button></header><form onSubmit={submit}>
    {(editor.kind === "event" || editor.kind === "report") && <div className="admin-ai-toolbar"><div><Sparkle size={20} weight="fill" /><span><strong>Generate supporting copy</strong><small>Uses the title and context already entered.</small></span></div><button type="button" disabled={generating} onClick={generateWithAi}>{generating ? "Generating…" : "Generate with Groq"}</button>{generationError && <p role="alert">{generationError}</p>}</div>}
    {editor.kind === "event" && <EventFields item={item as EventRecord} setItem={(value) => setItem(value)} />}
    {editor.kind === "report" && <ReportFields item={item as AnnualReportRecord} setItem={(value) => setItem(value)} />}
    {editor.kind === "testimonial" && <TestimonialFields item={item as TestimonialRecord} setItem={(value) => setItem(value)} />}
    {editor.kind === "team" && <TeamFields item={item as TeamMemberRecord} setItem={(value) => setItem(value)} />}
    {editor.kind === "faq" && <FaqFields item={item as FaqRecord} setItem={(value) => setItem(value)} />}
    <footer><button type="button" onClick={close}>Cancel</button><button className="admin-primary-action" type="submit">{isNew ? "Publish content" : "Save changes"}</button></footer>
  </form></section></div>;
}

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) { return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>; }

function BrandedSelect<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  return <details className="admin-branded-select" ref={detailsRef}><summary aria-label={label}><span>{value}</span><CaretDown size={17} weight="bold" /></summary><div role="listbox" aria-label={label}>{options.map((option) => <button type="button" role="option" aria-selected={option === value} data-selected={option === value} key={option} onClick={() => { onChange(option); detailsRef.current?.removeAttribute("open"); }}>{option}{option === value && <Check size={17} weight="bold" />}</button>)}</div></details>;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

async function optimizeUploadedImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Choose a PNG, JPG, WEBP, or another image file.");
  if (file.size > MAX_IMAGE_SIZE) throw new Error("The image must be 5 MB or smaller.");
  const source = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const next = new Image();
      next.onload = () => resolve(next);
      next.onerror = () => reject(new Error("This image could not be read. Please choose another file."));
      next.src = source;
    });
    const maximumEdge = 1600;
    const scale = Math.min(1, maximumEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable in this browser.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.82);
  } finally {
    URL.revokeObjectURL(source);
  }
}

function ImageUploadField({ label, value, onChange, aspect = "landscape", focalPoint, onFocalPointChange }: { label: string; value: string; onChange: (value: string) => void; aspect?: "landscape" | "square"; focalPoint?: FocalPoint; onFocalPointChange?: (value: FocalPoint) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const chooseImage = async (file?: File) => {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      onChange(await optimizeUploadedImage(file));
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "The image could not be uploaded.");
      if (inputRef.current) inputRef.current.value = "";
    } finally {
      setProcessing(false);
    }
  };
  return <div className="admin-image-upload">
    <span>{label}</span>
    <button className={`admin-image-upload-zone ${value ? "has-image" : ""}`} type="button" onClick={() => inputRef.current?.click()} disabled={processing}>
      {value ? <img className={aspect} src={value} alt="Selected upload preview" style={{ objectPosition: `${focalPoint?.x ?? 50}% ${focalPoint?.y ?? 50}%` }} /> : <span className="admin-image-upload-placeholder"><ImageSquare size={28} /><strong>Choose an image</strong></span>}
      <span className="admin-image-upload-action"><UploadSimple size={18} weight="bold" />{processing ? "Optimizing…" : value ? "Replace image" : "Upload image"}</span>
    </button>
    <input ref={inputRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" required={!value} onChange={(event) => void chooseImage(event.target.files?.[0])} />
    <small>PNG, JPG, WEBP or GIF. Maximum file size: 5 MB.</small>
    {focalPoint && onFocalPointChange && <div className="admin-focal-controls">
      <div><strong>Focal point</strong><span>{Math.round(focalPoint.x)}% horizontal · {Math.round(focalPoint.y)}% vertical</span></div>
      <label><span>Horizontal</span><input aria-label={`${label} horizontal focal point`} type="range" min="0" max="100" value={focalPoint.x} onChange={(event) => onFocalPointChange({ ...focalPoint, x: Number(event.target.value) })} /></label>
      <label><span>Vertical</span><input aria-label={`${label} vertical focal point`} type="range" min="0" max="100" value={focalPoint.y} onChange={(event) => onFocalPointChange({ ...focalPoint, y: Number(event.target.value) })} /></label>
    </div>}
    {error && <small className="admin-image-upload-error" role="alert">{error}</small>}
  </div>;
}

function EventFields({ item, setItem }: { item: EventRecord; setItem: (item: EventRecord) => void }) {
  const details = item.details ?? { summary: "", overview: "", expectations: [""], whyAttend: "" };
  return <div className="admin-form-grid"><Field label="Event title" wide><input required value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} /></Field><Field label="Date"><input required type="date" value={item.dateValue} onChange={(e) => setItem({ ...item, dateValue: e.target.value })} /></Field><Field label="Status"><BrandedSelect label="Event status" value={item.status} options={["Upcoming", "Completed"] as const} onChange={(status) => setItem({ ...item, status })} /></Field><Field label="Chapter"><BrandedSelect label="Event chapter" value={item.chapter} options={["Lagos", "Ghana", "USA", "London"] as const} onChange={(chapter) => setItem({ ...item, chapter })} /></Field><Field label="Location"><input required value={item.location} onChange={(e) => setItem({ ...item, location: e.target.value })} /></Field><div className="wide"><ImageUploadField label="Event card image" value={item.image} focalPoint={item.imageFocalPoint ?? { x: 50, y: 50 }} onFocalPointChange={(imageFocalPoint) => setItem({ ...item, imageFocalPoint })} onChange={(image) => setItem({ ...item, image })} /></div><Field label="Card summary" wide><textarea required rows={3} value={details.summary} onChange={(e) => setItem({ ...item, details: { ...details, summary: e.target.value } })} /></Field><Field label="Event overview" wide><textarea required rows={5} value={details.overview} onChange={(e) => setItem({ ...item, details: { ...details, overview: e.target.value } })} /></Field><Field label={item.status === "Upcoming" ? "What to expect (one item per line)" : "What happened (one item per line)"} wide><textarea required rows={4} value={details.expectations.join("\n")} onChange={(e) => setItem({ ...item, details: { ...details, expectations: e.target.value.split("\n") } })} /></Field><Field label={item.status === "Upcoming" ? "Why attend?" : "Impact statement"} wide><textarea required rows={4} value={details.whyAttend} onChange={(e) => setItem({ ...item, details: { ...details, whyAttend: e.target.value } })} /></Field></div>;
}

function ReportFields({ item, setItem }: { item: AnnualReportRecord; setItem: (item: AnnualReportRecord) => void }) { return <div className="admin-form-grid"><Field label="Year"><input required value={item.year} onChange={(e) => setItem({ ...item, year: e.target.value })} /></Field><Field label="Status"><BrandedSelect label="Report status" value={item.status} options={["Draft", "Published"] as const} onChange={(status) => setItem({ ...item, status })} /></Field><Field label="Report title" wide><input required value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} /></Field><Field label="Description" wide><textarea required rows={4} value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} /></Field><Field label="PDF path or URL" wide><input required value={item.url} onChange={(e) => setItem({ ...item, url: e.target.value })} /></Field></div>; }

function TestimonialFields({ item, setItem }: { item: TestimonialRecord; setItem: (item: TestimonialRecord) => void }) { return <div className="admin-form-grid"><Field label="Name"><input required value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} /></Field><Field label="Role"><input required value={item.role} onChange={(e) => setItem({ ...item, role: e.target.value })} /></Field><Field label="Status"><BrandedSelect label="Testimonial status" value={item.status} options={["Draft", "Published"] as const} onChange={(status) => setItem({ ...item, status })} /></Field><div><ImageUploadField label="Avatar image" value={item.image} aspect="square" focalPoint={item.focalPoint ?? { x: 50, y: 50 }} onFocalPointChange={(focalPoint) => setItem({ ...item, focalPoint })} onChange={(image) => setItem({ ...item, image })} /></div><Field label="Testimonial" wide><textarea required rows={6} value={item.quote} onChange={(e) => setItem({ ...item, quote: e.target.value })} /></Field></div>; }

function TeamFields({ item, setItem }: { item: TeamMemberRecord; setItem: (item: TeamMemberRecord) => void }) { return <div className="admin-form-grid"><Field label="Full name"><input required value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} /></Field><Field label="Role"><input required value={item.role} onChange={(e) => setItem({ ...item, role: e.target.value })} /></Field><div className="wide"><ImageUploadField label="Team portrait" value={item.image} aspect="square" focalPoint={item.focalPoint} onFocalPointChange={(focalPoint) => setItem({ ...item, focalPoint })} onChange={(image) => setItem({ ...item, image })} /></div></div>; }

function FaqFields({ item, setItem }: { item: FaqRecord; setItem: (item: FaqRecord) => void }) { return <div className="admin-form-grid"><Field label="Status"><BrandedSelect label="FAQ status" value={item.status} options={["Draft", "Published"] as const} onChange={(status) => setItem({ ...item, status })} /></Field><Field label="Question" wide><input required value={item.question} onChange={(e) => setItem({ ...item, question: e.target.value })} /></Field><Field label="Answer" wide><textarea required rows={7} value={item.answer} onChange={(e) => setItem({ ...item, answer: e.target.value })} /></Field></div>; }
