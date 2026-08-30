import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Notebook3DSceneProps {
  currentTopic?: string;
  problemTitle?: string;
  problemNumber?: number | null;
  className?: string;
}

export const Notebook3DScene: React.FC<Notebook3DSceneProps> = ({
  currentTopic = 'Arrays',
  problemTitle = 'Set Matrix Zeroes',
  problemNumber = 73,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 220;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group for the entire notebook & stickers
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Notebook cover (leather brown / Cocoa Ink #2b1a07)
    const coverGeom = new THREE.BoxGeometry(2.4, 3.2, 0.22);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x2b1a07,
      roughness: 0.6,
      metalness: 0.1,
    });
    const coverMesh = new THREE.Mesh(coverGeom, coverMat);
    coverMesh.castShadow = true;
    mainGroup.add(coverMesh);

    // Paper pages edge (Cream #fdfbf9)
    const pagesGeom = new THREE.BoxGeometry(2.28, 3.08, 0.18);
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xf7efe9,
      roughness: 0.9,
    });
    const pagesMesh = new THREE.Mesh(pagesGeom, pagesMat);
    pagesMesh.position.set(0.06, 0, 0);
    mainGroup.add(pagesMesh);

    // Spine border band (Marker Orange #ff6f1e)
    const spineGeom = new THREE.BoxGeometry(0.3, 3.22, 0.24);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0xff6f1e,
      roughness: 0.4,
    });
    const spineMesh = new THREE.Mesh(spineGeom, spineMat);
    spineMesh.position.set(-1.1, 0, 0);
    mainGroup.add(spineMesh);

    // Name Label Sticker on cover (White card)
    const labelGeom = new THREE.PlaneGeometry(1.4, 0.9);
    const labelMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const labelMesh = new THREE.Mesh(labelGeom, labelMat);
    labelMesh.position.set(0.15, 0.6, 0.12);
    mainGroup.add(labelMesh);

    // Label border outline
    const labelBorderGeom = new THREE.PlaneGeometry(1.44, 0.94);
    const labelBorderMat = new THREE.MeshBasicMaterial({
      color: 0x171717,
      side: THREE.DoubleSide,
    });
    const labelBorderMesh = new THREE.Mesh(labelBorderGeom, labelBorderMat);
    labelBorderMesh.position.set(0.15, 0.6, 0.118);
    mainGroup.add(labelBorderMesh);

    // Floating Stickers
    // 1. Sky Blue Lightning Bolt / Pyramid
    const boltGeom = new THREE.TetrahedronGeometry(0.32);
    const boltMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.3,
    });
    const boltMesh = new THREE.Mesh(boltGeom, boltMat);
    boltMesh.position.set(1.6, -1.1, 0.6);
    scene.add(boltMesh);

    // 2. Pink Torus (Bubblegum #ff66cf)
    const torusGeom = new THREE.TorusGeometry(0.24, 0.08, 12, 24);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xff66cf,
      roughness: 0.3,
    });
    const torusMesh = new THREE.Mesh(torusGeom, torusMat);
    torusMesh.position.set(-1.6, 1.2, 0.4);
    torusMesh.rotation.x = Math.PI / 4;
    scene.add(torusMesh);

    // 3. Green Sprout Star / Octahedron
    const starGeom = new THREE.OctahedronGeometry(0.25);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.4,
    });
    const starMesh = new THREE.Mesh(starGeom, starMat);
    starMesh.position.set(1.5, 1.3, 0.5);
    scene.add(starMesh);

    // Lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 6, 6);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xff6f1e, 0.5);
    backLight.position.set(-5, -4, -3);
    scene.add(backLight);

    const ambientLight = new THREE.AmbientLight(0xfff8f2, 0.8);
    scene.add(ambientLight);

    // Interaction & Animation
    let targetRotX = 0.15;
    let targetRotY = -0.3;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let frameId: number;
    const startTime = Date.now();

    function animate() {
      const elapsed = (Date.now() - startTime) * 0.001;

      targetRotY = -0.3 + mouseX * 0.35 + Math.sin(elapsed * 0.8) * 0.08;
      targetRotX = 0.15 - mouseY * 0.3 + Math.cos(elapsed * 0.6) * 0.06;

      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.08;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.08;
      mainGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;

      boltMesh.rotation.y += 0.02;
      boltMesh.rotation.x += 0.01;
      boltMesh.position.y = -1.1 + Math.sin(elapsed * 2.0 + 1) * 0.12;

      torusMesh.rotation.z += 0.015;
      torusMesh.position.y = 1.2 + Math.cos(elapsed * 1.8) * 0.1;

      starMesh.rotation.x += 0.02;
      starMesh.rotation.y += 0.02;
      starMesh.position.y = 1.3 + Math.sin(elapsed * 1.6 + 2) * 0.09;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 220;
      const h = container.clientHeight || 220;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-cream-paper border border-charcoal rounded-pill px-2.5 py-0.5 text-[10px] font-semibold text-cocoa-ink shadow-sm pointer-events-none whitespace-nowrap">
        notebook #{problemNumber || 'sde'}
      </div>
    </div>
  );
};
