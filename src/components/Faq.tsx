import { useState } from "react";
import { getFaqs, type FaqRecord } from "../data/cms";

export function Faq({ page = "Home", title = "Questions You May Have, Answered" }: { page?: FaqRecord["page"]; title?: string }) {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = getFaqs().filter((faq) => faq.page === page && faq.status === "Published");
  const sectionId = `faq-${page.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section className="faq-section" aria-labelledby={`${sectionId}-title`} data-node-id="73:1234">
      <div className="content-wrapper faq-layout">
        <header className="section-heading faq-heading">
          <p>FAQs</p>
          <h2 id={`${sectionId}-title`}>{title}</h2>
        </header>

        <div className="faq-content">
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const answerId = `${sectionId}-answer-${index}`;

              return (
                <article className="faq-item" data-open={isOpen} key={`${faq.question}-${index}`}>
                  <button
                    className="faq-question"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <img src="/assets/contact-select-chevron.svg" alt="" />
                    </span>
                  </button>
                  <div className="faq-answer-wrap" id={answerId} aria-hidden={!isOpen}>
                    <p>{faq.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="faq-contact">
            <div>
              <h3>Still have a question in mind?</h3>
              <p>Contact us if you have any other questions.</p>
            </div>
            <a className="button button-primary faq-contact-button" href="/contact">Contact Us</a>
          </aside>
        </div>
      </div>
    </section>
  );
}
