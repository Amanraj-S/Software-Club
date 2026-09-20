import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AlgorithmNodesBackground({ lowIntensity = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.0018);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 400;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    // Node graph particles
    const particleCount = lowIntensity ? 60 : 130;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    const cyanColor = new THREE.Color(0x00f2fe);
    const blueColor = new THREE.Color(0x4facfe);
    const purpleColor = new THREE.Color(0x7928ca);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

      // Color variation
      const rand = Math.random();
      const c = rand > 0.6 ? cyanColor : rand > 0.3 ? blueColor : purpleColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      velocities.push({
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.4,
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture creator
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(0,242,254,0.8)');
    grad.addColorStop(1, 'rgba(0,242,254,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const pTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: lowIntensity ? 6 : 9,
      vertexColors: true,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connecting lines mesh (Dynamic Graph Edges)
    const lineMaxConnections = lowIntensity ? 90 : 180;
    const linePositions = new Float32Array(lineMaxConnections * 6);
    const lineColors = new Float32Array(lineMaxConnections * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });


    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.1;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;

      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      // Rotate whole node cluster slowly
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0004;

      // Update particle positions
      const posArr = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i].x;
        posArr[i * 3 + 1] += velocities[i].y;
        posArr[i * 3 + 2] += velocities[i].z;

        // Boundary bounce
        if (Math.abs(posArr[i * 3]) > 400) velocities[i].x *= -1;
        if (Math.abs(posArr[i * 3 + 1]) > 400) velocities[i].y *= -1;
        if (Math.abs(posArr[i * 3 + 2]) > 300) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      // Compute node-to-node graph edges
      let lineIndex = 0;
      let colorIndex = 0;
      const maxDistance = lowIntensity ? 90 : 120;

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArr[i * 3] - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance && lineIndex < lineMaxConnections * 6) {
            const alpha = 1 - dist / maxDistance;

            linePositions[lineIndex++] = posArr[i * 3];
            linePositions[lineIndex++] = posArr[i * 3 + 1];
            linePositions[lineIndex++] = posArr[i * 3 + 2];

            linePositions[lineIndex++] = posArr[j * 3];
            linePositions[lineIndex++] = posArr[j * 3 + 1];
            linePositions[lineIndex++] = posArr[j * 3 + 2];

            // Cyan tint line color with distance alpha
            lineColors[colorIndex++] = 0.0;
            lineColors[colorIndex++] = 0.95 * alpha;
            lineColors[colorIndex++] = 1.0 * alpha;

            lineColors[colorIndex++] = 0.3 * alpha;
            lineColors[colorIndex++] = 0.7 * alpha;
            lineColors[colorIndex++] = 1.0 * alpha;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [lowIntensity]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: lowIntensity ? 0.45 : 0.85 }}
    />
  );
}
