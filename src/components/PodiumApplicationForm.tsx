import { useState, type FormEvent } from "react";
import { submitSiteForm } from "../data/formSubmission";
import { Field, SectionHeading, SelectField } from "./ApplicationPages";

const gradeOptions = [
  "Primary school",
  "Junior secondary school",
  "Senior secondary school",
  "Sixth form or college",
  "University",
  "Other",
];

export function PodiumApplicationForm() {
  const [age, setAge] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const isMinor = age !== "" && Number(age) < 18;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitted(false);
    setError("");
    try {
      await submitSiteForm("podium", event.currentTarget);
      setSubmitted(true);
      event.currentTarget.reset();
      setAge("");
      setGradeLevel("");
      setPreviousExperience("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Your application could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="application-form-section podium-application-section" id="podium-application" aria-labelledby="podium-application-title">
      <form className="application-form podium-application-form" onSubmit={submit}>
        <header className="application-form-intro">
          <h2 id="podium-application-title">Apply for LENS the Podium</h2>
          <p>Applications are open to young people aged 11–19. Use an email address that is checked regularly, as all programme correspondence will be sent there.</p>
        </header>

        <section className="application-group">
          <SectionHeading number="01" total="04" title="Participant details" description="Tell us who is applying and how we can contact them or their guardian." />
          <div className="application-grid">
            <Field label="Participant’s full name" name="fullName" placeholder="Enter full name" autoComplete="name" maxLength={120} />
            <Field label="Age" name="age" type="number" min={11} max={19} inputMode="numeric" placeholder="11–19" value={age} onChange={(event) => setAge(event.target.value)} />
            <SelectField label="Gender" name="gender" placeholder="Select gender" options={["Female", "Male", "Prefer not to say"]} />
            <SelectField label="Current grade or level" name="gradeLevel" placeholder="Select current level" options={gradeOptions} value={gradeLevel} onValueChange={setGradeLevel} />
            {gradeLevel === "University" && <Field label="University or school" name="school" placeholder="Enter school name" maxLength={160} />}
            <Field label="Participant or guardian email" name="email" type="email" placeholder="name@example.com" autoComplete="email" maxLength={160} />
          </div>

          {isMinor && (
            <div className="podium-guardian-fields">
              <h3>Guardian details</h3>
              <p>Because the participant is under 18, a parent or legal guardian must provide their details and consent.</p>
              <div className="application-grid">
                <Field label="Guardian’s full name" name="guardianName" placeholder="Enter full name" autoComplete="name" maxLength={120} />
                <Field label="Guardian’s email" name="guardianEmail" type="email" placeholder="guardian@example.com" autoComplete="email" maxLength={160} />
                <Field label="Guardian’s phone number" name="guardianPhone" type="tel" placeholder="e.g. +234 800 000 0000" autoComplete="tel" maxLength={30} />
              </div>
            </div>
          )}
        </section>

        <section className="application-group">
          <SectionHeading number="02" total="04" title="Tell us about yourself" description="There are no perfect answers. We want to understand your interests, motivation, and experience." />
          <div className="application-grid">
            <Field label="Tell us about yourself" name="aboutYourself" multiline placeholder="Share a little about yourself, your interests, and what matters to you." maxLength={1500} />
            <Field label="Why would you like to participate in LENS the Podium?" name="motivation" multiline placeholder="Tell us what you hope to learn or achieve." maxLength={1500} />
            <SelectField label="Have you participated in public speaking, debate, or a similar activity before?" name="previousSpeakingExperience" placeholder="Select an answer" options={["Yes", "No"]} value={previousExperience} onValueChange={setPreviousExperience} />
            {previousExperience === "Yes" && <Field label="Tell us about that experience" name="speakingDetails" optional multiline placeholder="What did you take part in?" maxLength={1200} />}
          </div>
        </section>

        <section className="application-group">
          <SectionHeading number="03" total="04" title="Consent" description="Please review each statement before confirming consent." />
          <div className="podium-consent-list">
            {isMinor && (
              <label className="podium-consent-card">
                <input type="checkbox" name="guardianConsent" value="Confirmed" required />
                <span><strong>Parent or guardian consent</strong>I confirm that I am the legal guardian of the participant named above and give permission for them to apply to and, if selected, participate in LENS the Podium.</span>
              </label>
            )}
            <label className="podium-consent-card">
              <input type="checkbox" name="mediaConsent" value="Granted" required />
              <span><strong>Media consent</strong>I give permission for approved photographs, video recordings, and interviews of the participant to be used by Lens Foundation in connection with LENS the Podium, including on its website and official communications.</span>
            </label>
          </div>
        </section>

        <section className="application-group">
          <SectionHeading number="04" total="04" title="Anything else?" description="Add any other information you would like the Lens Foundation team to know." />
          <Field label="Additional information" name="additionalInformation" optional multiline placeholder="Share anything else that may help us understand your application." maxLength={1500} />
        </section>

        <div className="application-submit-area">
          <button className="button button-primary application-submit" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Submit application"}</button>
          <p>Questions before applying? <a href="/contact">Contact The Lens Foundation</a> team for guidance.</p>
          {submitted && <p className="application-form-status" role="status">Thank you. Your LENS the Podium application has been received.</p>}
          {error && <p className="application-form-status" role="alert">{error}</p>}
        </div>
      </form>
    </section>
  );
}
