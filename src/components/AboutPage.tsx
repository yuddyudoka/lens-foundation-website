import { Footer } from "./Footer";
import { FinalCta } from "./FinalCta";
import { Navbar } from "./Navbar";

function AboutHero() {
  return (
    <section className="about-hero" data-node-id="124:64" aria-labelledby="about-page-title">
      <img className="about-hero-image" src="/assets/events-page-hero.png" alt="Lens Foundation volunteers standing together" />
      <div className="about-hero-overlay" aria-hidden="true" />
      <div className="content-wrapper about-hero-content">
        <p>~ABOUT US~</p>
        <h1 id="about-page-title">Leading with Compassion. Supporting Brighter Tomorrows</h1>
      </div>
    </section>
  );
}

function OurStoryVideo() {
  return (
    <section className="about-story" data-node-id="124:82" aria-labelledby="about-story-title">
      <div className="content-wrapper about-story-layout">
        <header className="about-section-heading">
          <p>Our story</p>
          <h2 id="about-story-title">How compassion grew into shared action</h2>
        </header>
        <div className="about-video-frame">
          <iframe
            src="https://www.youtube.com/embed/-9kt-4WqOD0?si=W4dpog0RmfuOhm2b"
            title="The Lens Foundation story"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function MissionAndVision() {
  return (
    <section className="about-purpose" data-node-id="139:1715" aria-label="Our mission and vision">
      <div className="content-wrapper about-purpose-layout">
        <div className="about-purpose-row about-purpose-mission">
          <div className="about-purpose-copy">
            <h2>Our Mission</h2>
            <p>
              Our mission is to lead, empower, nurture, and support communities through financial assistance,
              essential resources, mentorship, advocacy, and practical care, ensuring families can move toward
              more secure and fulfilling lives.
            </p>
          </div>
          <figure className="about-purpose-media">
            <img src="/assets/impact-outreach.jpg" alt="Lens Foundation volunteers preparing outreach supplies" />
          </figure>
        </div>

        <div className="about-purpose-row about-purpose-vision">
          <figure className="about-purpose-media">
            <img src="/assets/impact-community.jpg" alt="Lens Foundation volunteers with school children" />
          </figure>
          <div className="about-purpose-copy">
            <h2>Our Vision</h2>
            <p>
              We envision communities where daily concerns and financial challenges are met with empathy,
              timely support, and lasting solutions, giving individuals and families the opportunity to build
              brighter, more stable, and fulfilling futures.
            </p>
            <div className="about-purpose-actions">
              <a className="button button-primary" href="#donate">Make a Donation</a>
              <a className="button button-outline-dark" href="/volunteer">Become a Volunteer</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const coreValues = [
  {
    number: "01",
    title: "Empathy",
    description: "We understand others’ feelings, allowing genuine compassion and empathy to shape every action we take.",
  },
  {
    number: "02",
    title: "Integrity",
    description: "We uphold honesty, transparency, and ethical conduct, earning the trust and confidence of our communities and stakeholders.",
  },
  {
    number: "03",
    title: "Inclusivity",
    description: "We embrace diversity, ensuring every person, regardless of background or circumstance, is valued, respected, welcomed, and supported.",
  },
  {
    number: "04",
    title: "Generosity",
    description: "We give our time, resources, and support generously, creating practical opportunities for people facing difficult circumstances.",
  },
  {
    number: "05",
    title: "Nurturing",
    description: "We provide care, mentorship, counselling, and encouragement that help people grow, develop, and succeed confidently.",
  },
  {
    number: "06",
    title: "Collaboration",
    description: "We work with individuals, organisations, and communities to achieve shared goals and meaningful change.",
  },
];

function CoreValues() {
  return (
    <section className="about-values" data-node-id="124:106" aria-labelledby="about-values-title">
      <div className="content-wrapper about-values-layout">
        <header className="about-section-heading">
          <p>What guides us</p>
          <h2 id="about-values-title">Values that guide every act of support</h2>
        </header>

        <div className="about-values-grid">
          {coreValues.map((value) => (
            <article className="about-value-card" key={value.number}>
              <span>{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderMessage() {
  return (
    <section className="about-founder" data-node-id="124:130" aria-labelledby="about-founder-title">
      <div className="content-wrapper about-founder-layout">
        <img className="about-founder-portrait" src="/assets/team-omobolanle-sodiya.jpg" alt="Omobolanle Sodiya, Founding Director of The Lens Foundation" />
        <div className="about-founder-copy">
          <p className="about-founder-kicker">A message from the founder</p>
          <h2 id="about-founder-title">A shared concern became a promise to serve with compassion</h2>
          <p>
            The Lens Foundation began with Omobolanle Sodiya’s concern for vulnerable people and a simple
            conviction: compassion must become practical help for those facing hunger, hardship, and limited
            opportunity.
          </p>
          <p>
            What started through friends pooling resources now grows through donors, sponsors, volunteers,
            and partners who believe every person deserves hope, dignity, care, and opportunity.
          </p>
          <p className="about-founder-signature">Omobolanle Sodiya · Founding Director</p>
        </div>
      </div>
    </section>
  );
}

function CommunityImpactOrganogram() {
  return (
    <section className="about-organogram" data-node-id="506:1569" aria-labelledby="about-organogram-title">
      <div className="content-wrapper about-organogram-layout">
        <header className="about-organogram-heading">
          <p>How impact flows</p>
          <h2 id="about-organogram-title">A connected structure for accountable community impact</h2>
          <p>
            Our foundation aligns direction, partners, initiatives, and community projects to create measurable results and report them transparently.
          </p>
        </header>
        <a
          className="about-organogram-image-link"
          href="/assets/lens-foundation-organogram.png"
          target="_blank"
          rel="noreferrer"
          aria-label="Open the Lens Foundation community impact organogram at full resolution"
        >
          <img
            className="about-organogram-image"
            src="/assets/lens-foundation-organogram.png"
            alt="Lens Foundation community impact organogram showing vision and direction, community beneficiaries, partners and supporters, initiatives, projects, results, and accountability"
            loading="lazy"
            width="4224"
            height="2064"
          />
        </a>
      </div>
    </section>
  );
}

const teamMembers = [
  { name: "Omobolanle Sodiya", role: "Founding Director", image: "/assets/team-omobolanle-sodiya.jpg" },
  { name: "Ayobami Johnson", role: "Director of Operations", image: "/assets/team-ayobami-johnson.jpg" },
  { name: "Joy Dada", role: "Head of Admin", image: "/assets/team-joy-dada.png" },
  { name: "Michael Gbademu", role: "Team Lead — Volunteers", image: "/assets/team-michael-gbademu.png" },
];

function OurTeam() {
  return (
    <section className="about-team" data-node-id="124:172" aria-labelledby="about-team-title">
      <div className="content-wrapper about-team-layout">
        <header className="about-section-heading">
          <p>The people behind the work</p>
          <h2 id="about-team-title">Meet our team</h2>
        </header>

        <div className="about-team-grid">
          {teamMembers.map((member, index) => (
            <article className="about-team-card" key={`${member.name}-${index}`}>
              <img className="about-team-photo" src={member.image} alt={`${member.name}, ${member.role}`} loading="lazy" />
              <div className="about-team-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="about-page">
        <AboutHero />
        <OurStoryVideo />
        <MissionAndVision />
        <CoreValues />
        <FounderMessage />
        <CommunityImpactOrganogram />
        <OurTeam />
        <FinalCta nodeId="139:2010" />
      </main>
      <Footer />
    </>
  );
}
