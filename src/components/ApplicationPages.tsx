import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { getSiteImage } from "../data/cms";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

type FieldProps = {
  label: string;
  name: string;
  optional?: boolean;
  multiline?: boolean;
  children?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>;

function RequiredMark() {
  return <span className="required-mark" aria-hidden="true">*</span>;
}

function Field({ label, name, optional = false, multiline = false, children, ...props }: FieldProps) {
  return (
    <label className={`application-field${multiline ? " application-field-wide" : ""}`}>
      <span>
        {label} {optional ? <span className="optional-label">(Optional)</span> : <RequiredMark />}
      </span>
      {children ?? (multiline ? (
        <textarea name={name} required={!optional} {...props} />
      ) : (
        <input name={name} required={!optional} {...props} />
      ))}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  optional?: boolean;
  placeholder: string;
  options: string[];
  value?: string;
  onValueChange?: (value: string) => void;
};

function SelectField({ label, name, optional = false, placeholder, options, value: controlledValue, onValueChange }: SelectFieldProps) {
  const [internalValue, setInternalValue] = useState("");
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const value = controlledValue ?? internalValue;

  const updateValue = (nextValue: string) => {
    if (controlledValue === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!selectRef.current?.contains(event.target as Node)) setOpen(false);
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
    <div className="application-field application-field-wide">
      <span>
        {label} {optional ? <span className="optional-label">(Optional)</span> : <RequiredMark />}
      </span>
      <div className="application-custom-select" ref={selectRef}>
        <button className="application-custom-trigger" type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
          <span className={value ? "" : "application-select-placeholder"}>{value || placeholder}</span>
          <img src="/assets/contact-select-chevron.svg" alt="" aria-hidden="true" />
        </button>
        <div className="application-custom-options" role="listbox" aria-label={label} data-open={open}>
          {options.map((option) => <button type="button" role="option" aria-selected={value === option} key={option} onClick={() => { updateValue(option); setOpen(false); }}>{option}</button>)}
        </div>
        <select className="application-custom-native" name={name} value={value} required={!optional} tabIndex={-1} onChange={(event) => updateValue(event.target.value)} onInvalid={() => setOpen(true)}>
          <option value="">{placeholder}</option>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
    </div>
  );
}

const birthMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function BirthdayField() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const monthIndex = birthMonths.indexOf(month);
  const daysInMonth = monthIndex < 0 ? 31 : new Date(2024, monthIndex + 1, 0).getDate();
  const dayOptions = Array.from({ length: daysInMonth }, (_, index) => String(index + 1));

  useEffect(() => {
    if (day && Number(day) > daysInMonth) setDay("");
  }, [day, daysInMonth]);

  return (
    <fieldset className="application-birthday">
      <legend>Date of Birth <RequiredMark /></legend>
      <p>Month and day only — your birth year is not required.</p>
      <div className="application-birthday-grid">
        <SelectField label="Month" name="birthMonth" placeholder="Select month" options={birthMonths} value={month} onValueChange={setMonth} />
        <SelectField label="Day" name="birthDay" placeholder="Select day" options={dayOptions} value={day} onValueChange={setDay} />
      </div>
    </fieldset>
  );
}

function SectionHeading({ number, total, title, description }: { number: string; total?: string; title: string; description: string }) {
  return (
    <div className="application-section-heading">
      <div className="application-section-title">
        <span>{total ? `${number} / ${total}` : number}</span>
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  );
}

function ApplicationHero({
  eyebrow,
  title,
  image,
  imageClass,
  nodeId,
  imageId,
}: {
  eyebrow: string;
  title: string;
  image: string;
  imageClass: string;
  nodeId: string;
  imageId: string;
}) {
  const managedImage = getSiteImage(imageId);
  return (
    <section className="application-hero" data-node-id={nodeId} aria-labelledby={`${imageClass}-title`}>
      <img className={`application-hero-image ${imageClass}`} src={managedImage?.image ?? image} alt={managedImage?.alt ?? "Lens Foundation community outreach participants"} style={{ objectPosition: `${managedImage?.focalPoint.x ?? 50}% ${managedImage?.focalPoint.y ?? 50}%` }} />
      <div className="application-hero-overlay" aria-hidden="true" />
      <div className="content-wrapper application-hero-content">
        <p>{eyebrow}</p>
        <h1 id={`${imageClass}-title`}>{title}</h1>
      </div>
    </section>
  );
}

function SubmitArea({ submitted }: { submitted: boolean }) {
  return (
    <div className="application-submit-area">
      <button className="button button-primary application-submit" type="submit">Submit application</button>
      <p>Questions before applying? <a href="/contact">Contact The Lens Foundation</a> team for guidance.</p>
      {submitted && <p className="application-form-status" role="status">Thank you. Your application is ready to be connected to the form service.</p>}
    </div>
  );
}

function VolunteerForm() {
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="application-form-section volunteer-form-section" data-node-id="171:588" aria-labelledby="volunteer-form-title">
      <form className="application-form" onSubmit={submit}>
        <div className="application-form-intro">
          <h2 id="volunteer-form-title">Volunteer application</h2>
          <p>Volunteer with The Lens Foundation by sharing your time, skills, and experience through one of our chapters.</p>
        </div>

        <section className="application-group">
          <SectionHeading number="01" total="04" title="Personal information" description="Tell us who you are and how we can reach you." />
          <div className="application-grid">
            <Field label="First Name" name="firstName" autoComplete="given-name" placeholder="Enter your answer" />
            <Field label="Surname" name="surname" autoComplete="family-name" placeholder="Enter your answer" />
            <Field label="Email" name="email" type="email" autoComplete="email" placeholder="Enter your answer" />
            <SelectField label="Sex" name="sex" placeholder="Select an option" options={["Female", "Male", "Prefer not to say"]} />
            <BirthdayField />
            <Field label="Nationality" name="nationality" autoComplete="country-name" placeholder="Enter your answer" />
            <Field label="Current Location" name="currentLocation" autoComplete="address-level1" placeholder="City, state, or country" />
            <Field label="Phone Number" name="phone" type="tel" autoComplete="tel" placeholder="Enter your answer" />
          </div>
          <SelectField label="Preferred Chapter" name="preferredChapter" placeholder="Select a chapter" options={["Lagos", "Ghana", "USA", "London"]} />
        </section>

        <section className="application-group">
          <SectionHeading number="02" total="04" title="Background" description="Share a little about your education, work, and interests." />
          <div className="application-grid">
            <Field label="Highest Level of Education" name="education" placeholder="Enter your answer" />
            <Field label="Profession" name="profession" placeholder="Enter your answer" />
          </div>
        </section>

        <section className="application-group">
          <SectionHeading number="03" total="04" title="Volunteer experience" description="Tell us about any previous volunteer or organisational involvement." />
          <div className="application-grid">
            <Field label="Previous Organization" name="previousOrganization" optional placeholder="Enter your answer" />
          </div>
        </section>

        <section className="application-group">
          <SectionHeading number="04" total="04" title="Your motivation" description="Help us understand how you found us and what you hope to contribute." />
          <Field
            label="How do you think you can contribute to the growth of the organization?"
            name="contribution"
            multiline
            placeholder="Write a short response"
          />
          <fieldset className="application-choices">
            <legend>How did you hear about us? <span className="optional-label">(Optional)</span></legend>
            <div>
              {['From a member', 'Social Media', 'Website', 'Others'].map((option) => (
                <label key={option}><input type="checkbox" name="heardFrom" value={option} /><span>{option}</span></label>
              ))}
            </div>
          </fieldset>
        </section>

        <SubmitArea submitted={submitted} />
      </form>
    </section>
  );
}

function PartnerForm() {
  const [partnerType, setPartnerType] = useState<"organization" | "individual">("organization");
  const [partnerTypeOpen, setPartnerTypeOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const partnerTypeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!partnerTypeRef.current?.contains(event.target as Node)) setPartnerTypeOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPartnerTypeOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="application-form-section partner-form-section" data-node-id="171:410" aria-labelledby="partner-form-title">
      <form className="application-form" onSubmit={submit}>
        <div className="application-form-intro">
          <h2 id="partner-form-title">Partnership application</h2>
          <p>Apply as an organization or individual and tell us how we can reach you, what you do, and how you would like to connect with The Lens Foundation.</p>
        </div>

        <section className="application-group">
          <SectionHeading number="01" total="02" title="Partner profile" description="Choose the option that best describes you and share your basic information." />
          <div className="application-field application-field-wide partner-type-field">
            <span id="partner-type-label">Partner type <RequiredMark /></span>
            <div className="application-custom-select" ref={partnerTypeRef}>
              <button
                className="application-custom-trigger"
                type="button"
                aria-labelledby="partner-type-label partner-type-value"
                aria-haspopup="listbox"
                aria-expanded={partnerTypeOpen}
                aria-controls="partner-type-options"
                onClick={() => setPartnerTypeOpen((open) => !open)}
              >
                <span id="partner-type-value">{partnerType === "organization" ? "Organization" : "Individual"}</span>
                <img src="/assets/contact-select-chevron.svg" alt="" aria-hidden="true" />
              </button>
              <div className="application-custom-options" id="partner-type-options" role="listbox" aria-labelledby="partner-type-label" data-open={partnerTypeOpen}>
                {(["organization", "individual"] as const).map((type) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={partnerType === type}
                    key={type}
                    onClick={() => {
                      setPartnerType(type);
                      setPartnerTypeOpen(false);
                    }}
                  >
                    {type === "organization" ? "Organization" : "Individual"}
                  </button>
                ))}
              </div>
            </div>
            <input type="hidden" name="partnerType" value={partnerType} />
          </div>
          <div className="application-grid">
            <Field label="Representative / Full Name" name="fullName" autoComplete="name" placeholder="Enter a full name" />
            <Field label="Email Address" name="email" type="email" autoComplete="email" placeholder="Enter an email address" />
            <Field label="Phone Number" name="phone" type="tel" autoComplete="tel" placeholder="Enter a phone number" />
            <Field label="Location" name="location" autoComplete="address-level1" placeholder="City, state, or country" />
          </div>
          {partnerType === "organization" && (
            <Field label="About your organization" name="aboutOrganization" multiline placeholder="Tell us what your organization does" />
          )}
        </section>

        <section className="application-group">
          <SectionHeading number="02" total="02" title="Contact preferences" description="Let us know the best way and time to continue the conversation." />
          <div className="application-grid">
            <SelectField label="Preferred Mode of Contact" name="contactMode" placeholder="Select a contact method" options={["Email", "Phone call", "WhatsApp"]} />
            <SelectField label="Preferred Time of Contact" name="contactTime" optional placeholder="Select a preferred time" options={["Morning", "Afternoon", "Evening"]} />
          </div>
          <Field label="How did you hear about Lens Foundation?" name="heardFrom" placeholder="Select or enter your answer" />
          <Field label="Additional Message" name="message" optional multiline placeholder="Share anything else you would like us to know" />
        </section>

        <SubmitArea submitted={submitted} />
      </form>
    </section>
  );
}

export function VolunteerPage() {
  return (
    <>
      <Navbar />
      <main className="application-page">
        <ApplicationHero
          eyebrow="~VOLUNTEER~"
          title="Give your time. Help turn compassion into action."
          image="/assets/volunteer-hero.png"
          imageId="volunteer-hero"
          imageClass="volunteer-hero-image"
          nodeId="201:2960"
        />
        <VolunteerForm />
      </main>
      <Footer />
    </>
  );
}

export function PartnerPage() {
  return (
    <>
      <Navbar />
      <main className="application-page">
        <ApplicationHero
          eyebrow="~PARTNERSHIP~"
          title="Bring your resources closer to real community needs."
          image="/assets/partner-hero.png"
          imageId="partner-hero"
          imageClass="partner-hero-image"
          nodeId="201:2929"
        />
        <PartnerForm />
      </main>
      <Footer />
    </>
  );
}
