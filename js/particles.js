/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — Lorenz Attractor Particles
 * ═══════════════════════════════════════════════
 */

UR.Particles = (() => {
  let system;

  /* ─── Custom Shader ─── */
  const vertexShader = `
    attribute float size;
    attribute float alpha;
    varying vec3 vColor;
    varying float vAlpha;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uGlobalAlpha;

    void main() {
      vColor = color;
      vAlpha = alpha * uGlobalAlpha;

      vec3 pos = position;

      // React to mouse proximity
      float dist = length(pos.xy - uMouse * 20.0);
      vec2 dir = normalize(pos.xy - uMouse * 20.0 + 0.001);
      pos.xy += dir * 4.0 / (dist + 3.0);

      // Organic flow
      pos.x += sin(uTime * 0.2 + pos.z * 0.06) * 0.8;
      pos.y += cos(uTime * 0.15 + pos.x * 0.05) * 0.6;
      pos.z += sin(uTime * 0.1 + pos.y * 0.04) * 0.4;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      float dist = length(gl_PointCoord - 0.5);
      if (dist > 0.5) discard;

      float fadeEdge = 1.0 - smoothstep(0.05, 0.5, dist);
      float glow = exp(-dist * 4.0) * 0.3;
      float a = (fadeEdge + glow) * vAlpha;

      gl_FragColor = vec4(vColor, a * 0.5);
    }
  `;

  function create(scene) {
    const COUNT = UR.state.isMobile ? 5000 : 16000;

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);

    // Generate positions via Lorenz system
    let x = 0.1, y = 0, z = 0;
    const sigma = 10, rho = 28, beta = 8 / 3;
    const dt = 0.005;

    for (let i = 0; i < COUNT; i++) {
      const dx = sigma * (y - x) * dt;
      const dy = (x * (rho - z) - y) * dt;
      const dz = (x * y - beta * z) * dt;
      x += dx; y += dy; z += dz;

      positions[i * 3]     = x * 0.5;
      positions[i * 3 + 1] = (y - 25) * 0.5;
      positions[i * 3 + 2] = (z - 25) * 0.5;

      // Subtle color variation
      const brightness = Math.random() * 0.35 + 0.06;
      colors[i * 3]     = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness * 1.2; // Slight blue tint

      sizes[i] = Math.random() * 2.2 + 0.3;
      alphas[i] = Math.random() * 0.6 + 0.3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uGlobalAlpha: { value: 1 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    system = new THREE.Points(geometry, material);
    system.rotation.x = 0.15;
    scene.add(system);

    return system;
  }

  function update(time) {
    if (!system) return;

    const uniforms = system.material.uniforms;
    uniforms.uTime.value = time;
    uniforms.uMouse.value.set(UR.state.mouse.sx, UR.state.mouse.sy);
    uniforms.uGlobalAlpha.value = 1 - UR.state.scroll * 0.7;

    system.rotation.y = time * 0.012;
    system.rotation.x = 0.15 + Math.sin(time * 0.006) * 0.1;
  }

  function getSystem() { return system; }

  return { create, update, getSystem };
})();