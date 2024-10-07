import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

// Create a scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up camera position
camera.position.z = 5;

// Create font loader
const loader = new FontLoader();

// Load font and create text
loader.load("../assets/fonts/gentilis_bold.typeface.json", function (font) {
  const geometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  // Create material and mesh
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const textMesh = new THREE.Mesh(geometry, material);

  // Center the text
  geometry.computeBoundingBox();
  const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
  textMesh.position.set(-textWidth / 2, 0, 0);

  // Add text to the scene
  scene.add(textMesh);

  // Add lighting
  const light = new THREE.PointLight(0xffffff, 100, 100);
  light.position.set(0, 0, 10);
  scene.add(light);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    textMesh.rotation.x += 0.01;
    textMesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
});
