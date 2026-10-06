import { useEffect, useRef, useState } from "react";

type LensValue = {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
};

const values: LensValue[] = [
  {
    number: "01",
    title: "L - Leadership",
    description:
      "Developing confident, purpose-driven young people with the knowledge, skills and opportunities to lead.",
    image: "/assets/lens-summary/leadership.webp",
    imageAlt: "A Lens Foundation volunteer wearing a green shirt and giving a thumbs-up",
    imagePosition: "center 23%",
  },
  {
    number: "02",
    title: "E - Empowerment",
    description:
      "Equipping individuals with practical resources and opportunities to build sustainable livelihoods.",
    image: "/assets/lens-summary/empowerment.webp",
    imageAlt: "People gathering around community enterprise stalls at a Lens Foundation event",
    imagePosition: "center center",
  },
  {
    number: "03",
    title: "N - Nurturing",
    description:
      "Investing in education, health and long-term development so individuals can grow and thrive.",
    image: "/assets/lens-summary/nurturing.webp",
    imageAlt: "Lens Foundation team members standing together in white shirts and green caps",
    imagePosition: "center center",
  },
  {
    number: "04",
    title: "S - Supporting",
    description:
      "Responding to immediate needs through direct assistance, community outreach and compassionate support.",
    image: "/assets/lens-summary/supporting.webp",
    imageAlt: "Lens Foundation volunteers standing with a community member",
    imagePosition: "center 8%",
  },
];

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

export function LensValuesJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const [showImages, setShowImages] = useState(() => window.matchMedia("(min-width: 901px)").matches);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const handleBreakpointChange = () => setShowImages(desktopQuery.matches);
    desktopQuery.addEventListener("change", handleBreakpointChange);
    return () => desktopQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const steps = Array.from(section.querySelectorAll<HTMLElement>(".lens-values-step"));
    const rail = section.querySelector<HTMLElement>(".lens-values-rail");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const sectionRect = section.getBoundingClientRect();
      const viewportFocus = viewportHeight * 0.5;
      const paletteIsActive = sectionRect.top <= viewportFocus && sectionRect.bottom >= viewportFocus;

      if (reducedMotionQuery.matches) {
        section.dataset.paletteActive = paletteIsActive ? "true" : "false";
        section.style.setProperty("--timeline-progress", "1");
        steps.forEach((step) => step.style.setProperty("--step-reveal", "1"));
        section.dataset.motionReady = "true";
        return;
      }

      const railRect = rail?.getBoundingClientRect();
      const timelineProgress = railRect
        ? clamp((viewportFocus - railRect.top) / Math.max(railRect.height, 1))
        : 0;
      const stepReveals = steps.map((step) => {
        const stepRect = step.getBoundingClientRect();
        return clamp((viewportHeight * 0.88 - stepRect.top) / (viewportHeight * 0.42));
      });

      section.dataset.paletteActive = paletteIsActive ? "true" : "false";
      section.style.setProperty("--timeline-progress", timelineProgress.toFixed(4));

      steps.forEach((step, index) => {
        step.style.setProperty("--step-reveal", stepReveals[index].toFixed(4));
      });

      section.dataset.motionReady = "true";
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotionQuery.addEventListener("change", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotionQuery.removeEventListener("change", requestUpdate);
    };
  }, []);

  return (
    <section ref={sectionRef} className="lens-values-journey" aria-label="How LENS Foundation creates impact">
      <div className="content-wrapper lens-values-inner">
        <div className="lens-values-rail" aria-hidden="true">
          <span />
        </div>

        <ol className="lens-values-list">
          {values.map((value, index) => (
            <li className="lens-values-step" key={value.number}>
              {showImages ? (
                <div className="lens-values-image-wrap">
                  <img
                    src={value.image}
                    alt={value.imageAlt}
                    width="1060"
                    height="644"
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: value.imagePosition }}
                  />
                </div>
              ) : null}

              <div className="lens-values-marker" aria-hidden="true">
                {value.number}
              </div>

              <div className="lens-values-copy">
                <h2>{value.title}</h2>
                <p>{value.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
