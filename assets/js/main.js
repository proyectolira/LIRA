/**
 * LIRA — Shared Navigation & GSAP Animations
 */
(async function initLiraSite() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Nav behavior
  window.addEventListener(
    "scroll",
    () => {
      nav?.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true }
  );

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.classList.toggle("open");
    menu?.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      // Close mobile menu
      toggle?.classList.remove("open");
      menu?.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";

      // Smooth scroll to section if it's an anchor link
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__menu a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Smooth scroll for ALL anchor links on the page (hero CTA, etc.)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    // Skip nav__menu links (already handled above)
    if (anchor.closest(".nav__menu")) return;
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Waveform bars
  document.querySelectorAll(".waveform").forEach((wf) => {
    const count = parseInt(wf.dataset.bars || "12", 10);
    for (let i = 0; i < count; i += 1) {
      const bar = document.createElement("div");
      bar.className = "waveform__bar";
      const h = 10 + Math.random() * 30;
      bar.style.cssText = `height:${h}px; --dur:${0.4 + Math.random() * 0.6}s; animation-delay:${Math.random() * 0.5}s;`;
      wf.appendChild(bar);
    }
  });

  // Typing effect
  function typeWriter(el, text, speed = 40) {
    let i = 0;
    el.textContent = "";
    const cursor = document.createElement("span");
    cursor.style.cssText = "border-right:2px solid currentColor;margin-left:2px;animation:blink 1s step-end infinite;";
    el.appendChild(cursor);
    const interval = window.setInterval(() => {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i += 1;
      } else {
        window.clearInterval(interval);
        window.setTimeout(() => cursor.remove(), 2000);
      }
    }, speed);
  }

  const typerEl = document.querySelector("[data-typewriter]");
  if (typerEl) {
    const text = typerEl.dataset.typewriter || typerEl.textContent || "";
    window.setTimeout(() => typeWriter(typerEl, text, 32), 600);
  }

  // GSAP loader
  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  try {
    if (!window.gsap) {
      await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js");
    }
    if (!window.ScrollTrigger) {
      await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js");
    }
  } catch (err) {
    console.warn("[LIRA] GSAP CDN failed, showing content without animations", err);
    // Make ALL content visible without animations
    document.querySelectorAll(".fade-in, .section__header, .card, .media-item, .market-node, .transmedia-node, .market-funnel__step").forEach((el) => {
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transform = "none";
    });
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power2.out", duration: 0.8 });

  // NOTE: reduceMotion guard removed — user explicitly requires animations
  console.log("[LIRA] GSAP v" + gsap.version + " loaded. ScrollTrigger ready. Animations GO.");

  // Cursor glow optimized with quickTo
  const heroEl = document.querySelector(".hero");
  if (heroEl) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    const xTo = gsap.quickTo(glow, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(glow, "y", { duration: 0.35, ease: "power3" });
    document.addEventListener(
      "mousemove",
      (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      },
      { passive: true }
    );
  }

  // Page reveal timeline — using fromTo to guarantee visibility
  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTimeline
    .fromTo(".hero__eyebrow, .page-hero__tag",
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
    .fromTo(".hero__title, .page-hero__title",
      { autoAlpha: 0, y: 35 },
      { autoAlpha: 1, y: 0, duration: 0.9 }, "<0.05")
    .fromTo(".hero__tagline, .page-hero__desc",
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.6 }, "<0.15")
    .fromTo(".hero__cta-group .btn",
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5 }, "<0.1")
    .fromTo(".hero__lira-quote",
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.6 }, "<0.15");

  // ── ANIMATION SYSTEM ──
  // Simple and reliable: one batch for generic reveals, dedicated animations for special elements.

  const dedicatedSelectors = ".card, .market-node, .market-funnel__step, .transmedia-node";
  const dedicatedEls = new Set(gsap.utils.toArray(dedicatedSelectors));

  const revealTargets = gsap.utils.toArray(
    ".fade-in, .section__header, .media-item, .post, .platform-pill, .phase-card, .story-beat, .sensory-row, .char-card, .market-row"
  );
  const batchTargets = [...new Set(revealTargets)].filter(el => !dedicatedEls.has(el));

  ScrollTrigger.batch(batchTargets, {
    start: "top 85%",
    once: true,
    interval: 0.08,
    batchMax: 6,
    onEnter: (batch) => {
      gsap.fromTo(batch,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", overwrite: true }
      );
    }
  });

  // ── 2) CARD PERSPECTIVE TILT ──
  gsap.utils.toArray(".card").forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 86%",
      once: true,
      onEnter: () => {
        gsap.fromTo(card,
          { autoAlpha: 0, y: 45, rotateY: -5, transformOrigin: "left center" },
          { autoAlpha: 1, y: 0, rotateY: 0, duration: 0.9, ease: "power3.out" }
        );
      }
    });
  });

  // ── 3) DIVIDER SHIMMER ──
  gsap.utils.toArray(".divider").forEach((div) => {
    ScrollTrigger.create({
      trigger: div,
      start: "top 92%",
      once: true,
      onEnter: () => {
        gsap.fromTo(div,
          { backgroundPosition: "-200% 0", opacity: 0.3 },
          { backgroundPosition: "200% 0", opacity: 0.7, duration: 2, ease: "power1.inOut" }
        );
      }
    });
  });

  // ── 4) MARKET NODES — ELASTIC POP ──
  const marketNodes = gsap.utils.toArray(".market-node");
  if (marketNodes.length) {
    ScrollTrigger.create({
      trigger: ".market-row",
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.fromTo(marketNodes,
          { autoAlpha: 0, scale: 0.82, y: 35 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 1, stagger: 0.18, ease: "elastic.out(1, 0.55)" }
        );
      }
    });
  }

  // ── 5) FUNNEL CASCADE ──
  const funnelSteps = gsap.utils.toArray(".market-funnel__step");
  if (funnelSteps.length) {
    ScrollTrigger.create({
      trigger: ".market-funnel",
      start: "top 86%",
      once: true,
      onEnter: () => {
        gsap.fromTo(funnelSteps,
          { autoAlpha: 0, x: -50, scale: 0.88 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.75, stagger: 0.14, ease: "power3.out" }
        );
      }
    });
  }

  // ── 6) TRANSMEDIA NODES — RADIATE FROM CENTER ──
  const tNodes = gsap.utils.toArray(".transmedia-node");
  if (tNodes.length) {
    ScrollTrigger.create({
      trigger: ".transmedia-hub",
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.fromTo(tNodes,
          { autoAlpha: 0, scale: 0.78, y: 30 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.85, stagger: { each: 0.12, from: "center" }, ease: "back.out(1.3)" }
        );
      }
    });
  }

  // ── 7) MAGNETIC HOVER (quickTo) ──
  document.querySelectorAll(".card, .market-node, .transmedia-node").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * 0.08);
      yTo((e.clientY - (rect.top + rect.height / 2)) * 0.08);
    });
    el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
  });

  // ── 8) PARALLAX via data-speed ──
  gsap.utils.toArray("[data-speed]").forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-speed")) || 0.5;
    gsap.to(el, {
      y: () => (1 - speed) * 200,
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // Ambient floating elements
  gsap.to(".particle, .vr-orb", {
    y: () => gsap.utils.random(-12, 12),
    x: () => gsap.utils.random(-6, 6),
    duration: () => gsap.utils.random(2.4, 4.4),
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.15
  });

  // Hero parallax via quickTo
  const heroGrid = document.querySelector(".hero__grid");
  const heroRadial = document.querySelector(".hero__radial");
  if (heroGrid && heroRadial) {
    const gridX = gsap.quickTo(heroGrid, "x", { duration: 0.5, ease: "power3.out" });
    const gridY = gsap.quickTo(heroGrid, "y", { duration: 0.5, ease: "power3.out" });
    const radialX = gsap.quickTo(heroRadial, "x", { duration: 0.6, ease: "power3.out" });
    const radialY = gsap.quickTo(heroRadial, "y", { duration: 0.6, ease: "power3.out" });
    document.addEventListener(
      "mousemove",
      (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 16;
        gridX(x * 0.55);
        gridY(y * 0.55);
        radialX(x * 0.8);
        radialY(y * 0.8);
      },
      { passive: true }
    );
  }

  // Hero index magnetic hover
  document.querySelectorAll(".hero__index-item").forEach((item) => {
    const xTo = gsap.quickTo(item, "x", { duration: 0.28, ease: "power3.out" });
    const yTo = gsap.quickTo(item, "y", { duration: 0.28, ease: "power3.out" });
    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
      xTo(dx);
      yTo(dy - 4);
    });
    item.addEventListener("mouseleave", () => {
      xTo(0);
      yTo(0);
    });
  });

  // Prepare SVG paths for drawing animation (if any remain)
  gsap.utils.toArray(".draw-line, .draw-arrow").forEach(path => {
    try {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    } catch (e) {}
  });

  // Market map and transmedia visuals
  const marketMap = document.querySelector(".market-map");
  if (marketMap) {
    const marketTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".market-map",
        start: "top 75%",
        end: "bottom 45%",
        scrub: 1
      }
    });
    marketTl
      .to(".market-connection", { scaleX: 1, duration: 0.8, stagger: 0.1, transformOrigin: "left center", ease: "none" }, 0)
      .to(".market-node__pulse", { autoAlpha: 0.35, scale: 1.5, repeat: -1, yoyo: true, duration: 1.1, stagger: 0.08 }, 0);
  }

  const transmediaHub = document.querySelector(".transmedia-hub");
  if (transmediaHub) {
    const transmediaTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".transmedia-hub",
        start: "top 78%",
        end: "bottom 45%",
        scrub: 1
      }
    });
    transmediaTl
      .to(".hub-ring", { rotation: 180, ease: "none", duration: 1 }, 0)
      .fromTo(".transmedia-link", { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.05, ease: "none", transformOrigin: "left center" }, 0)
      .to(".transmedia-node--center", { boxShadow: "0 0 0 1px rgba(74,158,255,0.4), 0 0 46px rgba(74,158,255,0.45)", duration: 0.7 }, 0.2);
  }

  // Moodreel details
  gsap.to(".palette-grid > div", {
    y: () => gsap.utils.random(-5, 5),
    duration: 2.6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.2
  });
  gsap.to(".video-player .corner-tl, .video-player .corner-tr, .video-player .corner-bl, .video-player .corner-br", {
    autoAlpha: 0.9,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.08
  });

  // Corto narrative timeline
  gsap.utils.toArray(".story-beat").forEach((beat) => {
    ScrollTrigger.create({
      trigger: beat,
      start: "top 72%",
      end: "bottom 52%",
      onEnter: () => beat.classList.add("is-active"),
      onEnterBack: () => beat.classList.add("is-active"),
      onLeave: () => beat.classList.remove("is-active"),
      onLeaveBack: () => beat.classList.remove("is-active")
    });
  });

  // VR cards progression
  const vrTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".vr-phases",
      start: "top 75%",
      end: "bottom 40%",
      scrub: 1
    }
  });
  vrTl
    .fromTo(".phase-card", { y: 22, autoAlpha: 0.45, scale: 0.96 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.2, duration: 0.8, ease: "none" }, 0)
    .to(".phase-card--3", { boxShadow: "0 0 0 1px rgba(200,151,106,0.45), 0 0 36px rgba(200,151,106,0.24)", duration: 0.45 }, 0.55);

  // Sensory rows sweep
  gsap.fromTo(
    ".sensory-row",
    { xPercent: -4, autoAlpha: 0.4 },
    {
      xPercent: 0,
      autoAlpha: 1,
      duration: 0.55,
      stagger: 0.08,
      scrollTrigger: {
        trigger: ".sensory-list",
        start: "top 78%",
        once: true
      }
    }
  );

  // Redes social posts with layered reveal
  gsap.fromTo(
    ".feed .post",
    { y: 20, autoAlpha: 0.3, rotateX: -4, transformOrigin: "50% 0%" },
    {
      y: 0,
      autoAlpha: 1,
      rotateX: 0,
      stagger: 0.12,
      duration: 0.7,
      scrollTrigger: {
        trigger: ".feed",
        start: "top 80%",
        once: true
      }
    }
  );

  // Podcast reactive visualizer
  const audioEl = document.getElementById("lira-audio");
  const artEl = document.querySelector(".player-widget__art");
  const playBtnEl = document.getElementById("btn-play");
  if (audioEl && artEl && playBtnEl) {
    let pulseTween;
    audioEl.addEventListener("play", () => {
      pulseTween = gsap.to(artEl, {
        scale: 1.06,
        boxShadow: "0 0 0 1px rgba(74,158,255,0.45), 0 0 40px rgba(74,158,255,0.35)",
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(playBtnEl, { scale: 1.06, duration: 0.2, ease: "power2.out" });
    });
    audioEl.addEventListener("pause", () => {
      pulseTween?.kill();
      gsap.to(artEl, { scale: 1, boxShadow: "none", duration: 0.3, ease: "power2.out" });
      gsap.to(playBtnEl, { scale: 1, duration: 0.2, ease: "power2.out" });
    });
    audioEl.addEventListener("ended", () => {
      pulseTween?.kill();
      gsap.to(artEl, { scale: 1, boxShadow: "none", duration: 0.3, ease: "power2.out" });
      gsap.to(playBtnEl, { scale: 1, duration: 0.2, ease: "power2.out" });
    });
  }

  // Responsive GSAP contexts
  const mm = gsap.matchMedia();
  mm.add(
    {
      isDesktop: "(min-width: 901px)",
      isMobile: "(max-width: 900px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    },
    (context) => {
      const { isDesktop } = context.conditions;

      gsap.to(".nav__logo", {
        textShadow: "0 0 44px rgba(74,158,255,0.6)",
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      if (isDesktop) {
        gsap.to(".hero__radial", {
          scale: 1.08,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        const storyRoot = document.querySelector(".transmedia-story");
        const storyTrack = storyRoot?.querySelector(".transmedia-story__track");
        const storyPanels = storyRoot ? gsap.utils.toArray(".transmedia-story .story-panel") : [];
        const storyBar = storyRoot?.querySelector(".story-progress__bar");

        if (storyRoot && storyTrack && storyPanels.length > 1) {
          const panelCount = storyPanels.length;
          const storyTl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: storyRoot,
              start: "top top",
              end: `+=${panelCount * 720}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1
            }
          });

          storyTl.to(storyTrack, { xPercent: -75, duration: 1 }, 0);
          if (storyBar) {
            storyTl.to(storyBar, { scaleX: 1, duration: 1 }, 0);
          }
          storyPanels.forEach((panel, index) => {
            storyTl.fromTo(
              panel,
              { autoAlpha: index === 0 ? 1 : 0.45, yPercent: index === 0 ? 0 : 8 },
              { autoAlpha: 1, yPercent: 0, duration: 0.22 },
              index / panelCount
            );
          });
        }
      } else {
        gsap.set(".transmedia-story .story-panel", { autoAlpha: 1, yPercent: 0, clearProps: "transform" });
      }
    }
  );

  window.addEventListener("load", () => ScrollTrigger.refresh(), { passive: true });
})();
