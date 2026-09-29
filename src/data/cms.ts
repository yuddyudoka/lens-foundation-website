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
  status: "Published" | "Draft";
};

export type FaqRecord = {
  id: string;
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

export const defaultFaqs: FaqRecord[] = [
  { id: "what-we-do", question: "What does The Lens Foundation do?", answer: "The Lens Foundation supports children, families, and communities through education, food assistance, healthcare support, financial aid, outreach programmes, and other practical initiatives designed to meet real needs.", status: "Published" },
  { id: "who-we-support", question: "Who does The Lens Foundation support?", answer: "We support children, young people, families, and underserved communities facing barriers to education, wellbeing, and essential resources.", status: "Published" },
  { id: "how-to-donate", question: "How can I donate?", answer: "You can make a donation through our secure Paystack option or transfer directly to the bank account shown in the donation modal.", status: "Published" },
  { id: "donation-use", question: "How are donations used?", answer: "Donations fund practical programmes including education support, food assistance, healthcare interventions, and community outreach.", status: "Published" },
  { id: "education-sponsorship", question: "Can I sponsor a child’s education?", answer: "Yes. Education sponsorship can help cover learning materials, school-related costs, and other support a child needs to stay engaged in school.", status: "Published" },
  { id: "volunteer", question: "Can I volunteer with The Lens Foundation?", answer: "Yes. Volunteers can contribute their time and skills across programmes, events, outreach, and operational support in an active chapter.", status: "Published" },
];

const storageKeys = {
  events: "lens-cms-events-v1",
  reports: "lens-cms-reports-v1",
  testimonials: "lens-cms-testimonials-v1",
  faqs: "lens-cms-faqs-v1",
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
export const getFaqs = () => readCollection(storageKeys.faqs, defaultFaqs);
export const saveFaqs = (records: FaqRecord[]) => saveCollection(storageKeys.faqs, records);
