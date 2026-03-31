/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — 3D T-Shirt Model
 * ═══════════════════════════════════════════════
 */

UR.Tshirt = (() => {
  let group;
  let tesseractMesh;
  let glitchTimer = 0;

  const targetPos = new THREE.Vector3();
  const targetScale = new THREE.Vector3(1.15, 1.15, 1.15);

  function create(scene) {
    group = new THREE.Group();

    /* ─── T-Shirt Shape ─── */
    const shape = new THREE.Shape();

    // Bottom hem
    shape.moveTo(-3.2, -5.5);

    // Left side
    shape.lineTo(-3.2, 0.3);

    // Left sleeve
    shape.lineTo(-6, 1.8);
    shape.lineTo(-5.5, 3.8);
    shape.lineTo(-3.5, 2.5);

    // Left shoulder to collar
    shape.lineTo(-3.3, 4.8);
    shape.bezierCurveTo(-2.2, 6, -0.4, 5.6, 0, 5.3);

    // Collar to right shoulder
    shape.bezierCurveTo(0.4, 5.6, 2.2, 6, 3.3, 4.8);

    // Right sleeve
    shape.lineTo(3.5, 2.5);
    shape.lineTo(5.5, 3.8);
    shape.lineTo(6, 1.8);

    // Right side
    shape.lineTo(3.2, 0.3);
    shape.lineTo(3.2, -5.5);

    // Bottom curve
    shape.bezierCurveTo(1.5, -5.8, -1.5, -5.8, -3.2, -5.5);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    /* ─── Fabric Material ─── */
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x080808,
      roughness: 0.88,
      metalness: 0.04,
      transparent: true,
      opacity: 0.94
    });
    group.add(new THREE.Mesh(geometry, bodyMat));

    /* ─── Wireframe Overlay ─── */
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.018
    });
    group.add(new THREE.Mesh(geometry, wireMat));

    /* ─── Edge Lines ─── */
    const edgeGeo = new THREE.EdgesGeometry(geometry, 15);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05
    });
    group.add(new THREE.LineSegments(edgeGeo, edgeMat));

    /* ─── Tesseract Print ─── */
    tesseractMesh = UR.Tesseract.createMesh(2.2, 0.55);
    tesseractMesh.position.set(0, 0.3, 0.65);
    group.add(tesseractMesh);

    /* ─── Collar Detail ─── */
    const collarGeom = new THREE.TorusGeometry(1.8, 0.06, 8, 32, Math.PI);
    const collarMat = new THREE.MeshBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.3
    });
    const collar = new THREE.Mesh(collarGeom, collarMat);
    collar.position.set(0, 5.1, 0.2);
    collar.rotation.x = -0.3;
    group.add(collar);

    group.scale.setScalar(1.15);
    scene.add(group);

    return group;
  }

  function update(time) {
    if (!group) return;

    const { sx, sy } = UR.state.mouse;
    const scroll = UR.state.scroll;

    /* ─── Rotation ─── */
    group.rotation.y = Math.sin(time * 0.25) * 0.4 + sx * 0.65;
    group.rotation.x = Math.cos(time * 0.16) * 0.12 + sy * 0.35;
    group.rotation.z = Math.sin(time * 0.1) * 0.025;

    /* ─── Position & Scale Based on Scroll ─── */
    if (scroll < 0.15) {
      // Hero — centered
      targetPos.set(0, 0, 0);
      targetScale.setScalar(1.15);
    } else if (scroll < 0.55) {
      // Gödel/Chaos — push back
      targetPos.set(0, 0, -16);
      targetScale.setScalar(0.5);
    } else if (scroll < 0.78) {
      // Product — large & shifted
      const xOff = UR.state.isMobile ? 0 : -6;
      targetPos.set(xOff, 0, 4);
      targetScale.setScalar(UR.state.isMobile ? 1.5 : 2.0);
    } else {
      // Final — recede
      targetPos.set(0, 0, -22);
      targetScale.setScalar(0.35);
    }

    group.position.lerp(targetPos, 0.04);
    group.scale.lerp(targetScale, 0.04);

    /* ─── Glitch Effect ─── */
    applyGlitch(time);

    /* ─── Update Tesseract on Shirt ─── */
    if (tesseractMesh) {
      UR.Tesseract.updateMesh(tesseractMesh, time * 0.45);
    }
  }

  function applyGlitch(time) {
    const glitchChance = Math.sin(time * 3.7) * Math.sin(time * 7.3);

    if (glitchChance > 0.93) {
      group.position.x += (Math.random() - 0.5) * 0.5;
      group.position.y += (Math.random() - 0.5) * 0.25;

      const overlay = document.getElementById('glitchOverlay');
      if (overlay) {
        overlay.classList.add('is-active');
        setTimeout(() => overlay.classList.remove('is-active'), 50);
      }
    }
  }

  function getGroup() { return group; }

  return { create, update, getGroup };
})();