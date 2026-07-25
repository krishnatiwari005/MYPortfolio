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

    // 2. Particle Tunnel
    const tunnelGeometry = new THREE.BufferGeometry();
    const tunnelGeometry2 = new THREE.BufferGeometry();
    const tunnelPositions = new Float32Array(PARTICLE_COUNT * 3);
    const tunnelPositions2 = new Float32Array(PARTICLE_COUNT * 3);
    const tunnelSizes = new Float32Array(PARTICLE_COUNT);
    const tunnelSizes2 = new Float32Array(PARTICLE_COUNT);
    const tunnelT = new Float32Array(PARTICLE_COUNT);
    const tunnelT2 = new Float32Array(PARTICLE_COUNT);
    const tunnelRadius = new Float32Array(PARTICLE_COUNT);
    const tunnelRadius2 = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      tunnelT[i] = Math.random() * Math.PI * 20 - Math.PI * 10;
      tunnelRadius[i] = 1.5 + Math.random() * 2.0;
      tunnelSizes[i] = 0.02 + Math.random() * 0.06;

      tunnelT2[i] = Math.random() * Math.PI * 20 - Math.PI * 10;
      tunnelRadius2[i] = 1.5 + Math.random() * 2.0;
      tunnelSizes2[i] = 0.02 + Math.random() * 0.06;
    }

    tunnelGeometry.setAttribute('position', new THREE.BufferAttribute(tunnelPositions, 3));
    tunnelGeometry.setAttribute('size', new THREE.BufferAttribute(tunnelSizes, 1));
    tunnelGeometry.setAttribute('t', new THREE.BufferAttribute(tunnelT, 1));
    tunnelGeometry.setAttribute('radius', new THREE.BufferAttribute(tunnelRadius, 1));

    tunnelGeometry2.setAttribute('position', new THREE.BufferAttribute(tunnelPositions2, 3));
    tunnelGeometry2.setAttribute('size', new THREE.BufferAttribute(tunnelSizes2, 1));
    tunnelGeometry2.setAttribute('t', new THREE.BufferAttribute(tunnelT2, 1));
    tunnelGeometry2.setAttribute('radius', new THREE.BufferAttribute(tunnelRadius2, 1));


    const tunnelMaterial = new THREE.PointsMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      size: 0.03
    });

    const tunnelMaterial2 = new THREE.PointsMaterial({
      color: 0x00b4d8,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      size: 0.02
    });

    const tunnelMesh = new THREE.Points(tunnelGeometry, tunnelMaterial);
    const tunnelMesh2 = new THREE.Points(tunnelGeometry2, tunnelMaterial2);
    
    if (!prefersReducedMotion) {
      scene.add(tunnelMesh);
      scene.add(tunnelMesh2);
    }

    // 3. Ambient Floating Particles
    const ambientCount = 300;
    const ambientGeometry = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientVelocities: { x: number; y: number; z: number; }[] = [];

    for (let i = 0; i < ambientCount; i++) {
      const r = 8 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      ambientPositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      ambientPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      ambientPositions[i*3+2] = r * Math.cos(phi);

      ambientVelocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      });
    }

    ambientGeometry.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    const ambientMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      size: 0.02
    });
    const ambientMesh = new THREE.Points(ambientGeometry, ambientMaterial);
    scene.add(ambientMesh);

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      gridMaterial.uniforms.uTime.value = time;

      if (!prefersReducedMotion) {
        scene.rotation.z += 0.001;

        const posAttr = tunnelGeometry.attributes.position;
        const posAttr2 = tunnelGeometry2.attributes.position;
        
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          tunnelT[i] -= 0.02; // Move towards camera
          if (tunnelT[i] < -10) tunnelT[i] += 20; // wrap around
          
          posAttr.setXYZ(i,
            tunnelRadius[i] * Math.cos(tunnelT[i]),
            tunnelRadius[i] * Math.sin(tunnelT[i]),
            tunnelT[i] * 2
          );

          tunnelT2[i] -= 0.015;
          if (tunnelT2[i] < -10) tunnelT2[i] += 20;
          
          posAttr2.setXYZ(i,
            tunnelRadius2[i] * Math.cos(tunnelT2[i] + Math.PI),
            tunnelRadius2[i] * Math.sin(tunnelT2[i] + Math.PI),
            tunnelT2[i] * 2
          );
        }
        posAttr.needsUpdate = true;
        posAttr2.needsUpdate = true;
      }

      // Update ambient particles
      const ambPosAttr = ambientGeometry.attributes.position;
      for (let i = 0; i < ambientCount; i++) {
        let x = ambPosAttr.getX(i) + ambientVelocities[i].x;
        let y = ambPosAttr.getY(i) + ambientVelocities[i].y;
        let z = ambPosAttr.getZ(i) + ambientVelocities[i].z;

        if (x*x + y*y + z*z > 64) {
          x *= -0.99;
          y *= -0.99;
          z *= -0.99;
        }

        ambPosAttr.setXYZ(i, x, y, z);
      }
      ambPosAttr.needsUpdate = true;

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
      tunnelGeometry.dispose();
      tunnelGeometry2.dispose();
      tunnelMaterial.dispose();
      tunnelMaterial2.dispose();
      ambientGeometry.dispose();
      ambientMaterial.dispose();
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
