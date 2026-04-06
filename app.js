/* ============================================================
   UDAY KALE PORTFOLIO — script.js
   Handles: scroll effects, nav active state, skill bar
   animations, form feedback, and micro-interactions.
   ============================================================ */

"use strict";

/* ─── Navbar scroll effect ───────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById("mainNav");

  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // run on load
})();


/* ─── Active nav link on scroll ─────────────────────────────── */
(function initActiveNav() {
  const sections   = document.querySelectorAll("section[id]");
  const navLinks   = document.querySelectorAll(".nav-link");

  const onScroll = () => {
    const scrollY = window.scrollY + 120; // offset for fixed nav

    let currentId = "";
    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`
      );
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();


/* ─── Close mobile nav on link click ────────────────────────── */
(function initMobileNav() {
  const navLinks   = document.querySelectorAll(".navbar-nav .nav-link");
  const bsCollapse = document.getElementById("navMenu");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && bsCollapse.classList.contains("show")) {
        const bsInstance = bootstrap.Collapse.getInstance(bsCollapse);
        if (bsInstance) bsInstance.hide();
      }
    });
  });
})();


/* ─── Scroll reveal (IntersectionObserver) ───────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    // Fallback: show all immediately
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Animate skill bars when they come into view
          const fills = entry.target.querySelectorAll(".skill-fill[data-fill]");
          fills.forEach((fill) => {
            const pct = fill.getAttribute("data-fill");
            // Slight delay for stagger
            setTimeout(() => {
              fill.style.width = pct + "%";
            }, 100);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
})();


/* ─── Skill bar animation on scroll ─────────────────────────── */
(function initSkillBars() {
  // Skills not inside .reveal blocks (direct section)
  const allFills = document.querySelectorAll(".skill-fill[data-fill]");

  if (!("IntersectionObserver" in window)) {
    allFills.forEach((fill) => {
      fill.style.width = fill.getAttribute("data-fill") + "%";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          setTimeout(() => {
            fill.style.width = fill.getAttribute("data-fill") + "%";
          }, 150);
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  allFills.forEach((fill) => observer.observe(fill));
})();


/* ─── Contact form submission ─────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = form.querySelector("button[type='submit']");
    const name    = form.querySelector("#name").value.trim();
    const email   = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showFormMsg(form, "Please fill in all required fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showFormMsg(form, "Please enter a valid email address.", "error");
      return;
    }

    // Simulate sending (replace with real backend call)
    btn.textContent = "Sending…";
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.innerHTML = 'Send Message <i class="bi bi-send ms-2"></i>';
      btn.disabled = false;
      showFormMsg(form, "✓  Message sent! I'll get back to you soon.", "success");
    }, 1800);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMsg(form, text, type) {
    // Remove existing
    const existing = form.querySelector(".form-feedback");
    if (existing) existing.remove();

    const msg = document.createElement("p");
    msg.className = "form-feedback";
    msg.textContent = text;
    Object.assign(msg.style, {
      marginTop: "16px",
      fontSize: "0.85rem",
      fontWeight: "500",
      color: type === "success" ? "#7ecba1" : "#e07a7a",
      textAlign: "center",
      opacity: "0",
      transition: "opacity 0.4s ease",
    });
    form.appendChild(msg);

    // Fade in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        msg.style.opacity = "1";
      });
    });

    // Remove after 5s
    setTimeout(() => {
      msg.style.opacity = "0";
      setTimeout(() => msg.remove(), 400);
    }, 5000);
  }
})();


/* ─── Smooth scroll for all anchor links ─────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();


/* ─── Cursor glow (subtle) on desktop ───────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia("(pointer: coarse)").matches) return; // skip touch

  const glow = document.createElement("div");
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle, rgba(201,169,110,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: opacity 0.4s;
  `;
  document.body.appendChild(glow);

  let rafId;
  document.addEventListener("mousemove", (e) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      glow.style.left = e.clientX + "px";
      glow.style.top  = e.clientY + "px";
    });
  });
})();
