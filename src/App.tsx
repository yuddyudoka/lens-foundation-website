import { useEffect, useState } from "react";
import { AnnualReports } from "./components/AnnualReports";
import { Events } from "./components/Events";
import { Faq } from "./components/Faq";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HomeMissionScroll } from "./components/HomeMissionScroll";
import { Impact } from "./components/Impact";
import { LensValuesJourney } from "./components/LensValuesJourney";
import { Navbar } from "./components/Navbar";
import { OpportunitiesMarquee } from "./components/OpportunitiesMarquee";
import { Testimonials } from "./components/Testimonials";
import { VolunteerCta } from "./components/VolunteerCta";
import { ContactPage } from "./components/ContactPage";
import { PartnerPage, VolunteerPage } from "./components/ApplicationPages";
import { EventsPage } from "./components/EventsPage";
import { EventDetailPage } from "./components/EventDetailPage";
import { AboutPage } from "./components/AboutPage";
import { DonationModal } from "./components/DonationModal";
import { LensPodiumPage } from "./components/LensPodiumPage";
import { NotFoundPage } from "./components/NotFoundPage";
import { AdminAccess } from "./components/AdminAccess";

const siteUrl = "https://thelensfoundation.org";
const defaultSocialImage = `${siteUrl}/assets/about-page-hero-v1.webp`;

const pageMetadata: Record<string, { title: string; description: string }> = {
  "": {
    title: "The Lens Foundation | Compassion in Action",
    description: "The Lens Foundation turns compassion into practical support for children, families, and communities through outreach, education, healthcare support, and partnerships.",
  },
  "/about": {
    title: "About Us | The Lens Foundation",
    description: "Learn how The Lens Foundation leads, empowers, nurtures, and supports communities through practical care, partnerships, and accountable impact.",
  },
  "/events": {
    title: "Events | The Lens Foundation",
    description: "Explore upcoming and completed Lens Foundation events, outreach programmes, and community gatherings across our chapters.",
  },
  "/lens-podium": {
    title: "LENS the Podium | The Lens Foundation",
    description: "LENS the Podium helps young people aged 11 to 19 build confidence, public-speaking skills, purposeful expression, and leadership.",
  },
  "/volunteer": {
    title: "Volunteer | The Lens Foundation",
    description: "Apply to volunteer with The Lens Foundation and contribute your time and skills to community programmes, outreach, and operational support.",
  },
  "/partner": {
    title: "Partner With Us | The Lens Foundation",
    description: "Partner with The Lens Foundation to support practical, community-led programmes through funding, resources, expertise, and collaboration.",
  },
  "/contact": {
    title: "Contact Us | The Lens Foundation",
    description: "Contact The Lens Foundation, send an enquiry, or book a meeting with our team to discuss programmes, partnerships, and ways to get involved.",
  },
};

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  const element = document.head.querySelector<HTMLElement>(selector);
  if (element) element.setAttribute(attribute, value);
}

function HomeEmbedPreloads() {
  return (
    <div className="home-embed-preloads" aria-hidden="true">
      <iframe
        src="https://calendly.com/thelensfoundation/30min?embed_type=Inline&hide_gdpr_banner=1"
        title="Calendly preload"
        tabIndex={-1}
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <iframe
        src="https://www.youtube-nocookie.com/embed/-9kt-4WqOD0?rel=0&playsinline=1"
        title="YouTube preload"
        tabIndex={-1}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

function CurrentPage() {
  const pathname = window.location.pathname.replace(/\/$/, "");

  if (pathname === "/admin") {
    return <AdminAccess />;
  }

  if (pathname === "/contact") {
    return <ContactPage />;
  }

  if (pathname === "/about") {
    return <AboutPage />;
  }

  if (pathname === "/volunteer") {
    return <VolunteerPage />;
  }

  if (pathname === "/partner") {
    return <PartnerPage />;
  }

  if (pathname === "/events") {
    return <EventsPage />;
  }

  if (pathname === "/lens-podium") {
    return <LensPodiumPage />;
  }

  if (pathname.startsWith("/events/")) {
    return <EventDetailPage eventId={decodeURIComponent(pathname.slice("/events/".length))} />;
  }

  if (pathname === "") {
    return (
      <main>
        <Navbar />
        <Hero />
        <HomeMissionScroll />
        <LensValuesJourney />
        <Impact />
        <Events />
        <AnnualReports />
        <VolunteerCta />
        <OpportunitiesMarquee />
        <Testimonials />
        <Faq />
        <FinalCta />
        <Footer />
        <HomeEmbedPreloads />
      </main>
    );
  }

  return <NotFoundPage />;
}

export default function App() {
  const [, refreshCms] = useState(0);
  const [cmsHydrationRevision, setCmsHydrationRevision] = useState(0);

  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, "");
    const metadata = path.startsWith("/events/") ? pageMetadata["/events"] : pageMetadata[path];
    if (!metadata || path === "/admin") return;
    const canonicalUrl = `${siteUrl}${path || "/"}`;
    document.title = metadata.title;
    setMeta('meta[name="description"]', "content", metadata.description);
    setMeta('link[rel="canonical"]', "href", canonicalUrl);
    setMeta('meta[property="og:title"]', "content", metadata.title);
    setMeta('meta[property="og:description"]', "content", metadata.description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", defaultSocialImage);
    setMeta('meta[name="twitter:title"]', "content", metadata.title);
    setMeta('meta[name="twitter:description"]', "content", metadata.description);
    setMeta('meta[name="twitter:image"]', "content", defaultSocialImage);
  }, []);

  useEffect(() => {
    const handleCmsUpdate = (event: Event) => {
      refreshCms((value) => value + 1);
      if ((event as CustomEvent<string>).detail === "remote-hydration") {
        // Stateful collections (events and the admin editor) need one clean
        // remount after the background KV snapshot arrives.
        setCmsHydrationRevision((value) => value + 1);
      }
    };
    window.addEventListener("lens-cms-updated", handleCmsUpdate);
    return () => window.removeEventListener("lens-cms-updated", handleCmsUpdate);
  }, []);

  return (
    <>
      <CurrentPage key={cmsHydrationRevision} />
      <DonationModal />
    </>
  );
}
