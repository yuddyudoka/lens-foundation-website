import { useEffect, useMemo, useRef, useState } from "react";

const missionStatement =
  "The Lens Foundation exists to support people and communities through education, essential resources, financial assistance, healthcare support, and outreach initiatives that respond to real needs.";

function mixChannel(from: number, to: number, amount: number) {
  return Math.round(from + (to - from) * amount);
}

function wordColor(amount: number) {
  const channel = mixChannel(204, 17, amount);
  return `rgb(${channel} ${channel} ${channel})`;
}

export function HomeMissionScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const words = useMemo(() => missionStatement.split(" "), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateProgress = () => {
      frame = 0;

      if (!desktopQuery.matches || reducedMotionQuery.matches) {
        setProgress(1);
        return;
      }

      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const nextProgress = Math.min(Math.max(-rect.top / travel, 0), 1);
      setProgress((current) => (Math.abs(current - nextProgress) > 0.002 ? nextProgress : current));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    desktopQuery.addEventListener("change", requestUpdate);
    reducedMotionQuery.addEventListener("change", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      desktopQuery.removeEventListener("change", requestUpdate);
      reducedMotionQuery.removeEventListener("change", requestUpdate);
    };
  }, []);

  const revealPosition = progress * (words.length + 2);

  return (
    <section ref={sectionRef} className="home-mission-scroll" aria-labelledby="home-mission-title">
      <div className="home-mission-sticky">
        <div className="content-wrapper home-mission-content">
          <p className="home-mission-eyebrow">About LENS Foundation</p>
          <h2 id="home-mission-title" className="home-mission-statement" aria-label={missionStatement}>
            <span aria-hidden="true">
              {words.map((word, index) => {
                const wordProgress = Math.min(Math.max(revealPosition - index, 0), 1);
                return (
                  <span className="home-mission-word" style={{ color: wordColor(wordProgress) }} key={`${word}-${index}`}>
                    {word}
                    {index < words.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </span>
          </h2>
          <a className="button button-primary home-mission-button" href="/about">
            Learn More About Us
          </a>
        </div>
      </div>
    </section>
  );
}
