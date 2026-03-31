/**
 * ═══════════════════════════════════════════════
 *  UNPROVABLE REALITY — Three.js Scene Manager
 * ═══════════════════════════════════════════════
 */

UR.Scene = (() => {
  let scene, camera, renderer, clock;
  let soloTesseract;
  let ripples = [];

  function init() {
    clock = new THREE.Clock();

    /* ─── Scene ─── */
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    /* ─── Camera ─── */
    camera = new THREE.PerspectiveCamera(
      55,
      UR.state.width / UR.state.height,
      0.1,
      500
    );
    camera.position.z = 32;

    /* ─── Renderer ─── */
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(UR.state.width, UR.state.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000);
    document.getElementById('webgl').appendChild(renderer.domElement);

    /* ─── Lights ─── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const keyLight = new THREE.PointLight(0xffffff, 0.65, 90);
    keyLight.position.set(8, 12, 22);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x6666cc, 0.2, 70);
    fillLight.position.set(-12, -6, 16);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x333366, 0.15, 50);
    rimLight.position.set(0, 5, -15);
    scene.add(rimLight);

    /* ─── Create Scene Objects ─── */
    UR.Particles.create(scene);
    UR.Tshirt.create(scene);
    UR.Chaos.create(scene);

    // Solo tesseract for 4th dimension section
    soloTesseract = UR.Tesseract.createMesh(5.8, 0.65);
    soloTesseract.position.set(0, 0, -8);
    soloTesseract.visible = false;
    scene.add(soloTesseract);

    /* ─── Click Ripple ─── */
    document.addEventListener('click', createRipple);

    /* ─── Window Resize ─── */
    window.addEventListener('resize', handleResize);

    /* ─── Start Loop ─── */
    clock.start();
    animate();
  }

  function createRipple(e) {
    const nx = (e.clientX / UR.state.width) * 2 - 1;
    const ny = -(e.clientY / UR.state.height) * 2 + 1;

    const ringGeom = new THREE.RingGeometry(0.04, 0.1, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(ringGeom, ringMat);
    mesh.position.set(nx * 18, ny * 11, 6);
    scene.add(mesh);
    ripples.push(mesh);

    gsap.to(mesh.scale, {
      x: 30, y: 30, z: 30,
      duration: 3,
      ease: 'power2.out'
    });

    gsap.to(mesh.material, {
      opacity: 0,
      duration: 3,
      ease: 'power2.out',
      onComplete: () => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
    });
  }

  function handleResize() {
    UR.handleResize();
    camera.aspect = UR.state.width / UR.state.height;
    camera.updateProjectionMatrix();
    renderer.setSize(UR.state.width, UR.state.height);
  }

  /* ─── Main Animation Loop ─── */
  function animate() {
    requestAnimationFrame(animate);

    if (!UR.state.loaded) {
      renderer.render(scene, camera);
      return;
    }

    const time = clock.getElapsedTime();

    // Smooth mouse
    UR.state.mouse.sx += (UR.state.mouse.x - UR.state.mouse.sx) * 0.055;
    UR.state.mouse.sy += (UR.state.mouse.y - UR.state.mouse.sy) * 0.055;

    /* ─── Update All Systems ─── */
    UR.Cursor.update();
    UR.Particles.update(time);
    UR.Tshirt.update(time);
    UR.Chaos.update(time);
    UR.Audio.update(time);

    // Solo tesseract
    if (soloTesseract && soloTesseract.visible) {
      UR.Tesseract.updateMesh(soloTesseract, time * 0.32);
      soloTesseract.rotation.y = UR.state.mouse.sx * 0.45;
      soloTesseract.rotation.x = UR.state.mouse.sy * 0.3;
    }

    // Ripple cleanup
    ripples = ripples.filter(r => r.parent);

    /* ─── Camera Follow ─── */
    camera.position.x += (UR.state.mouse.sx * 2.8 - camera.position.x) * 0.035;
    camera.position.y += (UR.state.mouse.sy * 1.6 - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  /* ─── Public API for Solo Tesseract ─── */
  function showSoloTesseract() { if (soloTesseract) soloTesseract.visible = true; }
  function hideSoloTesseract() { if (soloTesseract) soloTesseract.visible = false; }

  return { init, showSoloTesseract, hideSoloTesseract };
})();