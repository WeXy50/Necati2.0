/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — Chaos Attractor Visuals
 * ═══════════════════════════════════════════════
 */

UR.Chaos = (() => {
  let group;

  function create(scene) {
    group = new THREE.Group();

    const LINE_COUNT = UR.state.isMobile ? 20 : 60;
    const POINTS_PER_LINE = 300;

    for (let l = 0; l < LINE_COUNT; l++) {
      const points = [];

      // Slightly different initial conditions per line (butterfly effect!)
      let x = Math.random() * 2 - 1;
      let y = Math.random() * 2 - 1;
      let z = Math.random() * 2 - 1;

      const sigma = 10 + Math.random() * 3;
      const rho   = 28 + Math.random() * 4;
      const beta  = 8 / 3 + Math.random() * 0.4;
      const dt    = 0.004;

      for (let i = 0; i < POINTS_PER_LINE; i++) {
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;

        points.push(new THREE.Vector3(
          x * 0.3,
          (y - 25) * 0.3,
          (z - 25) * 0.3
        ));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.04 + Math.random() * 0.06
      });

      group.add(new THREE.Line(geometry, material));
    }

    group.visible = false;
    scene.add(group);

    return group;
  }

  function update(time) {
    if (!group || !group.visible) return;

    const { sx, sy } = UR.state.mouse;

    group.rotation.y = time * 0.035 + sx * 0.3;
    group.rotation.x = time * 0.02 + sy * 0.18;

    group.children.forEach((line, i) => {
      const pulse = Math.sin(time * 0.7 + i * 0.35) * 0.04;
      const mouseProximity = Math.max(0, 0.08 - Math.abs(sx - Math.sin(i * 0.5)) * 0.04);
      line.material.opacity = 0.03 + pulse + mouseProximity;
    });
  }

  function show() { if (group) group.visible = true; }
  function hide() { if (group) group.visible = false; }
  function getGroup() { return group; }

  return { create, update, show, hide, getGroup };
})();