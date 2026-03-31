/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — 4D Tesseract Engine
 * ═══════════════════════════════════════════════
 */

UR.Tesseract = (() => {

  /* ─── Generate 4D Hypercube Geometry ─── */
  const vertices = [];
  for (let i = 0; i < 16; i++) {
    vertices.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1
    ]);
  }

  const edges = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const xor = i ^ j;
      if (xor && !(xor & (xor - 1))) {
        edges.push([i, j]);
      }
    }
  }

  /**
   * Project 4D point to 3D with rotation
   * Uses XW, YZ, and ZW rotation planes
   */
  function project4D(v4, angle, scale) {
    let [x, y, z, w] = v4;

    // XW rotation
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    let nx = x * c - w * s;
    let nw = x * s + w * c;
    x = nx; w = nw;

    // YZ rotation (slower)
    c = Math.cos(angle * 0.618);
    s = Math.sin(angle * 0.618);
    let ny = y * c - z * s;
    let nz = y * s + z * c;
    y = ny; z = nz;

    // ZW rotation (slowest)
    c = Math.cos(angle * 0.23);
    s = Math.sin(angle * 0.23);
    let nz2 = z * c - w * s;
    let nw2 = z * s + w * c;
    z = nz2; w = nw2;

    // Perspective projection 4D → 3D
    const perspective = 3.0 / (3.0 - w);
    return {
      x: x * perspective * scale,
      y: y * perspective * scale,
      z: z * perspective * scale
    };
  }

  /**
   * Create a Three.js tesseract mesh group
   * Returns group with lines + dots
   */
  function createMesh(scale, opacity) {
    const posArray = new Float32Array(edges.length * 6);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: opacity
    });

    const lines = new THREE.LineSegments(lineGeom, lineMat);

    // Vertex dots
    const dotArray = new Float32Array(16 * 3);
    const dotGeom = new THREE.BufferGeometry();
    dotGeom.setAttribute('position', new THREE.BufferAttribute(dotArray, 3));

    const dotMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: scale < 4 ? 1.2 : 2.8,
      sizeAttenuation: true,
      transparent: true,
      opacity: opacity * 1.4
    });

    const dots = new THREE.Points(dotGeom, dotMat);

    // Group
    const group = new THREE.Group();
    group.add(lines);
    group.add(dots);
    group.userData = { lines, dots, scale, posArray, dotArray };

    return group;
  }

  /**
   * Update tesseract vertex positions at given rotation angle
   */
  function updateMesh(group, angle) {
    const { lines, dots, scale, posArray, dotArray } = group.userData;

    // Project all vertices
    const projected = vertices.map(v => project4D(v, angle, scale));

    // Update edge lines
    let idx = 0;
    for (const [i, j] of edges) {
      posArray[idx++] = projected[i].x;
      posArray[idx++] = projected[i].y;
      posArray[idx++] = projected[i].z;
      posArray[idx++] = projected[j].x;
      posArray[idx++] = projected[j].y;
      posArray[idx++] = projected[j].z;
    }
    lines.geometry.attributes.position.needsUpdate = true;

    // Update vertex dots
    for (let i = 0; i < 16; i++) {
      dotArray[i * 3]     = projected[i].x;
      dotArray[i * 3 + 1] = projected[i].y;
      dotArray[i * 3 + 2] = projected[i].z;
    }
    dots.geometry.attributes.position.needsUpdate = true;
  }

  return { createMesh, updateMesh, vertices, edges };
})();