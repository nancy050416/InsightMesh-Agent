import './styles.css';
import * as THREE from 'three';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x05070c, 8, 28);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.45, 8.6);

const ambient = new THREE.HemisphereLight(0xffffff, 0x121725, 1.35);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xffffff, 3.2);
key.position.set(4, 6, 5);
scene.add(key);

const rim = new THREE.DirectionalLight(0x86f7ff, 2.2);
rim.position.set(-5, 2.5, -3);
scene.add(rim);

const flask = new THREE.Group();
flask.rotation.set(-0.16, 0.22, -0.18);
flask.scale.setScalar(0.9);
scene.add(flask);

const steel = new THREE.MeshPhysicalMaterial({
  color: 0xdfe7f4,
  roughness: 0.18,
  metalness: 0.82,
  clearcoat: 0.78,
  clearcoatRoughness: 0.18,
});

const darkSteel = new THREE.MeshPhysicalMaterial({
  color: 0x121722,
  roughness: 0.24,
  metalness: 0.72,
  clearcoat: 0.42,
});

const glow = new THREE.MeshBasicMaterial({
  color: 0x8ef7ff,
  transparent: true,
  opacity: 0.18,
});

const body = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.94, 3.9, 96, 1), steel);
body.position.y = -0.12;
flask.add(body);

const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.86, 96, 24, 0, Math.PI * 2, 0, Math.PI / 2), steel);
shoulder.scale.set(1, 0.34, 1);
shoulder.position.y = 1.83;
flask.add(shoulder);

const base = new THREE.Mesh(new THREE.SphereGeometry(0.94, 96, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), steel);
base.scale.set(1, 0.28, 1);
base.position.y = -2.07;
flask.add(base);

const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.56, 80), steel);
neck.position.y = 2.22;
flask.add(neck);

const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.48, 80), darkSteel);
cap.position.y = 2.66;
flask.add(cap);

const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.5, 0.08, 80), steel);
capTop.position.y = 2.94;
flask.add(capTop);

const band = new THREE.Mesh(new THREE.TorusGeometry(0.555, 0.035, 14, 96), steel);
band.position.y = 2.4;
band.rotation.x = Math.PI / 2;
flask.add(band);

const highlight = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 3.1), glow);
highlight.position.set(-0.42, -0.06, 0.952);
highlight.rotation.y = -0.12;
flask.add(highlight);

const floorGlow = new THREE.Mesh(
  new THREE.RingGeometry(1.4, 2.8, 128),
  new THREE.MeshBasicMaterial({ color: 0x8ef7ff, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
);
floorGlow.rotation.x = -Math.PI / 2;
floorGlow.position.y = -2.45;
scene.add(floorGlow);

const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 90;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  positions[i * 3] = (Math.random() - 0.5) * 12;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({ color: 0xdfe7ff, size: 0.014, transparent: true, opacity: 0.32 })
);
scene.add(particles);

const pointer = { x: 0, y: 0 };
window.addEventListener('pointermove', (event) => {
  pointer.x = event.clientX / window.innerWidth - 0.5;
  pointer.y = event.clientY / window.innerHeight - 0.5;
});

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.8);

  flask.rotation.x = -0.16 + pointer.y * 0.22 + scroll * 0.12;
  flask.rotation.y = 0.22 + pointer.x * 0.7 + scroll * 1.55;
  flask.rotation.z = -0.18 + Math.sin(elapsed * 0.55) * 0.025;
  flask.position.y = Math.sin(elapsed * 0.8) * 0.06 - scroll * 0.18;
  flask.scale.setScalar(0.9 - Math.min(scroll * 0.08, 0.12));
  canvas.style.opacity = String(Math.max(0.95 - scroll * 0.38, 0.28));

  floorGlow.scale.setScalar(1 + Math.sin(elapsed * 0.7) * 0.04);
  particles.rotation.y = elapsed * 0.015;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
