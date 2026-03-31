/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — Custom Cursor
 * ═══════════════════════════════════════════════
 */

UR.Cursor = (() => {
  let ring, dot, trail;
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let isDown = false;

  function init() {
    if (UR.state.isMobile) return;

    ring = document.getElementById('cursorRing');
    dot = document.getElementById('cursorDot');
    trail = document.getElementById('cursorTrail');

    /* ─── Mouse Move ─── */
    document.addEventListener('mousemove', (e) => {
      UR.state.mouse.x = (e.clientX / UR.state.width) * 2 - 1;
      UR.state.mouse.y = -(e.clientY / UR.state.height) * 2 + 1;
      cx = e.clientX;
      cy = e.clientY;

      // Update coords display
      const coordX = document.getElementById('coordX');
      const coordY = document.getElementById('coordY');
      if (coordX) coordX.textContent = `X: ${UR.state.mouse.x.toFixed(3)}`;
      if (coordY) coordY.textContent = `Y: ${UR.state.mouse.y.toFixed(3)}`;
    });

    /* ─── Mouse Down/Up ─── */
    document.addEventListener('mousedown', () => {
      isDown = true;
      if (ring) ring.classList.add('is-clicking');
    });

    document.addEventListener('mouseup', () => {
      isDown = false;
      if (ring) ring.classList.remove('is-clicking');
    });

    /* ─── Hover Targets ─── */
    bindHoverTargets();
  }

  function bindHoverTargets() {
    document.querySelectorAll('[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (ring) ring.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        if (ring) ring.classList.remove('is-hovering');
      });
    });
  }

  function update() {
    if (UR.state.isMobile || !ring) return;

    const ringSize = ring.classList.contains('is-hovering') ? 28 : 16;

    gsap.to(ring, {
      x: cx - ringSize,
      y: cy - ringSize,
      duration: 0.4,
      ease: 'power3.out'
    });

    gsap.set(dot, {
      x: cx - 2,
      y: cy - 2
    });

    gsap.to(trail, {
      x: cx - 40,
      y: cy - 40,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  /* Re-bind when DOM changes */
  function rebind() {
    bindHoverTargets();
  }

  return { init, update, rebind };
})();