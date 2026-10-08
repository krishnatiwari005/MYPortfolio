'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnimatedBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 2000 : 4000;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000d1a, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    mountRef.current.appendChild(renderer.domElement);

    // 1. Grid Floor
    const gridGeometry = new THREE.PlaneGeometry(100, 100, 40, 40);
    const gridMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        color: { value: new THREE.Color(0x00e5ff) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        void main() {
          vUv = uv;
          vPosition = position;
          vec3 pos = position;
          pos.y += uTime * 0.3; // scroll forward
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform vec3 color;
        void main() {
          float grid1 = abs(fract(vUv.x * 40.0) - 0.5);
          float grid2 = abs(fract(vUv.y * 40.0) - 0.5);
          float line = min(grid1, grid2);
          
          float glow = smoothstep(0.05, 0.0, line);
          
          // distance fade
          float dist = length(vPosition.xy);
          float alpha = 1.0 - smoothstep(0.0, 30.0, dist);
          
          gl_FragColor = vec4(color, glow * alpha * 0.45);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -2;
    scene.add(gridMesh);

    // Removed Particle Tunnel and Ambient Floating Particles as per user request

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      gridMaterial.uniforms.uTime.value = time;

      if (!prefersReducedMotion) {
        scene.rotation.z += 0.001;
      }

      camera.position.x = Math.sin(time * 0.05) * 0.3;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      gridGeometry.dispose();
      gridMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
