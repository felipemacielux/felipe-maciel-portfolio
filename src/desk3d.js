import * as THREE from "three";

// Bancada dev estilizada, arrastável com o mouse/touch. Chamado via lazy-load em main.js.
export function initDesk3d(container) {
  const width = container.clientWidth || 300;
  const height = container.clientHeight || 300;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(3.2, 2.6, 4.2);
  camera.lookAt(0, 0.4, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1);
  key.position.set(4, 6, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0x8b5cf6, 1.2, 10);
  rim.position.set(-3, 2, -2);
  scene.add(rim);

  const rig = new THREE.Group();
  scene.add(rig);

  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.15, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.6 })
  );
  desk.position.y = -0.1;
  rig.add(desk);

  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.9, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 })
  );
  monitor.position.set(-0.6, 0.65, -0.5);
  rig.add(monitor);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.3, 0.72),
    new THREE.MeshStandardMaterial({ color: 0x6366f1, emissive: 0x6366f1, emissiveIntensity: 0.7 })
  );
  screen.position.set(-0.6, 0.65, -0.46);
  rig.add(screen);

  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.25, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x27272a })
  );
  stand.position.set(-0.6, 0.1, -0.5);
  rig.add(stand);

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.06, 0.32),
    new THREE.MeshStandardMaterial({ color: 0x27272a })
  );
  keyboard.position.set(-0.55, 0.03, 0.2);
  rig.add(keyboard);

  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.12, 0.28, 16),
    new THREE.MeshStandardMaterial({ color: 0xec4899 })
  );
  mug.position.set(0.9, 0.14, 0.3);
  rig.add(mug);

  const potBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.2, 0.22, 12),
    new THREE.MeshStandardMaterial({ color: 0x3f3f46 })
  );
  potBase.position.set(1.3, 0.11, -0.4);
  rig.add(potBase);

  const leaf = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x22c55e })
  );
  leaf.position.set(1.3, 0.55, -0.4);
  rig.add(leaf);

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velocityX = 0.002;

  const onPointerDown = (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
  };
  const onPointerMove = (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    rig.rotation.y += deltaX * 0.01;
    rig.rotation.x = Math.max(-0.4, Math.min(0.4, rig.rotation.x + deltaY * 0.01));
    velocityX = deltaX * 0.0005;
    lastX = event.clientX;
    lastY = event.clientY;
  };
  const onPointerUp = () => {
    dragging = false;
  };

  renderer.domElement.style.cursor = "grab";
  renderer.domElement.addEventListener("pointerdown", (e) => {
    onPointerDown(e);
    renderer.domElement.style.cursor = "grabbing";
  });
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", () => {
    onPointerUp();
    renderer.domElement.style.cursor = "grab";
  });

  const resize = () => {
    const w = container.clientWidth || width;
    const h = container.clientHeight || height;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", resize);

  const animate = () => {
    if (!dragging) {
      rig.rotation.y += velocityX;
      velocityX *= 0.97;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
}
