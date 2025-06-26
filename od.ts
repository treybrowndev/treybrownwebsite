import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a gradient background
const gradientTexture = new THREE.TextureLoader().load('assets/textures/gradient.jpg'); // Replace with your gradient image
const backgroundGeometry = new THREE.PlaneGeometry(20, 20);
const backgroundMaterial = new THREE.MeshBasicMaterial({ map: gradientTexture });
const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
background.position.z = -10; // Push the background far back
scene.add(background);

// Load Blender models as floating icons
const loader = new GLTFLoader();
const icons: THREE.Object3D[] = [];
const iconPaths = ['assets/models/icon1.glb', 'assets/models/icon2.glb']; // Add paths to your models

iconPaths.forEach((path, index) => {
    loader.load(
        path,
        (gltf) => {
            const icon = gltf.scene;
            icon.position.set(
                Math.random() * 10 - 5, // Random X position
                Math.random() * 10 - 5, // Random Y position
                Math.random() * 2 - 1   // Random Z position
            );
            icons.push(icon);
            scene.add(icon);
        },
        undefined,
        (error) => {
            console.error(`Error loading model: ${path}`, error);
        }
    );
});

// Position the camera
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the icons to simulate floating
    icons.forEach((icon, index) => {
        icon.position.x += Math.sin(Date.now() * 0.001 + index) * 0.01;
        icon.position.y += Math.cos(Date.now() * 0.001 + index) * 0.01;
    });

    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();