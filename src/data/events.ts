export type Chapter = "Lagos" | "Ghana" | "USA" | "London";
export type ChapterFilter = "All" | Chapter;
export type EventStatus = "Upcoming" | "Completed";
export type EventFilter = "All" | EventStatus;

const optimizedEventImages: Record<string, string> = {
  "/assets/event-community-chair-gift.png": "/assets/event-community-chair-gift-v1.webp",
  "/assets/event-makoko-food-outreach.png": "/assets/event-makoko-food-outreach-v1.webp",
  "/assets/event-street-support-drive.png": "/assets/event-street-support-drive-v1.webp",
  "/assets/event-hospital-care-visit.png": "/assets/event-hospital-care-visit-v1.webp",
};

const optimizeEventImages = (records: EventRecord[]) => records.map((event) => ({
  ...event,
  image: optimizedEventImages[event.image] ?? event.image,
  details: event.details?.image ? { ...event.details, image: optimizedEventImages[event.details.image] ?? event.details.image } : event.details,
}));

export type EventDetailContent = {
  summary: string;
  overview: string;
  expectations: string[];
  whyAttend: string;
  image?: string;
};

export type EventRecord = {
  id: string;
  title: string;
  date: string;
  dateValue: string;
  createdAt?: string;
  location: string;
  status: EventStatus;
  chapter: Chapter;
  image: string;
  imageFocalPoint?: { x: number; y: number };
  href: string;
  details?: EventDetailContent;
};

export function filterEvents(
  events: EventRecord[],
  chapter: ChapterFilter,
  status: EventFilter,
): EventRecord[] {
  return events
    .filter((event) => chapter === "All" || event.chapter === chapter)
    .filter((event) => status === "All" || event.status === status)
    .sort((a, b) => b.dateValue.localeCompare(a.dateValue));
}

export function getLatestEvents(events: EventRecord[], limit = 6): EventRecord[] {
  const eventTimestamp = (event: EventRecord) => {
    const dateTimestamp = Date.parse(event.dateValue);
    if (!Number.isNaN(dateTimestamp)) return dateTimestamp;
    const createdTimestamp = Date.parse(event.createdAt ?? "");
    return Number.isNaN(createdTimestamp) ? 0 : createdTimestamp;
  };

  return [...events]
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "Upcoming" ? -1 : 1;
      const dateDifference = eventTimestamp(b) - eventTimestamp(a);
      if (dateDifference !== 0) return dateDifference;
      return Date.parse(b.createdAt ?? "") - Date.parse(a.createdAt ?? "");
    })
    .slice(0, limit);
}

export const fallbackEvents: EventRecord[] = [
  { id: "community-chair-gift", title: "Community Chair Gift", date: "Sat, 19th Aug 2023", dateValue: "2023-08-19", location: "Community Church, Lagos", status: "Completed", chapter: "Lagos", image: "/assets/event-community-chair-gift.png", href: "/events/community-chair-gift" },
  { id: "makoko-food-outreach", title: "Makoko Food Outreach", date: "Sat, 16th Dec 2023", dateValue: "2023-12-16", location: "Makoko Community, Lagos", status: "Completed", chapter: "Lagos", image: "/assets/event-makoko-food-outreach.png", href: "/events/makoko-food-outreach" },
  { id: "street-support-drive", title: "Street Support Drive", date: "Sat, 23rd Mar 2024", dateValue: "2024-03-23", location: "Yaba, Lagos", status: "Completed", chapter: "Lagos", image: "/assets/event-street-support-drive.png", href: "/events/street-support-drive" },
  { id: "hospital-care-visit", title: "Hospital Care Visit", date: "Sat, 20th Apr 2024", dateValue: "2024-04-20", location: "Gbagada General Hospital, Lagos", status: "Completed", chapter: "Lagos", image: "/assets/event-hospital-care-visit.png", href: "/events/hospital-care-visit" },
];

const fallbackEventDetails: Record<string, EventDetailContent> = {
  "community-chair-gift": {
    summary: "A practical contribution that improved seating and created a more welcoming shared space for the church community.",
    overview: "In August 2023, The Lens Foundation donated 50 chairs valued at ₦207,000 to a community church in Lagos. The project responded to a clear everyday need and helped the church host worship, meetings, and community activities more comfortably.",
    expectations: ["50 durable chairs supplied to the church", "A more comfortable space for worship and community meetings", "Direct coordination with church representatives", "A practical response shaped around an identified local need"],
    whyAttend: "Small infrastructure needs can affect how communities gather and support one another. This contribution strengthened a shared space that continues to serve people beyond the day of the donation.",
  },
  "makoko-food-outreach": {
    summary: "A large-scale food outreach bringing essential household support to families across the Makoko community.",
    overview: "In December 2023, The Lens Foundation distributed ₦1 million worth of food supplies to more than 300 households in Makoko, Lagos. Volunteers organised the items into practical household portions and delivered them through a respectful community-led distribution process.",
    expectations: ["Food supplies delivered to more than 300 households", "₦1 million committed to essential food support", "An organised distribution process led by volunteers", "Direct engagement with families in the Makoko community"],
    whyAttend: "Reliable access to food creates immediate relief for families managing difficult circumstances. The outreach showed what coordinated giving can achieve when resources are directed where they are needed most.",
  },
  "street-support-drive": {
    summary: "Direct financial assistance delivered with care to people facing immediate needs on the streets of Lagos.",
    overview: "In March 2024, The Lens Foundation shared ₦450,000 directly with people encountered across Lagos. The outreach focused on immediate, practical relief while ensuring every interaction remained respectful, personal, and grounded in dignity.",
    expectations: ["₦450,000 distributed as direct support", "One-to-one engagement with people facing immediate needs", "A simple and responsive street-outreach process", "Support delivered respectfully without unnecessary barriers"],
    whyAttend: "Timely assistance can provide meaningful breathing room during a difficult moment. This drive reflected the foundation's commitment to meeting people where they are and responding with practical compassion.",
  },
  "hospital-care-visit": {
    summary: "Compassionate hospital support that helped patients manage medical bills and receive essential care packages.",
    overview: "In April 2024, The Lens Foundation visited Gbagada General Hospital in Lagos to support patients with medical expenses and practical care items. The visit combined direct assistance with thoughtful personal engagement during a vulnerable time.",
    expectations: ["Financial assistance toward selected patient bills", "Essential care packages prepared for patients", "Coordination with the hospital team", "Compassionate support delivered with privacy and dignity"],
    whyAttend: "Unexpected medical costs can place heavy pressure on individuals and families. This visit helped reduce that burden while reminding patients that their community had not forgotten them.",
  },
};

export function getEventDetails(event: EventRecord): EventDetailContent {
  const fallback = fallbackEventDetails[event.id] ?? {
    summary: `Join The Lens Foundation for ${event.title}, a community event created to connect people with practical support and meaningful opportunities.`,
    overview: "This event brings community members, volunteers, and partners together around a shared goal. The programme is designed to be welcoming, useful, and easy to participate in.",
    expectations: ["A welcoming and well-organised community experience", "Practical information from the Lens Foundation team", "Opportunities to connect with volunteers and participants", "Clear guidance on available support and next steps"],
    whyAttend: "Attend to learn more, meet the community, and take part in practical action that supports children and families.",
  };

  const saved = event.details;
  if (!saved) return fallback;

  const savedExpectations = Array.isArray(saved.expectations)
    ? saved.expectations.map((item) => item.trim()).filter(Boolean)
    : [];

  return {
    summary: saved.summary?.trim() || fallback.summary,
    overview: saved.overview?.trim() || fallback.overview,
    expectations: savedExpectations.length > 0 ? savedExpectations : fallback.expectations,
    whyAttend: saved.whyAttend?.trim() || fallback.whyAttend,
    image: saved.image?.trim() || fallback.image,
  };
}

function hydrateEventDetails(records: EventRecord[]): EventRecord[] {
  return records.map((event) => ({ ...event, details: getEventDetails(event) }));
}

const chapters: Chapter[] = ["Lagos", "Ghana", "USA", "London"];
const statuses: EventStatus[] = ["Upcoming", "Completed"];

function isEventRecord(value: unknown): value is EventRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<EventRecord>;
  return Boolean(
    item.id && item.title && item.date && item.dateValue && item.location && item.href && item.image &&
    item.chapter && chapters.includes(item.chapter) && item.status && statuses.includes(item.status),
  );
}

export async function loadEvents(): Promise<EventRecord[]> {
  const endpoint = import.meta.env.VITE_EVENTS_API_URL;
  if (!endpoint) {
    try {
      const stored = window.localStorage.getItem("lens-cms-events-v1");
      if (stored !== null) {
        const localRecords = (JSON.parse(stored) as unknown[]).filter(isEventRecord);
        const hasSeededCollection = window.localStorage.getItem("lens-cms-events-seeded-v2") === "true";
        if (!hasSeededCollection) {
          const mergedRecords = new Map(fallbackEvents.map((event) => [event.id, event]));
          localRecords.forEach((event) => mergedRecords.set(event.id, event));
          const migratedRecords = [...mergedRecords.values()];
          window.localStorage.setItem("lens-cms-events-v1", JSON.stringify(migratedRecords));
          window.localStorage.setItem("lens-cms-events-seeded-v2", "true");
          return hydrateEventDetails(optimizeEventImages(migratedRecords));
        }
        return hydrateEventDetails(optimizeEventImages(localRecords));
      }
    } catch {
      // Fall through to the bundled records when local CMS data is unavailable.
    }
    return hydrateEventDetails(optimizeEventImages(fallbackEvents));
  }

  try {
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) return hydrateEventDetails(optimizeEventImages(fallbackEvents));
    const payload: unknown = await response.json();
    const records = Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object" && Array.isArray((payload as { items?: unknown[] }).items)
        ? (payload as { items: unknown[] }).items
        : [];
    const validRecords = records.filter(isEventRecord);
    return hydrateEventDetails(optimizeEventImages(validRecords.length > 0 ? validRecords : fallbackEvents));
  } catch {
    return hydrateEventDetails(optimizeEventImages(fallbackEvents));
  }
}
