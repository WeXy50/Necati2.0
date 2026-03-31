/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — Loader & Intro Animation
 * ═══════════════════════════════════════════════
 */

UR.Loader = (() => {

  async function start() {
    const fill = document.getElementById('loaderFill');
    const pct = document.getElementById('loaderPct');
    let progress = 0;

    await new Promise(resolve => {
      const interval = setInterval(() => {
        progress += Math.random() * 10 + 2;

        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(resolve, 500);
        }

        fill.style.width = progress + '%';
        pct.textContent = String(Math.floor(progress)).padStart(3, '0');
      }, 70);
    });

    // Fade out loader
    await new Promise(resolve => {
      gsap.to('#loader', {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
          document.getElementById('loader').style.display = 'none';
          UR.state.loaded = true;
          resolve();
        }
      });
    });

    // Run intro animation
    animateIntro();
  }

  function animateIntro() {
    const lines = document.querySelectorAll('.hero__line');

    lines.forEach(line => {
      const text = line.textContent;
      line.innerHTML = '';

      [...text].forEach(ch => {
        if (ch === ' ') {
          line.appendChild(document.createTextNode(' '));
          return;
        }
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        line.appendChild(span);
      });
    });

    const heroTitle = document.getElementById('heroTitle');
    heroTitle.style.opacity = '1';

    // Staggered character reveal
    gsap.to('.hero__line:nth-child(1) .char', {
      y: 0, opacity: 1,
      duration: 1.0,
      stagger: 0.03,
      ease: 'power3.out',
      delay: 0.2
    });

    gsap.to('.hero__line:nth-child(2) .char', {
      y: 0, opacity: 1,
      duration: 1.0,
      stagger: 0.03,
      ease: 'power3.out',
      delay: 0.6
    });

    gsap.to('.hero__line:nth-child(3) .char', {
      y: 0, opacity: 1,
      duration: 1.2,
      stagger: 0.04,
      ease: 'power3.out',
      delay: 1.0
    });

    // Fade in secondary elements
    gsap.to('#heroEyebrow', {
      opacity: 0.15,
      duration: 1.5,
      delay: 0.5,
      ease: 'power2.out'
    });

    gsap.to('#heroSub', {
      opacity: 0.2,
      duration: 1.5,
      delay: 1.8,
      ease: 'power2.out'
    });

    gsap.to('#heroDivider', {
      width: '80px',
      opacity: 1,
      duration: 1.2,
      delay: 2.2,
      ease: 'power2.out'
    });
  }

  return { start };
})();