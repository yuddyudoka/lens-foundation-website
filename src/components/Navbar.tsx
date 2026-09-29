import { List, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Lens Podium", href: "/lens-podium" },
];

const joinLinks = [
  { label: "Volunteer", href: "/volunteer" },
  { label: "Partner", href: "/partner" },
];

export function Navbar({ solid = false }: { solid?: boolean }) {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const joinActive = joinLinks.some((item) => isActive(item.href));
  const [menuOpen, setMenuOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [mobileJoinOpen, setMobileJoinOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const joinRef = useRef<HTMLDivElement>(null);
  const scrollSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = scrollSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeJoinMenu = (event: MouseEvent) => {
      if (!joinRef.current?.contains(event.target as Node)) setJoinOpen(false);
    };

    document.addEventListener("pointerdown", closeJoinMenu);
    return () => document.removeEventListener("pointerdown", closeJoinMenu);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <div ref={scrollSentinelRef} className="nav-scroll-sentinel" aria-hidden="true" />
      <header className={`site-header${scrolled ? " is-scrolled" : ""}${solid ? " is-solid" : ""}`} data-node-id="15:203">
      <div className="content-wrapper nav-layout">
        <a className="brand" href="/" aria-label="The Lens Foundation home">
          <img src="/assets/lens-logo.png" alt="The Lens Foundation" />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className={isActive(item.href) ? "nav-link-active" : undefined} aria-current={isActive(item.href) ? "page" : undefined}>
              {item.label}
            </a>
          ))}

          <div className="join-menu" ref={joinRef}>
            <button
              className={`join-trigger${joinActive ? " nav-link-active" : ""}`}
              type="button"
              aria-expanded={joinOpen}
              aria-controls="join-menu-options"
              onClick={() => setJoinOpen((open) => !open)}
            >
              Join Us
              <img src="/assets/chevron-down.svg" alt="" aria-hidden="true" />
            </button>

            <div
              id="join-menu-options"
              className="join-options"
              data-open={joinOpen}
            >
              {joinLinks.map((item) => (
                <a key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <a href="/contact" className={isActive("/contact") ? "nav-link-active" : undefined} aria-current={isActive("/contact") ? "page" : undefined}>Contact us</a>
        </nav>

        <a className="button button-primary nav-donate" href="#donate">
          Make a Donation
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={28} weight="regular" /> : <List size={30} weight="regular" />}
        </button>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation" data-open={menuOpen}>
        {navigation.map((item) => (
          <a key={item.href} href={item.href} className={isActive(item.href) ? "nav-link-active" : undefined} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}

        <div className="mobile-join-menu">
          <button
            className={`mobile-join-trigger${joinActive ? " nav-link-active" : ""}`}
            type="button"
            aria-expanded={mobileJoinOpen}
            aria-controls="mobile-join-options"
            onClick={() => setMobileJoinOpen((open) => !open)}
          >
            Join Us
            <img src="/assets/chevron-down.svg" alt="" aria-hidden="true" />
          </button>

          <div id="mobile-join-options" className="mobile-join-options" data-open={mobileJoinOpen}>
            {joinLinks.map((item) => (
              <a key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <a href="/contact" className={isActive("/contact") ? "nav-link-active" : undefined} aria-current={isActive("/contact") ? "page" : undefined} onClick={() => setMenuOpen(false)}>
          Contact us
        </a>
        <a className="button button-primary" href="#donate" onClick={() => setMenuOpen(false)}>
          Make a Donation
        </a>
      </nav>
      </header>
    </>
  );
}
