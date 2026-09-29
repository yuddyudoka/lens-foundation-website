import { Hand, Lightbulb, Target } from "@phosphor-icons/react";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const programmePillars = [
  {
    title: "Discover your voice",
    description: "Build the courage to speak with clarity and self-belief.",
    icon: Lightbulb,
  },
  {
    title: "Shape it with purpose",
    description: "Turn clear ideas into stories and speeches that connect.",
    icon: Target,
  },
  {
    title: "Lead through expression",
    description: "Use communication to inspire change in your community.",
    icon: Hand,
  },
];

const outcomes = [
  "Build self-confidence and stage presence",
  "Speak clearly and confidently in public",
  "Shape ideas into purposeful stories and speeches",
  "Learn through mentorship, practice, and feedback",
  "Strengthen articulation, eye contact, and expression",
  "Use their voice to inspire meaningful change",
];

function PodiumHero() {
  return (
    <section className="podium-hero" data-node-id="243:3814" aria-labelledby="podium-page-title">
      <div className="content-wrapper podium-hero-content">
        <p>~LENS THE PODIUM~</p>
        <h1 id="podium-page-title">Giving teenagers a voice that leads</h1>
      </div>
    </section>
  );
}

function ProgrammeOverview() {
  return (
    <section className="podium-overview" data-node-id="240:1269" aria-labelledby="podium-overview-title">
      <div className="content-wrapper podium-overview-layout">
        <div className="podium-overview-intro">
          <header>
            <p>The Programme</p>
            <h2 id="podium-overview-title">Where young voices become confident leaders</h2>
          </header>
          <div className="podium-overview-copy">
            <p>LENS the Podium equips teenagers and young people to discover, shape, and project their voices with confidence and purpose.</p>
            <p>Through public speaking, mentorship, competitions, and storytelling, participants strengthen communication skills and grow into expressive leaders ready to influence their communities.</p>
          </div>
        </div>

        <div className="podium-pillars">
          {programmePillars.map(({ title, description, icon: Icon }) => (
            <article className="podium-pillar" key={title}>
              <span className="podium-pillar-icon" aria-hidden="true"><Icon size={22} /></span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgrammeDetails() {
  return (
    <section className="podium-details" data-node-id="509:1602" aria-label="Programme outcomes and training format">
      <div className="podium-detail-band podium-detail-band-soft">
        <div className="content-wrapper podium-detail-row">
          <div className="podium-visual podium-visual-flyer">
            <img src="/assets/podium-skills.png" alt="Teens public speaking and sign language bootcamp programme artwork" />
          </div>
          <div className="podium-detail-copy">
            <p className="podium-eyebrow">What Participants Will Gain</p>
            <h2>The confidence to speak, inspire &amp; lead with purpose</h2>
            <p>Every learning experience turns communication into a practical leadership skill.</p>
            <ol className="podium-outcomes">
              {outcomes.map((outcome, index) => (
                <li key={outcome}><span>{String(index + 1).padStart(2, "0")}</span>{outcome}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="podium-detail-band">
        <div className="content-wrapper podium-detail-row podium-detail-row-reverse">
          <div className="podium-detail-copy">
            <p className="podium-eyebrow">How the programme works</p>
            <h2>Built through learning, practice, mentorship &amp; storytelling</h2>
            <p>Participants develop their voices through a structured curriculum, guided mentorship, competitions, and storytelling that make learning active, practical, and memorable.</p>
            <dl className="podium-format-stats">
              <div><dt>3 months</dt><dd>Virtual training</dd></div>
              <div><dt>2 days</dt><dd>In-person experience</dd></div>
            </dl>
          </div>
          <div className="podium-visual podium-visual-training">
            <img src="/assets/podium-training.png" alt="Lens the Podium communication and leadership word cloud" />
          </div>
        </div>
      </div>
    </section>
  );
}

function InclusiveSection() {
  return (
    <section className="podium-inclusive" data-node-id="246:1337" aria-labelledby="podium-inclusive-title">
      <div className="content-wrapper podium-inclusive-layout">
        <img src="/assets/podium-inclusive.png" alt="Lens the Podium raised-fist microphone logo" />
        <div className="podium-inclusive-copy">
          <h2 id="podium-inclusive-title">Every young voice deserves room to grow.</h2>
          <p>LENS the Podium creates a supportive platform where teenagers discover, shape, and project their voices without fear. Each participant learns to communicate with confidence, lead with purpose, and inspire change.</p>
        </div>
      </div>
    </section>
  );
}

export function LensPodiumPage() {
  return (
    <>
      <Navbar solid />
      <main className="podium-page">
        <PodiumHero />
        <ProgrammeOverview />
        <ProgrammeDetails />
        <InclusiveSection />
        <FinalCta
          nodeId="243:3882"
          title="Help launch the voices that will lead in 2027"
          description="LENS the Podium launches in 2027. Support the first cohort, host a training session, mentor a young speaker, or partner with us to help teenagers prepare to speak, inspire, and lead."
          primaryLabel="Contact Us"
          primaryHref="/contact"
          secondaryLabel={null}
        />
      </main>
      <Footer />
    </>
  );
}
