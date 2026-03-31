/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — Main Application Entry
 *
 *  An interactive digital art installation
 *  exploring Gödel's incompleteness theorem,
 *  chaos theory, and the fourth dimension.
 *
 *  © 2025 Unprovable Reality
 * ═══════════════════════════════════════════════
 */

(async () => {
  'use strict';

  /* ─── Initialize Utilities ─── */
  UR.generateGrain();
  UR.buildTicker();
  UR.buildFragments();

  /* ─── Initialize Cursor ─── */
  UR.Cursor.init();

  /* ─── Sound Button Binding ─── */
  document.getElementById('soundBtn').addEventListener('click', () => {
    UR.Audio.toggle();
  });

  /* ─── Initialize Three.js Scene ─── */
  UR.Scene.init();

  /* ─── Run Loader ─── */
  await UR.Loader.start();

  /* ─── Initialize Scroll Animations ─── */
  UR.Scroll.init();

  /* ─── Rebind Cursor After Fragments Created ─── */
  UR.Cursor.rebind();

  /* ─── Log ─── */
  console.log(
    '%c UNPROVABLE REALITY ',
    'background:#000;color:#fff;padding:12px 24px;font-family:monospace;font-size:14px;letter-spacing:4px'
  );
  console.log(
    '%c Reality cannot be proven. But it can be experienced. ',
    'color:#555;font-family:monospace;font-size:10px;letter-spacing:2px'
  );
})();