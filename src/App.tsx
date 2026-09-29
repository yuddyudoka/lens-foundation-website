import { AnnualReports } from "./components/AnnualReports";
import { Events } from "./components/Events";
import { Faq } from "./components/Faq";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Impact } from "./components/Impact";
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
        <Impact />
        <Events />
        <AnnualReports />
        <VolunteerCta />
        <OpportunitiesMarquee />
        <Testimonials />
        <Faq />
        <FinalCta />
        <Footer />
      </main>
    );
  }

  return <NotFoundPage />;
}

export default function App() {
  return (
    <>
      <CurrentPage />
      <DonationModal />
    </>
  );
}
