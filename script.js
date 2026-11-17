/* ============================================================
   Mahmuda Sultana — Portfolio interactions
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Sticky nav background on scroll ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");

  const setMenu = (open) => {
    burger.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    // keep hidden attr in sync so it's removed from tab order when closed
    if (open) menu.removeAttribute("hidden");
    else menu.setAttribute("hidden", "");
    document.body.style.overflow = open ? "hidden" : "";
  };

  burger.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
  });

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        // fallback for browsers without clipboard API
        const ta = document.createElement("textarea");
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      copyBtn.classList.add("copied");
      setTimeout(() => copyBtn.classList.remove("copied"), 1800);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el, i) => {
      // slight stagger for siblings in the same row
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Subtle tilt on work cards (desktop only) ---------- */
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover) {
    document.querySelectorAll(".work-card, .award-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "translateY(-8px) rotateX(" + (-y * 5).toFixed(2) + "deg) rotateY(" + (x * 6).toFixed(2) + "deg)";
        card.style.transformStyle = "preserve-3d";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Custom cursor + floating "View" badge + spotlight ---------- */
  if (canHover) {
    // trailing ring + instant dot
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.append(dot, ring);
    document.body.classList.add("cursor-active");

    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
    document.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));

    const HOVERABLE = "a, button, input, textarea, label, .work-card, .award-card, .skill-card, .pills li, .timeline__body";
    let hovered = null;
    document.addEventListener("mouseover", (e) => {
      const el = e.target.closest ? e.target.closest(HOVERABLE) : null;
      if (el !== hovered) {
        hovered = el;
        ring.classList.toggle("is-hover", !!el);
      }
    });

    (function follow() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(follow);
    })();

    // "View ↗" badge that trails the cursor over work cards
    const badge = document.createElement("div");
    badge.className = "work-badge";
    badge.textContent = "View ↗";
    document.body.appendChild(badge);

    document.querySelectorAll(".work-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(2) + "%");
        card.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(2) + "%");
        badge.style.transform =
          "translate3d(" + e.clientX + "px," + e.clientY + "px,0) translate(-50%,-50%)";
      });
      card.addEventListener("mouseenter", () => badge.classList.add("show"));
      card.addEventListener("mouseleave", () => badge.classList.remove("show"));
    });

    // magnetic pull on buttons
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + (x * 0.22).toFixed(1) + "px," + (y * 0.3).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Contact form (FormSubmit → email inbox) ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    const status = document.getElementById("formStatus");
    const btn = document.getElementById("submitBtn");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      btn.disabled = true;
      btn.classList.add("loading");
      status.className = "cform__status";
      status.textContent = "";

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 45000); // never hang forever

      try {
        const payload = Object.fromEntries(new FormData(form).entries());
        const res = await fetch("https://formsubmit.co/ajax/mahmudauiux@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || String(data.success) !== "true") throw new Error("send failed");

        form.reset();
        status.textContent = "Message sent! I'll get back to you soon ✨";
        status.classList.add("is-success");
      } catch {
        status.innerHTML =
          'Oops — something went wrong (or it took too long). Please email me directly at ' +
          '<a href="mailto:mahmudauiux@gmail.com">mahmudauiux@gmail.com</a>.';
        status.classList.add("is-error");
      } finally {
        clearTimeout(timer);
        btn.disabled = false;
        btn.classList.remove("loading");
      }
    });
  }

  /* ---------- Success page after non-AJAX fallback submit (?sent=1) ---------- */
  const sentParam = new URLSearchParams(window.location.search).get("sent");
  if (sentParam !== null) {
    const s = document.getElementById("formStatus");
    if (s) {
      s.textContent = "Message sent! I'll get back to you soon ✨";
      s.classList.add("is-success");
    }
    history.replaceState(null, "", window.location.pathname);
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
