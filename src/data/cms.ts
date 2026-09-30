import type { EventRecord } from "./events";

export type AnnualReportRecord = {
  id: string;
  year: string;
  title: string;
  description: string;
  url: string;
  status: "Published" | "Draft";
};

export type TestimonialRecord = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image: string;
  focalPoint?: FocalPoint;
  status: "Published" | "Draft";
};

export type FocalPoint = { x: number; y: number };

export type SiteImagePage = "Home" | "About Us" | "Events" | "Lens Podium" | "Volunteer" | "Partner" | "Contact Us";

export type SiteImageRecord = {
  id: string;
  page: SiteImagePage;
  label: string;
  description: string;
  image: string;
  alt: string;
  focalPoint: FocalPoint;
  aspect: "landscape" | "portrait" | "square";
};

export type TeamMemberRecord = {
  id: string;
  name: string;
  role: string;
  image: string;
  focalPoint: FocalPoint;
};

export type FaqRecord = {
  id: string;
  page: "Home" | "Lens Podium";
  question: string;
  answer: string;
  status: "Published" | "Draft";
};

export const defaultAnnualReports: AnnualReportRecord[] = [
  { id: "report-2025", year: "2025", title: "Lens Foundation Annual Report 2025", description: "A concise record of our programmes, partnerships, reach and the progress made with the communities we serve.", url: "https://heyzine.com/flip-book/8d792a3466.html", status: "Published" },
  { id: "report-2024", year: "2024", title: "Lens Foundation Annual Report 2024", description: "A look back at the people, initiatives and milestones that shaped another year of practical, community-led impact.", url: "https://heyzine.com/flip-book/e823cfc85c.html", status: "Published" },
];

export const defaultTestimonials: TestimonialRecord[] = [
  { id: "chijioke-okafor", quote: "Lens Foundation came through for me at a time when I genuinely needed help. The support was not just financial. It reminded me that people still care.", name: "Chijioke Okafor", role: "Beneficiary", image: "/assets/testimonial-chijioke-v2.png", status: "Published" },
  { id: "ngozi-eze", quote: "The support we received made a real difference for my family. What felt overwhelming suddenly became a little easier, and we felt seen and supported.", name: "Ngozi Eze", role: "Parent Beneficiary", image: "/assets/testimonial-ngozi-v2.png", status: "Published" },
  { id: "emeka-nwosu", quote: "Knowing that someone believed in my education gave me hope. The support I received helped me focus on school and believe more strongly in my future.", name: "Emeka Nwosu", role: "Education Beneficiary", image: "/assets/testimonial-emeka-v2.png", status: "Published" },
  { id: "ifeoma-uche", quote: "Volunteering with Lens Foundation has shown me how powerful simple acts of kindness can be. You see the impact immediately, and it stays with you.", name: "Ifeoma Uche", role: "Volunteer", image: "/assets/testimonial-ifeoma-v2.png", status: "Published" },
  { id: "tunde-adebayo", quote: "I wanted to support an organisation where I could see that the help was reaching real people. Lens Foundation made that impact feel personal and meaningful.", name: "Tunde Adebayo", role: "Donor", image: "/assets/testimonial-tunde-v2.png", status: "Published" },
  { id: "kemi-adesola", quote: "What stands out about Lens Foundation is their willingness to show up. They listen, understand what people actually need, and take practical action to help.", name: "Kemi Adesola", role: "Community Partner", image: "/assets/testimonial-kemi-v2.png", status: "Published" },
];

export const defaultSiteImages: SiteImageRecord[] = [
  { id: "home-hero", page: "Home", label: "Homepage hero", description: "Main image behind the homepage introduction.", image: "/assets/hero-team-1.jpg", alt: "Members of The Lens Foundation team standing together", focalPoint: { x: 50, y: 20 }, aspect: "landscape" },
  { id: "home-impact-community", page: "Home", label: "Impact — community", description: "Community photograph in the Our Impact section.", image: "/assets/impact-community.jpg", alt: "Lens Foundation team members with children in the community", focalPoint: { x: 50, y: 50 }, aspect: "landscape" },
  { id: "home-impact-outreach", page: "Home", label: "Impact — outreach", description: "Outreach photograph in the featured impact card.", image: "/assets/impact-outreach.jpg", alt: "Lens Foundation volunteers preparing supplies during an outreach", focalPoint: { x: 50, y: 50 }, aspect: "portrait" },
  { id: "home-volunteer-cta", page: "Home", label: "Volunteer call-to-action", description: "Background photograph behind the volunteer invitation.", image: "/assets/volunteer-cta-background.png", alt: "Lens Foundation volunteers during a community outreach", focalPoint: { x: 50, y: 50 }, aspect: "landscape" },
  { id: "about-hero", page: "About Us", label: "About Us hero", description: "Main image at the top of the About Us page.", image: "/assets/about-page-hero.png", alt: "Lens Foundation team members standing together at a community event", focalPoint: { x: 50, y: 30 }, aspect: "landscape" },
  { id: "about-mission", page: "About Us", label: "Mission image", description: "Supporting image beside the mission statement.", image: "/assets/impact-outreach.jpg", alt: "Lens Foundation volunteers preparing outreach supplies", focalPoint: { x: 50, y: 50 }, aspect: "landscape" },
  { id: "about-vision", page: "About Us", label: "Vision image", description: "Supporting image beside the vision statement.", image: "/assets/impact-community.jpg", alt: "Lens Foundation volunteers with school children", focalPoint: { x: 50, y: 50 }, aspect: "landscape" },
  { id: "about-founder", page: "About Us", label: "Founder portrait", description: "Portrait shown beside the founder's message.", image: "/assets/team-omobolanle-sodiya.jpg", alt: "Omobolanle Sodiya, Founding Director of The Lens Foundation", focalPoint: { x: 50, y: 35 }, aspect: "portrait" },
  { id: "events-hero", page: "Events", label: "Events hero", description: "Main image at the top of the Events page.", image: "/assets/events-page-hero.png", alt: "Lens Foundation team members gathered at a community event", focalPoint: { x: 50, y: 20 }, aspect: "landscape" },
  { id: "podium-skills", page: "Lens Podium", label: "Participant outcomes", description: "Supporting visual for what participants will gain.", image: "/assets/podium-skills.png", alt: "Teens public speaking and sign language bootcamp programme artwork", focalPoint: { x: 50, y: 50 }, aspect: "portrait" },
  { id: "podium-training", page: "Lens Podium", label: "Programme format", description: "Supporting visual for how the programme works.", image: "/assets/podium-training.png", alt: "Lens the Podium communication and leadership word cloud", focalPoint: { x: 50, y: 50 }, aspect: "landscape" },
  { id: "podium-inclusive", page: "Lens Podium", label: "Inclusive programme visual", description: "Main visual in the inclusive programme section.", image: "/assets/podium-inclusive.png", alt: "Lens the Podium raised-fist microphone logo", focalPoint: { x: 50, y: 50 }, aspect: "square" },
  { id: "volunteer-hero", page: "Volunteer", label: "Volunteer hero", description: "Main image at the top of the volunteer application page.", image: "/assets/volunteer-hero.png", alt: "Lens Foundation community outreach participants", focalPoint: { x: 50, y: 18 }, aspect: "landscape" },
  { id: "partner-hero", page: "Partner", label: "Partner hero", description: "Main image at the top of the partnership application page.", image: "/assets/partner-hero.png", alt: "Lens Foundation community outreach participants", focalPoint: { x: 50, y: 38 }, aspect: "landscape" },
  { id: "contact-hero", page: "Contact Us", label: "Contact Us hero", description: "Main image at the top of the Contact Us page.", image: "/assets/contact-hero.png", alt: "Lens Foundation team members standing together", focalPoint: { x: 50, y: 35 }, aspect: "landscape" },
];

export const defaultTeamMembers: TeamMemberRecord[] = [
  { id: "omobolanle-sodiya", name: "Omobolanle Sodiya", role: "Founding Director", image: "/assets/team-omobolanle-sodiya.jpg", focalPoint: { x: 50, y: 35 } },
  { id: "ayobami-johnson", name: "Ayobami Johnson", role: "Director of Operations", image: "/assets/team-ayobami-johnson.jpg", focalPoint: { x: 50, y: 30 } },
  { id: "joy-dada", name: "Joy Dada", role: "Head of Admin", image: "/assets/team-joy-dada.png", focalPoint: { x: 50, y: 28 } },
  { id: "michael-gbademu", name: "Michael Gbademu", role: "Team Lead — Volunteers", image: "/assets/team-michael-gbademu.png", focalPoint: { x: 50, y: 26 } },
  { id: "ubaka-amen", name: "Ubaka Amen", role: "Team Lead — Volunteers", image: "/assets/team-ubaka-amen.png", focalPoint: { x: 50, y: 28 } },
  { id: "abisola-rahman", name: "Abisola Rahman", role: "Director of Mission", image: "", focalPoint: { x: 50, y: 50 } },
];

export const defaultFaqs: FaqRecord[] = [
  { id: "what-we-do", page: "Home", question: "What does The Lens Foundation do?", answer: "The Lens Foundation supports children, families, and communities through education, food assistance, healthcare support, financial aid, outreach programmes, and other practical initiatives designed to meet real needs.", status: "Published" },
  { id: "who-we-support", page: "Home", question: "Who does The Lens Foundation support?", answer: "We support children, young people, families, and underserved communities facing barriers to education, wellbeing, and essential resources.", status: "Published" },
  { id: "how-to-donate", page: "Home", question: "How can I donate?", answer: "You can make a donation through our secure Paystack option or transfer directly to the bank account shown in the donation modal.", status: "Published" },
  { id: "donation-use", page: "Home", question: "How are donations used?", answer: "Donations fund practical programmes including education support, food assistance, healthcare interventions, and community outreach.", status: "Published" },
  { id: "education-sponsorship", page: "Home", question: "Can I sponsor a child’s education?", answer: "Yes. Education sponsorship can help cover learning materials, school-related costs, and other support a child needs to stay engaged in school.", status: "Published" },
  { id: "volunteer", page: "Home", question: "Can I volunteer with The Lens Foundation?", answer: "Yes. Volunteers can contribute their time and skills across programmes, events, outreach, and operational support in an active chapter.", status: "Published" },
  { id: "podium-about", page: "Lens Podium", question: "What’s LENS the Podium about?", answer: "LENS the Podium is an initiative by Lens Foundation that provides young people with a platform to express themselves and build confidence.", status: "Published" },
  { id: "podium-participation", page: "Lens Podium", question: "Who can participate?", answer: "LENS the Podium is open to young people between ages 11 and 19.", status: "Published" },
  { id: "podium-experience", page: "Lens Podium", question: "Do I need public speaking experience?", answer: "No, you don’t need previous public speaking experience.", status: "Published" },
  { id: "podium-apply", page: "Lens Podium", question: "How do I apply?", answer: "Complete the application form above.", status: "Published" },
  { id: "podium-selection", page: "Lens Podium", question: "Does applying guarantee that I will be selected?", answer: "No. Applications are reviewed by the Lens Foundation team, and selected applicants will be contacted.", status: "Published" },
  { id: "podium-fee", page: "Lens Podium", question: "Is there a fee?", answer: "No. This is a completely free programme.", status: "Published" },
  { id: "podium-prize", page: "Lens Podium", question: "Is there a prize to be won?", answer: "Yes. Participants who demonstrate exceptional growth may receive a prize, and every participant who completes the curriculum receives a certificate.", status: "Published" },
];

const storageKeys = {
  events: "lens-cms-events-v1",
  reports: "lens-cms-reports-v1",
  testimonials: "lens-cms-testimonials-v1",
  faqs: "lens-cms-faqs-v2",
  legacyFaqs: "lens-cms-faqs-v1",
  siteImages: "lens-cms-site-images-v1",
  team: "lens-cms-team-v1",
} as const;

function readCollection<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T[] : fallback;
  } catch {
    return fallback;
  }
}

function saveCollection<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("lens-cms-updated", { detail: key }));
}

export const getLocalEvents = () => readCollection<EventRecord>(storageKeys.events, []);
export const saveLocalEvents = (records: EventRecord[]) => {
  saveCollection(storageKeys.events, records);
  window.localStorage.setItem("lens-cms-events-seeded-v2", "true");
};
function limitPublishedAnnualReports(records: AnnualReportRecord[]) {
  const published = records
    .filter((report) => report.status === "Published")
    .sort((a, b) => Number(b.year) - Number(a.year));
  const allowed = new Set(published.slice(0, 3).map((report) => report.id));
  return records.map((report) => report.status === "Published" && !allowed.has(report.id) ? { ...report, status: "Draft" as const } : report);
}

export const getAnnualReports = () => limitPublishedAnnualReports(readCollection(storageKeys.reports, defaultAnnualReports).map((report) => {
  if (report.year === "2025" && report.url === "/annual-reports/2025") return { ...report, url: "https://heyzine.com/flip-book/8d792a3466.html" };
  if (report.year === "2024" && report.url === "/annual-reports/2024") return { ...report, url: "https://heyzine.com/flip-book/e823cfc85c.html" };
  return report;
}));
export const saveAnnualReports = (records: AnnualReportRecord[]) => {
  const normalized = limitPublishedAnnualReports(records);
  saveCollection(storageKeys.reports, normalized);
  return normalized;
};
const testimonialImageUpgrades: Record<string, string> = {
  "/assets/testimonial-chijioke.png": "/assets/testimonial-chijioke-v2.png",
  "/assets/testimonial-ngozi.png": "/assets/testimonial-ngozi-v2.png",
  "/assets/testimonial-emeka.png": "/assets/testimonial-emeka-v2.png",
  "/assets/testimonial-ifeoma.png": "/assets/testimonial-ifeoma-v2.png",
  "/assets/testimonial-tunde.png": "/assets/testimonial-tunde-v2.png",
  "/assets/testimonial-kemi.png": "/assets/testimonial-kemi-v2.png",
};
export const getTestimonials = () => readCollection(storageKeys.testimonials, defaultTestimonials)
  .map((testimonial) => ({ ...testimonial, image: testimonialImageUpgrades[testimonial.image] ?? testimonial.image }));
export const saveTestimonials = (records: TestimonialRecord[]) => saveCollection(storageKeys.testimonials, records);
export const getFaqs = () => {
  if (typeof window === "undefined") return defaultFaqs;
  const current = window.localStorage.getItem(storageKeys.faqs);
  if (current) return readCollection(storageKeys.faqs, defaultFaqs);
  const legacy = readCollection<Omit<FaqRecord, "page"> & { page?: FaqRecord["page"] }>(storageKeys.legacyFaqs, []);
  const migrated = [
    ...(legacy.length ? legacy.map((faq) => ({ ...faq, page: faq.page ?? "Home" as const })) : defaultFaqs.filter((faq) => faq.page === "Home")),
    ...defaultFaqs.filter((faq) => faq.page === "Lens Podium"),
  ];
  window.localStorage.setItem(storageKeys.faqs, JSON.stringify(migrated));
  return migrated;
};
export const saveFaqs = (records: FaqRecord[]) => saveCollection(storageKeys.faqs, records);
const previousHeroDefaults: Record<string, Array<{ image: string; y: number }>> = {
  "home-hero": [{ image: "/assets/hero-team-1.jpg", y: 50 }],
  "about-hero": [
    { image: "/assets/events-page-hero.png", y: 50 },
    { image: "/assets/hero-team-1.jpg", y: 0 },
  ],
  "events-hero": [
    { image: "/assets/events-page-hero.png", y: 50 },
    { image: "/assets/events-page-hero.png", y: 0 },
  ],
  "volunteer-hero": [
    { image: "/assets/volunteer-hero.png", y: 42 },
    { image: "/assets/volunteer-hero.png", y: 0 },
  ],
  "partner-hero": [
    { image: "/assets/partner-hero.png", y: 46 },
    { image: "/assets/partner-hero.png", y: 0 },
  ],
  "contact-hero": [
    { image: "/assets/contact-hero.png", y: 23 },
    { image: "/assets/contact-hero.png", y: 0 },
  ],
};
export const getSiteImages = () => readCollection(storageKeys.siteImages, defaultSiteImages).map((record) => {
  const previous = previousHeroDefaults[record.id] ?? [];
  const updatedDefault = defaultSiteImages.find((image) => image.id === record.id);
  // Refresh only untouched legacy defaults; preserve admin-uploaded images and custom focal points.
  const isUntouchedLegacyDefault = previous.some((legacy) => record.image === legacy.image && record.focalPoint?.x === 50 && record.focalPoint.y === legacy.y);
  if (isUntouchedLegacyDefault && updatedDefault) {
    return { ...record, image: updatedDefault.image, alt: updatedDefault.alt, focalPoint: updatedDefault.focalPoint };
  }
  return { ...record, focalPoint: record.focalPoint ?? { x: 50, y: 50 } };
});
export const getSiteImage = (id: string) => getSiteImages().find((record) => record.id === id) ?? defaultSiteImages.find((record) => record.id === id)!;
export const saveSiteImages = (records: SiteImageRecord[]) => saveCollection(storageKeys.siteImages, records);
export const getTeamMembers = () => readCollection(storageKeys.team, defaultTeamMembers).map((record) => {
  const isEmptyPlaceholder = record.name === "Team member" && record.role === "Profile coming soon" && !record.image;
  if (isEmptyPlaceholder && record.id === "team-member-5") return defaultTeamMembers[4];
  if (isEmptyPlaceholder && record.id === "team-member-6") return defaultTeamMembers[5];
  return { ...record, focalPoint: record.focalPoint ?? { x: 50, y: 50 } };
});
export const saveTeamMembers = (records: TeamMemberRecord[]) => saveCollection(storageKeys.team, records.slice(0, 6));
