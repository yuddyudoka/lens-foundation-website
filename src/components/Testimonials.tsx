import { getTestimonials } from "../data/cms";

export function Testimonials() {
  const testimonials = getTestimonials().filter((testimonial) => testimonial.status === "Published");
  const renderTestimonials = (duplicate = false) => (
    <div className="testimonials-set" aria-hidden={duplicate || undefined}>
      {testimonials.map((testimonial) => (
        <article className="testimonial-card" key={`${duplicate ? "duplicate-" : ""}${testimonial.name}`}>
          <blockquote>“{testimonial.quote}”</blockquote>
          <footer className="testimonial-person">
            <img src={testimonial.image} alt="" loading="lazy" style={{ objectPosition: `${testimonial.focalPoint?.x ?? 50}% ${testimonial.focalPoint?.y ?? 50}%` }} />
            <div>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
            </div>
          </footer>
        </article>
      ))}
    </div>
  );

  return (
    <section className="testimonials" aria-labelledby="testimonials-title" data-node-id="52:890">
      <div className="content-wrapper testimonials-layout">
        <header className="section-heading testimonials-heading">
          <p>Testimonials</p>
          <h2 id="testimonials-title">Real Stories. Real Impact. Real Lives Changed.</h2>
        </header>

        <div className="testimonials-viewport" aria-label="Testimonials carousel">
          <div className="testimonials-track">
            {renderTestimonials()}
            {renderTestimonials(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
