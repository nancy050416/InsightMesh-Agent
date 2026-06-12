import './styles.css';
import * as THREE from 'three';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf2f4ef, 8, 28);
scene.fog = new THREE.Fog(0x05070c, 7, 30);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2.2, 10);

const root = new THREE.Group();
root.position.set(4.8, 0, -0.9);
scene.add(root);

const palette = {
  ink: 0xdfe7ff,
  teal: 0x60f5ff,
  amber: 0xb8a7ff,
  coral: 0xff6f91,
  paper: 0x080b12,
  leaf: 0x8affd2,
};

const ambient = new THREE.HemisphereLight(0xdbe7ff, 0x0b1020, 1.4);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffffff, 2.7);
key.position.set(4, 7, 6);
scene.add(key);

const coreGeometry = new THREE.IcosahedronGeometry(1.35, 3);
const coreMaterial = new THREE.MeshStandardMaterial({
  color: palette.teal,
  roughness: 0.22,
  metalness: 0.5,
  emissive: palette.teal,
  emissiveIntensity: 0.42,
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
core.position.set(2.4, 0.6, -0.3);
root.add(core);

const ringMaterial = new THREE.MeshStandardMaterial({
  color: palette.amber,
  roughness: 0.24,
  metalness: 0.55,
  transparent: true,
  opacity: 0.58,
});

for (let i = 0; i < 3; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05 + i * 0.52, 0.012, 12, 160), ringMaterial);
  ring.rotation.set(Math.PI / 2 + i * 0.32, i * 0.44, i * 0.22);
  ring.userData.spin = 0.0016 + i * 0.0008;
  core.add(ring);
}

const nodeGeometry = new THREE.SphereGeometry(0.095, 20, 20);
const docGeometry = new THREE.BoxGeometry(0.48, 0.64, 0.05);
const nodes = [];
const connections = [];

function makeMaterial(color, emissive = 0) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.42,
    metalness: 0.08,
    emissive: color,
    emissiveIntensity: emissive,
  });
}

const nodeMats = [
  makeMaterial(palette.teal, 0.2),
  makeMaterial(palette.amber, 0.08),
  makeMaterial(palette.coral, 0.08),
  makeMaterial(palette.leaf, 0.08),
];

for (let i = 0; i < 34; i += 1) {
  const angle = (i / 34) * Math.PI * 2;
  const radius = 3.2 + Math.sin(i * 1.9) * 0.95;
  const y = Math.cos(i * 0.73) * 1.55;
  const x = Math.cos(angle) * radius + 1.25;
  const z = Math.sin(angle) * radius - 1.2;
  const mesh = new THREE.Mesh(i % 5 === 0 ? docGeometry : nodeGeometry, nodeMats[i % nodeMats.length]);
  mesh.position.set(x, y, z);
  mesh.rotation.set(Math.random() * 0.45, Math.random() * 0.7, Math.random() * 0.25);
  mesh.userData.base = mesh.position.clone();
  mesh.userData.phase = Math.random() * Math.PI * 2;
  nodes.push(mesh);
  root.add(mesh);
}

function connect(a, b, color = 0x8ca39a, opacity = 0.36) {
  const geometry = new THREE.BufferGeometry().setFromPoints([a.position, b.position]);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const line = new THREE.Line(geometry, material);
  line.userData.a = a;
  line.userData.b = b;
  connections.push(line);
  root.add(line);
}

nodes.forEach((node, index) => {
  connect(node, core, index % 4 === 0 ? palette.amber : 0x8ba49d, index % 4 === 0 ? 0.5 : 0.24);
  if (index > 0 && index % 2 === 0) connect(node, nodes[index - 1], 0x91a5a0, 0.18);
});

const particleGeometry = new THREE.BufferGeometry();
const particleCount = 220;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  positions[i * 3] = (Math.random() - 0.5) * 15;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({ color: palette.ink, size: 0.02, transparent: true, opacity: 0.45 })
);
scene.add(particles);

const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
  pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
});

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  root.rotation.y = elapsed * 0.045 + pointer.x * 0.08;
  root.rotation.x = pointer.y * 0.035;
  core.rotation.y = elapsed * 0.24;
  core.rotation.x = Math.sin(elapsed * 0.5) * 0.12;

  core.children.forEach((ring) => {
    ring.rotation.z += ring.userData.spin;
    ring.rotation.x += ring.userData.spin * 0.4;
  });

  nodes.forEach((node, index) => {
    const pulse = Math.sin(elapsed * 1.4 + node.userData.phase) * 0.1;
    node.position.y = node.userData.base.y + pulse;
    node.scale.setScalar(1 + Math.max(0, Math.sin(elapsed * 2 + index)) * 0.08);
  });

  connections.forEach((line) => {
    const attr = line.geometry.attributes.position;
    attr.setXYZ(0, line.userData.a.position.x, line.userData.a.position.y, line.userData.a.position.z);
    attr.setXYZ(1, line.userData.b.position.x, line.userData.b.position.y, line.userData.b.position.z);
    attr.needsUpdate = true;
  });

  particles.rotation.y = elapsed * 0.018;
  camera.lookAt(5.4, 0.25, -1);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
