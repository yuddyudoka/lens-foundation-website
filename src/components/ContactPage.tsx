import { useEffect, useRef, useState } from "react";
import { getSiteImage } from "../data/cms";
import { submitSiteForm } from "../data/formSubmission";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const contactDetails = [
  {
    label: "Address",
    value: "Peter Oki Street, Lagos 105102, Nigeria",
    icon: "/assets/contact-address.svg",
    href: "https://maps.google.com/?q=Peter+Oki+Street+Lagos+105102+Nigeria",
  },
  {
    label: "E-mail Address",
    value: "Info@thelensfoundation.org",
    icon: "/assets/contact-email.svg",
    href: "mailto:Info@thelensfoundation.org",
  },
  {
    label: "Phone",
    value: "+234 909 644 5566",
    icon: "/assets/contact-phone.svg",
    href: "tel:+2349096445566",
  },
  {
    label: "Office hours",
    value: "Monday-Friday, 9:00am-5:00pm\nSaturday, 10:00am-2:00pm",
    icon: "/assets/contact-hours.svg",
  },
];

const subjectOptions = [
  { value: "general", label: "General enquiry" },
  { value: "volunteer", label: "Volunteering" },
  { value: "partnership", label: "Partnership" },
  { value: "donation", label: "Donation" },
  { value: "other", label: "Other" },
];

const calendlyUrl = "https://calendly.com/thelensfoundation/30min";

function RequiredMark() {
  return <span className="required-mark" aria-hidden="true">*</span>;
}

function ContactHero() {
  const image = getSiteImage("contact-hero");
  return (
    <section className="contact-hero" data-node-id="209:3298" aria-labelledby="contact-page-title">
      <img className="contact-hero-image" src={image.image} alt={image.alt} style={{ objectPosition: `${image.focalPoint.x}% ${image.focalPoint.y}%` }} />
      <div className="contact-hero-overlay" aria-hidden="true" />
      <div className="content-wrapper contact-hero-content">
        <p>~CONTACT US~</p>
        <h1 id="contact-page-title">We’d Love To Hear From You</h1>
      </div>
    </section>
  );
}

function ContactInformation() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const subjectSelectRef = useRef<HTMLDivElement>(null);
  const selectedSubject = subjectOptions.find((option) => option.value === subject);

  useEffect(() => {
    const closeSubjectSelect = (event: PointerEvent) => {
      if (!subjectSelectRef.current?.contains(event.target as Node)) setSubjectOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSubjectOpen(false);
    };

    document.addEventListener("pointerdown", closeSubjectSelect);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeSubjectSelect);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <section className="contact-information" data-node-id="208:1074" aria-labelledby="contact-form-title">
      <div className="content-wrapper contact-columns">
        <div className="contact-details">
          <div className="contact-section-heading">
            <p>Get In Touch</p>
            <h2>Visit, call, or write</h2>
          </div>
          <p className="contact-introduction">
            We welcome enquiries from families, volunteers, partners, members, and anyone who wants to learn more about the Lens Foundation. Reach out through any of the channels below and we’ll respond as soon as possible.
          </p>

          <div className="contact-detail-list">
            {contactDetails.map((detail) => {
              const content = (
                <>
                  <span className="contact-detail-icon"><img src={detail.icon} alt="" /></span>
                  <span className="contact-detail-copy">
                    <span>{detail.label}</span>
                    <strong>{detail.value}</strong>
                  </span>
                </>
              );

              return detail.href ? (
                <a className="contact-detail-row" href={detail.href} key={detail.label} target={detail.label === "Address" ? "_blank" : undefined} rel={detail.label === "Address" ? "noreferrer" : undefined}>
                  {content}
                </a>
              ) : (
                <div className="contact-detail-row" key={detail.label}>{content}</div>
              );
            })}
          </div>
        </div>

        <form
          className="contact-form"
          aria-labelledby="contact-form-title"
          onSubmit={async (event) => {
            event.preventDefault();
            if (submitting) return;
            if (!subject) {
              setSubjectError(true);
              setSubmitted(false);
              subjectSelectRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
              return;
            }
            setSubjectError(false);
            setSubmitting(true);
            setSubmitted(false);
            setSubmitError("");
            try {
              await submitSiteForm("contact", event.currentTarget);
              setSubmitted(true);
            } catch (cause) {
              setSubmitError(cause instanceof Error ? cause.message : "Your message could not be sent.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="contact-form-heading">
            <h2 id="contact-form-title">Send us a message</h2>
            <p>Complete the form and a member of our team will get back to you shortly.</p>
          </div>

          <div className="contact-form-row">
            <label className="contact-field">
              <span>Full name <RequiredMark /></span>
              <input name="fullName" type="text" autoComplete="name" placeholder="Your full name" required />
            </label>
            <label className="contact-field">
              <span>E-mail address <RequiredMark /></span>
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </label>
          </div>

          <div className="contact-field">
            <span id="contact-subject-label">Subject <RequiredMark /></span>
            <div className="contact-select" ref={subjectSelectRef}>
              <button
                className="contact-select-trigger"
                type="button"
                aria-labelledby="contact-subject-label contact-subject-value"
                aria-haspopup="listbox"
                aria-expanded={subjectOpen}
                aria-controls="contact-subject-options"
                aria-invalid={subjectError}
                aria-describedby={subjectError ? "contact-subject-error" : undefined}
                onClick={() => setSubjectOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setSubjectOpen(true);
                  }
                }}
              >
                <span id="contact-subject-value" data-placeholder={!selectedSubject}>{selectedSubject?.label ?? "Select a subject"}</span>
                <img src="/assets/contact-select-chevron.svg" alt="" aria-hidden="true" />
              </button>
              <div
                className="contact-select-options"
                id="contact-subject-options"
                role="listbox"
                aria-labelledby="contact-subject-label"
                data-open={subjectOpen}
              >
                {subjectOptions.map((option) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={subject === option.value}
                    key={option.value}
                    onClick={() => {
                      setSubject(option.value);
                      setSubjectError(false);
                      setSubjectOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <input type="hidden" name="subject" value={subject} />
            </div>
            {subjectError && <span className="contact-field-error" id="contact-subject-error">Please select a subject.</span>}
          </div>

          <label className="contact-field">
            <span>Message <RequiredMark /></span>
            <textarea name="message" placeholder="Write your message here..." required />
          </label>

          <button className="button button-primary contact-submit" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send Message"}</button>
          <p className="contact-consent">By submitting this form, you agree that we may use your details to respond to your enquiry.</p>
          {submitted && <p className="contact-form-status" role="status">Thank you. Your message has been received.</p>}
          {submitError && <p className="contact-form-status" role="alert">{submitError}</p>}
        </form>
      </div>
    </section>
  );
}

function CalendlySection() {
  return (
    <section className="calendly-section" data-node-id="283:1250" aria-labelledby="calendly-heading">
      <div className="content-wrapper calendly-layout">
        <div className="calendly-heading">
          <h2 id="calendly-heading">Want to know more about Lens?</h2>
          <p>Book a meeting with our team. We are happy to share more about our work, programmes, partnerships, and ways to get involved.</p>
        </div>
        <div className="calendly-booking">
          <iframe
            className="calendly-embed"
            src={`${calendlyUrl}?embed_type=Inline&hide_gdpr_banner=1`}
            title="Book a 30-minute meeting with Lens Foundation"
            loading="lazy"
            scrolling="no"
          />
          <p className="calendly-fallback">
            If the calendar does not appear, you can book directly on Calendly.
          </p>
          <a className="button button-primary calendly-link" href={calendlyUrl} target="_blank" rel="noreferrer">
            Open Calendly
          </a>
        </div>
      </div>
    </section>
  );
}

export function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="contact-page">
        <ContactHero />
        <ContactInformation />
        <CalendlySection />
      </main>
      <Footer />
    </>
  );
}
