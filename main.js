// SelaLabs — site interactions (vanilla JS, no dependencies)
(() => {
  "use strict";

  /* ---------- Header: shadow + background on scroll ---------- */
  const header = document.querySelector("[data-header]");
  const onScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 12;
    header.classList.toggle("bg-white/85", scrolled);
    header.classList.toggle("backdrop-blur-md", scrolled);
    header.classList.toggle("shadow-[0_1px_0_rgba(17,17,20,0.06)]", scrolled);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector("[data-menu-btn]");
  const menu = document.querySelector("[data-menu]");
  const iconOpen = document.querySelector("[data-icon-open]");
  const iconClose = document.querySelector("[data-icon-close]");

  const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let menuIsOpen = false;

  const setMenu = (open) => {
    if (!menu) return;
    menuIsOpen = open;
    if (open) {
      menu.classList.remove("hidden");
      if (instant) {
        menu.classList.add("menu-open");
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add("menu-open")));
      }
    } else {
      menu.classList.remove("menu-open");
      if (instant) {
        menu.classList.add("hidden");
      } else {
        menu.addEventListener("transitionend", (e) => {
          if (e.propertyName === "max-height" && !menuIsOpen) menu.classList.add("hidden");
        }, { once: true });
      }
    }
    iconOpen?.classList.toggle("hidden", open);
    iconClose?.classList.toggle("hidden", !open);
    menuBtn?.setAttribute("aria-expanded", String(open));
  };
  menuBtn?.addEventListener("click", () => setMenu(!menuIsOpen));
  document.querySelectorAll("[data-menu-link]").forEach((link) =>
    link.addEventListener("click", () => setMenu(false))
  );

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  }

  /* ---------- Contact form (mailto fallback, no backend) ---------- */
  const form = document.querySelector("[data-contact-form]");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const company = (data.get("company") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const subject = `Project inquiry from ${name}${company ? " · " + company : ""}`;
    const body =
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      (company ? `Company: ${company}\n` : "") +
      `\n${message}\n`;

    window.location.href =
      `mailto:hello@selalabs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const note = form.querySelector("[data-form-note]");
    if (note) {
      note.textContent =
        document.documentElement.lang === "he"
          ? "פותחים את אפליקציית האימייל… אם כלום לא קורה, כתבו אלינו ל‑hello@selalabs.com"
          : "Opening your email app… if nothing happens, write to hello@selalabs.com";
      note.classList.remove("hidden");
    }
    form.reset();
  });

  /* ---------- Footer year ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
