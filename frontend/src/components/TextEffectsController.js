/**
 * TextEffectsController.js
 * Lightweight Vengeance-UI-inspired motion, adapted for this Vite portfolio.
 * Keeps the current vanilla DOM architecture and avoids adding a second animation runtime.
 */
export class TextEffectsController {
  constructor({ root = document, mode = "normal" } = {}) {
    this.root = root;
    this.mode = mode;
    this.events = new AbortController();
    this.timers = [];
    this.observers = [];
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.documentElement.classList.add("has-vx-text-effects");

    this.initAnimatedNumbers();
    this.initStaggerText();
    this.initGooeyReveal();
    this.initLiquidText();
    this.initFlipText();
    this.initProjectGlitch();
    this.initFlipFadeText();
    this.initImageCollage();
    if (mode !== "animation") this.initMorphText();
  }

  observe(elements, onEnter, options = { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }) {
    const list = [...elements];
    if (!list.length) return;
    if (this.reducedMotion.matches || !("IntersectionObserver" in window)) {
      list.forEach(onEnter);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onEnter(entry.target);
        observer.unobserve(entry.target);
      });
    }, options);
    list.forEach((element) => observer.observe(element));
    this.observers.push(observer);
  }

  addTimer(callback, delay) {
    const id = window.setTimeout(callback, delay);
    this.timers.push(id);
    return id;
  }

  addInterval(callback, delay) {
    const id = window.setInterval(callback, delay);
    this.timers.push(id);
    return id;
  }

  splitText(element, className) {
    if (element.dataset.vxSplit) return;
    const source = element.textContent || "";
    if (!source.trim()) return;
    element.dataset.vxSplit = "true";
    element.setAttribute("aria-label", source);
    element.innerHTML = "";

    const visual = document.createElement("span");
    visual.className = "vx-split-visual";
    visual.setAttribute("aria-hidden", "true");
    Array.from(source).forEach((character, index) => {
      const part = document.createElement("span");
      part.className = className;
      part.style.setProperty("--vx-index", String(index));
      part.textContent = character === " " ? "\u00a0" : character;
      visual.appendChild(part);
    });
    const accessible = document.createElement("span");
    accessible.className = "visually-hidden";
    accessible.textContent = source;
    element.append(visual, accessible);
  }

  initAnimatedNumbers() {
    const counters = this.root.querySelectorAll("[data-count-to]");
    counters.forEach((counter) => {
      const target = Number(counter.dataset.countTo);
      const suffix = counter.dataset.countSuffix || "";
      if (!Number.isFinite(target)) return;
      counter.dataset.countComplete = "false";
      counter.textContent = `0${suffix}`;
    });

    this.observe(counters, (counter) => {
      if (counter.dataset.countComplete === "true") return;
      counter.dataset.countComplete = "true";
      const target = Number(counter.dataset.countTo);
      const suffix = counter.dataset.countSuffix || "";
      if (this.reducedMotion.matches) {
        counter.textContent = `${target}${suffix}`;
        return;
      }
      const duration = 1150;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        counter.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
  }

  initStaggerText() {
    const selectors = [
      ".space-content > .space-kicker",
      ".space-experience .space-kicker",
      ".space-education .space-kicker",
      ".space-recognition .space-kicker",
      ".live-preview-lab > .space-kicker"
    ].join(",");
    const labels = this.root.querySelectorAll(selectors);
    labels.forEach((label) => {
      this.splitText(label, "vx-stagger-char");
      label.classList.add("vx-stagger-text");
    });
    this.observe(labels, (label) => label.classList.add("is-vx-staggered"));
  }

  initGooeyReveal() {
    const headings = this.root.querySelectorAll(
      ".space-content > h2, .world-copy > h2, .live-preview-lab > h3, .space-contact h2, .story-subheading"
    );
    headings.forEach((heading) => heading.classList.add("vx-gooey-target"));
    this.observe(headings, (heading) => heading.classList.add("is-vx-gooey"));
  }

  initLiquidText() {
    this.root.querySelectorAll(
      ".intro-identity h1 em, .space-content > h2 em, .world-copy > h2 em, .live-preview-lab h3 em"
    ).forEach((element) => element.classList.add("vx-liquid-text"));
  }

  initFlipText() {
    const links = this.root.querySelectorAll(".project-index a");
    links.forEach((link) => {
      const label = link.textContent.trim();
      if (!label || link.dataset.vxFlipReady) return;
      link.dataset.vxFlipReady = "true";
      link.setAttribute("aria-label", label);
      const visual = document.createElement("span");
      visual.className = "vx-flip-visual";
      visual.setAttribute("aria-hidden", "true");
      Array.from(label).forEach((character, index) => {
        const span = document.createElement("span");
        span.className = "vx-flip-char";
        span.style.setProperty("--vx-index", String(index));
        span.textContent = character === " " ? "\u00a0" : character;
        visual.appendChild(span);
      });
      link.textContent = "";
      link.appendChild(visual);
    });

    // The large FDE headline gets a gentle 3D entrance rather than a constant flip.
    const heroTitle = this.root.querySelector("#intro-title");
    if (heroTitle && !this.reducedMotion.matches) {
      heroTitle.classList.add("vx-flip-heading");
      const finishFlip = (event) => {
        if (event.animationName !== "vx-heading-flip-in") return;
        heroTitle.classList.remove("vx-flip-heading");
        heroTitle.removeEventListener("animationend", finishFlip);
      };
      heroTitle.addEventListener("animationend", finishFlip);
      this.events.signal.addEventListener("abort", () => heroTitle.removeEventListener("animationend", finishFlip), { once: true });
    }
  }

  initProjectGlitch() {
    this.root.querySelectorAll(".space-project-title > span:first-child").forEach((title) => {
      title.dataset.vxText = title.textContent.trim();
      title.classList.add("vx-ascii-glitch");
    });
  }

  initFlipFadeText() {
    const captions = [...this.root.querySelectorAll("[data-flip-phrases]")];
    if (!captions.length || this.reducedMotion.matches) return;

    // Start each phrase cycle when its section enters view, not while it sits offscreen.
    this.observe(captions, (caption) => {
      const phrases = (caption.dataset.flipPhrases || "")
        .split("|")
        .map((phrase) => phrase.trim())
        .filter(Boolean);
      if (phrases.length < 2) return;

      const target = caption.querySelector(".vx-flip-fade-current") || caption;
      const currentIndex = phrases.indexOf(target.textContent.trim());
      let index = currentIndex >= 0 ? currentIndex : 0;
      if (!target.textContent.trim()) target.textContent = phrases[index];

      const cycle = () => {
        if (!target.isConnected) return;
        target.classList.remove("is-vx-flipped");
        target.classList.add("is-vx-flipping");
        this.addTimer(() => {
          if (!target.isConnected) return;
          index = (index + 1) % phrases.length;
          target.textContent = phrases[index];
          target.classList.remove("is-vx-flipping");
          target.classList.add("is-vx-flipped");
          this.addTimer(() => target.classList.remove("is-vx-flipped"), 420);
        }, 300);
      };

      this.addInterval(cycle, 4600);
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  }

  initMorphText() {
    const morph = this.root.querySelector("[data-morph-phrases]");
    if (!morph) return;
    const phrases = (morph.dataset.morphPhrases || "").split("|").map((word) => word.trim()).filter(Boolean);
    if (phrases.length < 2) return;
    let index = 0;
    if (this.reducedMotion.matches) return;

    this.addInterval(() => {
      morph.classList.add("is-vx-morphing");
      this.addTimer(() => {
        index = (index + 1) % phrases.length;
        morph.textContent = phrases[index];
        morph.classList.remove("is-vx-morphing");
        morph.classList.add("is-vx-morphed");
        this.addTimer(() => morph.classList.remove("is-vx-morphed"), 450);
      }, 280);
    }, 3900);
  }

  initImageCollage() {
    const section = this.root.querySelector(".project-image-collage");
    const stage = section?.querySelector(".project-collage-stage");
    const button = section?.querySelector(".project-collage-toggle");
    if (!section || !stage || !button) return;
    this.on(button, "click", () => {
      const organized = stage.classList.toggle("is-organized");
      button.setAttribute("aria-pressed", String(organized));
      button.textContent = organized ? "Scatter snapshots ↗" : "Arrange snapshots ↗";
    });
    if (this.reducedMotion.matches) stage.classList.add("is-organized");
  }

  on(target, type, handler, options = {}) {
    if (target) target.addEventListener(type, handler, { signal: this.events.signal, ...options });
  }

  dispose() {
    this.events.abort();
    this.observers.forEach((observer) => observer.disconnect());
    this.timers.forEach((timer) => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    document.documentElement.classList.remove("has-vx-text-effects");
  }
}
