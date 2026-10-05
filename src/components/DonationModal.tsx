import { Check, Copy, CreditCard, X } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

type AccountCurrency = "Naira" | "USD";

const accounts: Array<{ currency: AccountCurrency; number: string }> = [
  { currency: "Naira", number: "2460039090" },
  { currency: "USD", number: "2460039337" },
];

const paystackPaymentUrl = "https://paystack.shop/pay/aazyerd82w";

export function DonationModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<AccountCurrency | null>(null);
  const [scrollbar, setScrollbar] = useState({ visible: false, height: 0, top: 0 });
  const titleId = useId();
  const descriptionId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const copiedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const openDonationModal = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const trigger = target?.closest<HTMLElement>("a[href$='#donate'], [data-donation-trigger]");
      if (!trigger) return;

      event.preventDefault();
      openerRef.current = trigger;
      setOpen(true);
    };

    document.addEventListener("click", openDonationModal);
    return () => document.removeEventListener("click", openDonationModal);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
        ),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      openerRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open || !scrollRef.current) return;

    const scroller = scrollRef.current;
    const updateScrollbar = () => {
      const visible = scroller.scrollHeight > scroller.clientHeight + 1;
      const trackHeight = Math.max(scroller.clientHeight - 32, 0);
      const height = visible ? Math.max((scroller.clientHeight / scroller.scrollHeight) * trackHeight, 56) : 0;
      const maxScroll = Math.max(scroller.scrollHeight - scroller.clientHeight, 1);
      const maxTop = Math.max(trackHeight - height, 0);
      const top = visible ? (scroller.scrollTop / maxScroll) * maxTop : 0;
      setScrollbar({ visible, height, top });
    };

    updateScrollbar();
    const observer = new ResizeObserver(updateScrollbar);
    observer.observe(scroller);
    Array.from(scroller.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => () => {
    if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current);
  }, []);

  const closeModal = () => {
    setOpen(false);
    setCopied(null);
  };

  const copyAccountNumber = async (currency: AccountCurrency, number: string) => {
    try {
      await navigator.clipboard.writeText(number);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = number;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }

    setCopied(currency);
    if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = window.setTimeout(() => setCopied(null), 2200);
  };

  if (!open) return null;

  return (
    <div
      className="donation-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        ref={modalRef}
        className="donation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-node-id="285:1250"
      >
        <div ref={scrollRef} className="donation-modal-scroll" onScroll={() => {
          const scroller = scrollRef.current;
          if (!scroller || !scrollbar.visible) return;
          const trackHeight = Math.max(scroller.clientHeight - 32, 0);
          const maxScroll = Math.max(scroller.scrollHeight - scroller.clientHeight, 1);
          const maxTop = Math.max(trackHeight - scrollbar.height, 0);
          setScrollbar((current) => ({ ...current, top: (scroller.scrollTop / maxScroll) * maxTop }));
        }}>
          <header className="donation-modal-header">
          <h2 id={titleId}>Make a donation</h2>
          <button ref={closeButtonRef} className="donation-modal-close" type="button" onClick={closeModal} aria-label="Close donation options">
            <X size={20} weight="regular" aria-hidden="true" />
          </button>
          </header>

          <p id={descriptionId} className="donation-modal-intro">
          Choose the donation option that works best for you. Every contribution helps us reach more children and communities.
          </p>

          <section className="donation-bank-card" aria-labelledby="bank-transfer-title">
          <div className="donation-bank-meta">
            <p className="donation-card-label">Bank transfer</p>
            <div className="donation-bank-heading-row">
              <h3 id="bank-transfer-title">EcoBank</h3>
              <p>Account Name: <strong>Lens Foundation</strong></p>
            </div>
          </div>

          <div className="donation-account-list">
            {accounts.map((account) => {
              const isCopied = copied === account.currency;
              return (
                <div className="donation-account-row" key={account.currency}>
                  <p><span>{account.currency}</span><span aria-hidden="true">•</span><strong>{account.number}</strong></p>
                  <button
                    className="donation-copy-button"
                    data-copied={isCopied}
                    type="button"
                    onClick={() => copyAccountNumber(account.currency, account.number)}
                    aria-label={`${isCopied ? "Copied" : "Copy"} ${account.currency} account number ${account.number}`}
                  >
                    {isCopied ? <Check size={18} weight="bold" aria-hidden="true" /> : <Copy size={18} weight="regular" aria-hidden="true" />}
                    <span className="donation-copy-long">{isCopied ? "Copied" : "Copy number"}</span>
                    <span className="donation-copy-short">{isCopied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              );
            })}
          </div>
          <p className="donation-copy-status" aria-live="polite">
            {copied ? `${copied} account number copied.` : ""}
          </p>
          </section>

          <div className="donation-divider" aria-hidden="true"><span />OR<span /></div>

          <section className="donation-paystack-card" aria-labelledby="paystack-title">
          <h3 id="paystack-title">Pay securely with Paystack</h3>
          <p>Use your card, bank transfer, or another payment method supported by Paystack.</p>
          <a className="donation-paystack-button" href={paystackPaymentUrl} target="_blank" rel="noreferrer">
            <CreditCard size={20} weight="regular" aria-hidden="true" />
            Proceed to Paystack
          </a>
          </section>

          <p className="donation-thanks">Thank you for choosing to support The Lens Foundation.</p>
        </div>
        {scrollbar.visible ? (
          <div className="donation-scrollbar" aria-hidden="true">
            <span style={{ height: `${scrollbar.height}px`, transform: `translateY(${scrollbar.top}px)` }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
