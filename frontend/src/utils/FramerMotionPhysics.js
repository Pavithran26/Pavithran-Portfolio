/**
 * FramerMotionPhysics.js
 * Implements Framer-Motion / Apple style Spring Physics, Magnetic Pulls,
 * 3D Card Hover Tilt, and Staggered Viewport Reveals using GSAP.
 */
import gsap from 'gsap';

export class FramerMotionPhysics {
  constructor() {
    this.events = new AbortController();
    this.observer = null;
    this.init();
  }

  init() {
    this.initMagneticButtons();
    this.initCardTiltPhysics();
    this.initSpringTap();
    this.initTechBadgePops();
    this.initStaggerScrollReveals();
  }

  /**
   * 1. Magnetic Cursor Attraction (Framer-Motion useSpring cursor follow)
   * Elements physically drift toward the cursor within their hover zone,
   * then release with a satisfying damped elastic spring.
   */
  initMagneticButtons() {
    const signal = this.events.signal;
    const magneticSelectors = [
      '.intro-enter',
      '.project-links button',
      '.project-links a',
      '.space-text-link',
      '.space-socials a',
      '#copy-email',
      '#appearance-toggle',
      '#menu-toggle',
      '.terminal-launch',
      '.dawn-eye',
      '.speedometer-enter-btn',
      '.project-index a'
    ];

    const elements = document.querySelectorAll(magneticSelectors.join(', '));

    elements.forEach((el) => {
      // Pull strength factor
      const strength = el.classList.contains('intro-enter') || el.classList.contains('speedometer-enter-btn') ? 0.35 : 0.26;

      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * strength,
          y: y * strength,
          rotate: (x * 0.04),
          duration: 0.28,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }, { signal, passive: true });

      el.addEventListener('pointerleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          rotate: 0,
          duration: 0.65,
          ease: 'elastic.out(1.1, 0.45)',
          overwrite: 'auto'
        });
      }, { signal, passive: true });
    });
  }

  /**
   * 2. Framer-Motion 3D Card Hover & Spring Tilt (Apple / Linear style)
   * Cards subtly tilt in 3D perspective following cursor coordinates,
   * and pop with an ember drop shadow.
   */
  initCardTiltPhysics() {
    const signal = this.events.signal;
    const cards = document.querySelectorAll('.project-destination, .space-experience article, .education-milestone, .space-recognition article');

    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5;   // -0.5 to 0.5

        gsap.to(card, {
          '--card-rx': `${(-py * 7).toFixed(2)}deg`,
          '--card-ry': `${(px * 7).toFixed(2)}deg`,
          '--card-lift': '-6px',
          duration: 0.24,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      }, { signal, passive: true });

      card.addEventListener('pointerleave', () => {
        gsap.to(card, {
          '--card-rx': '0deg',
          '--card-ry': '0deg',
          '--card-lift': '0px',
          duration: 0.8,
          ease: 'elastic.out(1, 0.45)',
          overwrite: 'auto'
        });
      }, { signal, passive: true });
    });
  }

  /**
   * 3. Spring Press / Tap Feedback (whileTap={{ scale: 0.95 }})
   * Every click / press gives tactile kinetic squish and elastic bounce back.
   */
  initSpringTap() {
    const signal = this.events.signal;
    const clickable = document.querySelectorAll(`
      button,
      .space-text-link,
      .project-destination,
      .intro-enter,
      .space-socials a,
      .reading-tools button
    `);

    clickable.forEach((el) => {
      el.addEventListener('pointerdown', () => {
        gsap.to(el, {
          scale: 0.95,
          duration: 0.12,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }, { signal, passive: true });

      const release = () => {
        gsap.to(el, {
          scale: 1,
          duration: 0.48,
          ease: 'elastic.out(1.2, 0.4)',
          overwrite: 'auto'
        });
      };

      el.addEventListener('pointerup', release, { signal, passive: true });
      el.addEventListener('pointercancel', release, { signal, passive: true });
    });
  }

  /**
   * 4. Kinetic Tech Badge Pops (whileHover={{ y: -4, scale: 1.08 }})
   * Badges in the skills chapters pop with an elastic spring on hover.
   */
  initTechBadgePops() {
    const signal = this.events.signal;
    const badges = document.querySelectorAll('.reading-tools button');

    badges.forEach((badge) => {
      badge.addEventListener('pointerenter', () => {
        gsap.to(badge, {
          y: -5,
          scale: 1.08,
          duration: 0.28,
          ease: 'back.out(2)',
          overwrite: 'auto'
        });
      }, { signal, passive: true });

      badge.addEventListener('pointerleave', () => {
        gsap.to(badge, {
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'elastic.out(1.1, 0.45)',
          overwrite: 'auto'
        });
      }, { signal, passive: true });
    });
  }

  /**
   * 5. Framer-Motion Staggered Viewport Reveal (staggerChildren: 0.08)
   * As sections scroll into view, child elements reveal with spring-loaded entrance.
   */
  initStaggerScrollReveals() {
    const sections = document.querySelectorAll('.space-work, .space-about, .world-section, #education, #dawn, #contact');

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const revealItems = target.querySelectorAll('.space-kicker, h2, .section-intro, .project-destination, article, .space-actions, .reading-tools');

        if (revealItems.length > 0) {
          gsap.fromTo(revealItems, 
            {
              opacity: 0,
              y: 28,
              scale: 0.985
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.78,
              ease: 'back.out(1.25)',
              stagger: 0.07,
              overwrite: 'auto'
            }
          );
        }

        // Only reveal once
        this.observer.unobserve(target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(sec => this.observer.observe(sec));
  }

  dispose() {
    this.events.abort();
    if (this.observer) this.observer.disconnect();
  }
}
