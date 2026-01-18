/**
 * FloatingParticles - Ambient 3D background effect
 * Creates floating crypto coin particles using Three.js
 */
import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.6,
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
}));

const FloatingParticles = ({ count = 50 }) => {
  const classes = useStyles();
  const containerRef = useRef(null);
  const [, setIsLoaded] = useState(false);

  useEffect(() => {
    let scene, camera, renderer, particles;
    let animationId;
    let mouseX = 0, mouseY = 0;

    const init = async () => {
      try {
        const THREE = await import('three');
        
        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;

        renderer = new THREE.WebGLRenderer({ 
          alpha: true,
          antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        if (containerRef.current) {
          containerRef.current.appendChild(renderer.domElement);
        }

        // Create particles
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const colorPalette = [
          new THREE.Color('#00d4ff'), // Cyan
          new THREE.Color('#7b2dff'), // Purple
          new THREE.Color('#00ff88'), // Green
          new THREE.Color('#ff6b35'), // Orange (Bitcoin)
          new THREE.Color('#627eea'), // Blue (Ethereum)
        ];

        for (let i = 0; i < count; i++) {
          // Spread particles in 3D space
          positions[i * 3] = (Math.random() - 0.5) * 100;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

          // Random colors from palette
          const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;

          sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for glowing particles
        const material = new THREE.PointsMaterial({
          size: 1.5,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        setIsLoaded(true);

        // Mouse movement handler
        const onMouseMove = (event) => {
          mouseX = (event.clientX / window.innerWidth) * 2 - 1;
          mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', onMouseMove);

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);

          // Rotate particles based on time
          particles.rotation.y += 0.0005;
          particles.rotation.x += 0.0002;

          // Subtle parallax effect
          particles.rotation.y += mouseX * 0.0005;
          particles.rotation.x += mouseY * 0.0005;

          // Float individual particles
          const positions = particles.geometry.attributes.position.array;
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
          }
          particles.geometry.attributes.position.needsUpdate = true;

          renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onResize);

        // Cleanup
        return () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('resize', onResize);
          cancelAnimationFrame(animationId);
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement);
          }
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
      } catch (error) {
        console.log('Three.js not available, skipping particles');
      }
    };

    const cleanup = init();
    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, [count]);

  return <div ref={containerRef} className={classes.container} />;
};

export default FloatingParticles;
