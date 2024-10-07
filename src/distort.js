import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls for interactivity
const controls = new OrbitControls(camera, renderer.domElement);

// Create geometry for the plane
const geometry = new THREE.PlaneGeometry(5, 5, 200, 200);

// Define custom shader material
const material = new THREE.ShaderMaterial({
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vUv = uv;

      // Create swirling effect by modifying vertex positions
      vec3 newPosition = position;
      float distance = length(newPosition.xy);
      
      // Add a swirling effect that grows with distance from the center
      float angle = atan(newPosition.y, newPosition.x);
      angle += sin(uTime + distance * 3.0) * 0.5; // Add time-based swirling
      
      newPosition.x = distance * cos(angle);
      newPosition.y = distance * sin(angle);
      newPosition.z += 0.1 * sin(uTime * 2.0 + distance * 10.0); // Add a bit of depth oscillation

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      // Generate a color based on UV and time for dynamic effect
      vec3 color = vec3(0.5 + 0.5 * cos(uTime + vUv.xyx * 6.0 + vec3(0.0, 2.0, 4.0)));
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0.0 },
  },
  side: THREE.DoubleSide,
  wireframe: false,
});

// Create the mesh with the geometry and custom shader material
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  // Update the uniform time value to animate vorticity effect
  material.uniforms.uTime.value = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
