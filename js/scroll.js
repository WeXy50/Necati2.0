/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — Scroll Animations
 * ═══════════════════════════════════════════════
 */

UR.Scroll = (() => {

  const sectionLabels = ['001 — ORIGIN', '002 — GÖDEL', '003 — CHAOS', '004 — DIMENSION', '005 — ARTIFACT', '006 — ∞'];

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    setupGlobalScroll();
    setupHero();
    setupGodel();
    setupChaos();
    setupDimension();
    setupProduct();
    setupFinal();
    setupDots();
  }

  /* ─── Global Scroll Tracking ─── */
  function setupGlobalScroll() {
    // Progress bar
    gsap.to('#progressBar', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    // Track scroll position
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - UR.state.height;
      UR.state.scroll = docHeight > 0 ? scrollTop / docHeight : 0;
    }, { passive: true });

    // Hide scroll hint on first scroll
    window.addEventListener('scroll', () => {
      gsap.to('#scrollHint', { opacity: 0, duration: 1, ease: 'power2.out' });
    }, { once: true, passive: true });
  }

  /* ─── Hero Section ─── */
  function setupHero() {
    ScrollTrigger.create({
      trigger: '#sec0',
      start: 'top top',
      end: 'bottom 15%',
      onUpdate: self => {
        const fade = 1 - self.progress * 3;
        const clamped = Math.max(0, fade);

        document.getElementById('heroTitle').style.opacity = clamped;
        document.getElementById('heroSub').style.opacity = clamped;
        document.getElementById('heroEyebrow').style.opacity = clamped;

        const divider = document.getElementById('heroDivider');
        if (divider) divider.style.opacity = clamped;
      }
    });
  }

  /* ─── Gödel Section ─── */
  function setupGodel() {
    ScrollTrigger.create({
      trigger: '#sec1',
      start: 'top 80%',
      end: 'bottom 15%',
      onEnter: () => enterGodel(),
      onEnterBack: () => enterGodel(),
      onLeave: () => leaveGodel(),
      onLeaveBack: () => leaveGodel(),
      onUpdate: self => {
        // Staggered fragment reveal
        document.querySelectorAll('.frag').forEach((frag, i) => {
          const progress = Math.max(0, Math.min(1, (self.progress - i * 0.01) * 2.8));
          frag.style.opacity = progress * 0.1;
          frag.style.transform = `translateY(${(1 - progress) * 24}px)`;
        });
      }
    });
  }

  function enterGodel() {
    setSection(1);
    document.getElementById('godelGrid').style.opacity = '1';

    gsap.to('#godelTitle', { opacity: 0.85, duration: 1.5, ease: 'power2.out' });
    gsap.to('#godelRule', { width: '60px', duration: 1.2, delay: 0.2, ease: 'power2.out' });
    gsap.to('#godelSub', { opacity: 0.18, duration: 1.5, delay: 0.3, ease: 'power2.out' });
    gsap.to('#godelFormula', { opacity: 0.06, duration: 2, delay: 0.5, ease: 'power2.out' });
  }

  function leaveGodel() {
    document.getElementById('godelGrid').style.opacity = '0';

    gsap.to('#godelTitle', { opacity: 0, duration: 0.5 });
    gsap.to('#godelRule', { width: '0px', duration: 0.4 });
    gsap.to('#godelSub', { opacity: 0, duration: 0.5 });
    gsap.to('#godelFormula', { opacity: 0, duration: 0.4 });

    document.querySelectorAll('.frag').forEach(f => {
      f.style.opacity = '0';
    });
  }

  /* ─── Chaos Section ─── */
  function setupChaos() {
    ScrollTrigger.create({
      trigger: '#sec2',
      start: 'top 80%',
      end: 'bottom 15%',
      onEnter: () => enterChaos(),
      onEnterBack: () => enterChaos(),
      onLeave: () => leaveChaos(),
      onLeaveBack: () => leaveChaos()
    });
  }

  function enterChaos() {
    setSection(2);
    UR.Chaos.show();

    gsap.to('#chaosTitle', { opacity: 0.85, duration: 1.5, ease: 'power2.out' });
    gsap.to('#chaosRule', { width: '60px', duration: 1.2, delay: 0.15, ease: 'power2.out' });
    gsap.to('#chaosSub', { opacity: 0.2, duration: 1.5, delay: 0.25, ease: 'power2.out' });
    gsap.to('#chaosEqs', { opacity: 0.06, duration: 2, delay: 0.4, ease: 'power2.out' });
  }

  function leaveChaos() {
    UR.Chaos.hide();

    gsap.to('#chaosTitle', { opacity: 0, duration: 0.4 });
    gsap.to('#chaosRule', { width: '0px', duration: 0.3 });
    gsap.to('#chaosSub', { opacity: 0, duration: 0.4 });
    gsap.to('#chaosEqs', { opacity: 0, duration: 0.3 });
  }

  /* ─── 4th Dimension Section ─── */
  function setupDimension() {
    ScrollTrigger.create({
      trigger: '#sec3',
      start: 'top 80%',
      end: 'bottom 15%',
      onEnter: () => enterDimension(),
      onEnterBack: () => enterDimension(),
      onLeave: () => leaveDimension(),
      onLeaveBack: () => leaveDimension()
    });
  }

  function enterDimension() {
    setSection(3);
    UR.Scene.showSoloTesseract();

    gsap.to('#dimTitle', { opacity: 0.85, duration: 1.5, ease: 'power2.out' });
    gsap.to('#dimRule', { width: '60px', duration: 1.2, delay: 0.15, ease: 'power2.out' });
    gsap.to('#dimSub', { opacity: 0.18, duration: 1.5, delay: 0.2, ease: 'power2.out' });
    gsap.to('#dimSpecs', { opacity: 0.2, duration: 1.5, delay: 0.35, ease: 'power2.out' });
  }

  function leaveDimension() {
    UR.Scene.hideSoloTesseract();

    gsap.to('#dimTitle', { opacity: 0, duration: 0.4 });
    gsap.to('#dimRule', { width: '0px', duration: 0.3 });
    gsap.to('#dimSub', { opacity: 0, duration: 0.4 });
    gsap.to('#dimSpecs', { opacity: 0, duration: 0.3 });
  }

  /* ─── Product Section ─── */
  function setupProduct() {
    ScrollTrigger.create({
      trigger: '#sec4',
      start: 'top 80%',
      end: 'bottom 15%',
      onEnter: () => enterProduct(),
      onEnterBack: () => enterProduct(),
      onLeave: () => leaveProduct(),
      onLeaveBack: () => leaveProduct()
    });
  }

  function enterProduct() {
    setSection(4);

    const elements = [
      { id: '#prodBadge', delay: 0 },
      { id: '#prodTitle', delay: 0.08 },
      { id: '#prodTag', delay: 0.15 },
      { id: '#prodDivider', delay: 0.2, width: '100%' },
      { id: '#prodDesc', delay: 0.25 },
      { id: '#prodDetails', delay: 0.3 },
      { id: '#prodBtn', delay: 0.4 }
    ];

    elements.forEach(({ id, delay, width }) => {
      const props = { opacity: id.includes('Tag') || id.includes('Desc') ? 0.2 : 1, duration: 1, delay, ease: 'power2.out' };
      if (width) props.width = width;
      gsap.to(id, props);
    });
  }

  function leaveProduct() {
    ['#prodBadge', '#prodTitle', '#prodTag', '#prodDivider', '#prodDesc', '#prodDetails', '#prodBtn'].forEach(id => {
      gsap.to(id, { opacity: 0, duration: 0.4 });
    });
    gsap.to('#prodDivider', { width: '0px', duration: 0.3 });
  }

  /* ─── Final Section ─── */
  function setupFinal() {
    ScrollTrigger.create({
      trigger: '#sec5',
      start: 'top 75%',
      onEnter: () => {
        setSection(5);
        gsap.to('#finalTitle', { opacity: 1, duration: 3, ease: 'power2.out' });
        gsap.to('#finalSymbol', { opacity: 0.08, duration: 3, delay: 1, ease: 'power2.out' });
      },
      onLeaveBack: () => {
        gsap.to('#finalTitle', { opacity: 0, duration: 0.6 });
        gsap.to('#finalSymbol', { opacity: 0, duration: 0.5 });
      }
    });
  }

  /* ─── Section Navigation Dots ─── */
  function setupDots() {
    document.querySelectorAll('.section-dots__dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const sec = document.getElementById('sec' + dot.dataset.section);
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ─── Set Active Section ─── */
  function setSection(index) {
    UR.state.section = index;

    // Update dots
    document.querySelectorAll('.section-dots__dot').forEach((dot, j) => {
      dot.classList.toggle('active', j === index);
    });

    // Update nav label
    const navSection = document.getElementById('navSection');
    if (navSection) navSection.textContent = sectionLabels[index] || `${String(index + 1).padStart(3, '0')} — ∞`;
  }

  return { init };
})();