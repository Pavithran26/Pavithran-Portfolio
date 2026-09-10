/**
 * GsapInteractions.js
 * Implements GSAP-powered kinetic physics, magnetic cursor buttons,
 * and character flair micro-animations inspired by GSAP.com.
 */
import gsap from 'gsap';

export class GsapInteractions {
  static init() {
    this.initMagneticButtons();
    this.initKineticHeadings();
    this.initStickerHover();
  }

  /**
   * Attaches magnetic physics to buttons:
   * The button physically glides toward the cursor when hovering nearby,
   * while an internal gradient flair follows the exact mouse position.
   */
  static initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic-pill-btn, .hero-btn-primary, .hero-btn-secondary, .hero-btn-accent, .clara-ai-pill-btn');

    magneticElements.forEach((btn) => {
      // Ensure the button has a flair element if not already present
      let flair = btn.querySelector('.btn-flair');
      if (!flair && !btn.classList.contains('clara-ai-pill-btn')) {
        flair = document.createElement('span');
        flair.className = 'btn-flair';
        btn.prepend(flair);
      }

      const strength = btn.dataset.magneticStrength ? parseFloat(btn.dataset.magneticStrength) : 0.3;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move the button itself toward cursor
        gsap.to(btn, {
          x: x * strength,
          y: y * strength,
          rotate: x * 0.05,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        // Position internal radial flair
        if (flair) {
          const flairX = e.clientX - rect.left;
          const flairY = e.clientY - rect.top;
          gsap.to(flair, {
            left: flairX,
            top: flairY,
            scale: 1,
            opacity: 0.75,
            duration: 0.25,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        // Return button to origin with elastic spring
        gsap.to(btn, {
          x: 0,
          y: 0,
          rotate: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });

        if (flair) {
          gsap.to(flair, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });
        }
      });
    });
  }

  /**
   * Animates headline characters and kinetic flairs (spinning windmill, star, bolt)
   */
  static initKineticHeadings() {
    // Spin animated flairs on continuous loop
    const stars = document.querySelectorAll('.kinetic-flair--star, .kinetic-flair--windmill');
    stars.forEach((star) => {
      gsap.to(star, {
        rotate: 360,
        duration: 12,
        ease: 'none',
        repeat: -1,
      });

      // Rapid spin burst on hover
      star.addEventListener('mouseenter', () => {
        gsap.to(star, {
          rotate: '+=360',
          duration: 0.8,
          ease: 'back.out(2)',
        });
      });
    });

    // Lightning bolt flicker
    const bolts = document.querySelectorAll('.kinetic-flair--bolt');
    bolts.forEach((bolt) => {
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      timeline
        .to(bolt, { opacity: 0.3, y: -2, duration: 0.08 })
        .to(bolt, { opacity: 1, y: 0, duration: 0.08 })
        .to(bolt, { opacity: 0.5, duration: 0.05 })
        .to(bolt, { opacity: 1, duration: 0.1 });
    });
  }

  /**
   * Adds tactile tilt and sticker shadow offset on cards
   */
  static initStickerHover() {
    const cards = document.querySelectorAll('.project-card, .skill-card, .matrix-category-panel');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateY: x * 6,
          rotateX: -y * 6,
          transformPerspective: 900,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      });
    });
  }
}
