const paleOpportunities = [
  "Support the Lagos Literacy Festival 2026",
  "Join the Abuja Health Fair 2026",
  "Participate in the Port Harcourt Clean-Up Day 2026",
  "Attend the Kano Youth Empowerment Workshop 2026",
  "Contribute to the Ibadan Food Security Initiative 2026",
  "Be part of the Enugu Arts and Culture Showcase 2026",
];

const blueOpportunities = [
  "Help with the Kaduna Community Health Outreach 2026",
  "Engage in the Owerri Sports for All Festival 2026",
  "Volunteer for the Jos Environmental Awareness Campaign 2026",
  "SDG 1: Support the Benin City Women’s Empowerment Summit 2026",
  "Join the Akure Children's Day Celebration 2026",
  "Participate in the Uyo Mental Health Awareness Walk 2026",
];

function MarqueeSequence({ items, star }: { items: string[]; star: string }) {
  return (
    <div className="marquee-sequence" aria-hidden="true">
      {items.map((item) => (
        <div className="marquee-item" key={item}>
          <span>{item}</span>
          <img src={star} alt="" />
        </div>
      ))}
    </div>
  );
}

export function OpportunitiesMarquee() {
  return (
    <section className="opportunities-marquee" aria-label="Ways to participate" data-node-id="31:639">
      <div className="marquee-band marquee-band-pale">
        <div className="marquee-track marquee-track-forward">
          <MarqueeSequence items={paleOpportunities} star="/assets/marquee-star-blue.svg" />
          <MarqueeSequence items={paleOpportunities} star="/assets/marquee-star-blue.svg" />
        </div>
      </div>
      <div className="marquee-band marquee-band-blue">
        <div className="marquee-track marquee-track-reverse">
          <MarqueeSequence items={blueOpportunities} star="/assets/marquee-star-white.svg" />
          <MarqueeSequence items={blueOpportunities} star="/assets/marquee-star-white.svg" />
        </div>
      </div>
    </section>
  );
}
