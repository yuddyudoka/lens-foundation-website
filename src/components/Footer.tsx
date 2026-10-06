const siteMap = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Events", "/events"],
  ["Lens Podium", "/lens-podium"],
  ["Contact us", "/contact"],
];

const joinLinks = [
  ["Volunteer", "/volunteer"],
  ["Partner", "/partner"],
];

const socialLinks = [
  ["Instagram", "/assets/footer-instagram.svg", "https://www.instagram.com/thelensfoundationhq/"],
  ["TikTok", "/assets/footer-tiktok.svg", "https://www.tiktok.com/@lens.foundation?_r=1&_t=ZS-9A67ZgaSwNx"],
  ["X", "/assets/footer-x.svg", "https://x.com/Lens_Foundation"],
  ["YouTube", "/assets/footer-youtube.svg", "https://www.youtube.com/@LensFoundation"],
];

export function Footer() {
  return (
    <footer className="site-footer" data-node-id="139:1907">
      <div className="content-wrapper footer-layout">
        <div className="footer-main">
          <div className="footer-brand-column">
            <div className="footer-brand">
              <img src="/assets/footer-logo.png" alt="The Lens Foundation" />
              <p>
                Lens Foundation is committed to turning compassion into action by supporting children
                &amp; communities through outreach, and essential assistance.
              </p>
            </div>
            <nav className="footer-socials" aria-label="Social media">
              {socialLinks.map(([label, icon, href]) => (
                <a key={label} href={href} aria-label={label} target={href === "#" ? undefined : "_blank"} rel={href === "#" ? undefined : "noreferrer"}>
                  <img src={icon} alt="" />
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-links">
            <nav className="footer-link-group" aria-label="Site map">
              <p>Site Map</p>
              {siteMap.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
            </nav>

            <nav className="footer-link-group" aria-label="Join us">
              <p>Join us</p>
              {joinLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
            </nav>

            <div className="footer-contact">
              <p className="footer-group-label">Contact Info</p>
              <a href="mailto:Info@thelensfoundation.org">
                <img src="/assets/footer-email.svg" alt="" />
                <span>Info@thelensfoundation.org</span>
              </a>
              <a href="tel:+2349096445566">
                <img src="/assets/footer-phone.svg" alt="" />
                <span>+234-909-644-5566</span>
              </a>
              <a
                href="https://maps.google.com/?q=Peter+Oki+Street+Lagos+105102+Nigeria"
                target="_blank"
                rel="noreferrer"
                aria-label="Open Peter Oki Street, Lagos in Google Maps"
              >
                <img src="/assets/footer-location.svg" alt="" />
                <span>Peter Oki St, Lagos 105102, Lagos</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">© 2026 LENS Foundation</div>
      </div>
    </footer>
  );
}
