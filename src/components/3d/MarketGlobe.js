/**
 * Premium MarketGlobe - 3D Interactive Market Visualization
 * Using Three.js for stunning 3D graphics and immersive market data
 */
import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { CoinList } from '../../config/api';

import { mockCoins } from '../../config/mockData';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: 450,
    borderRadius: 32,
    overflow: 'hidden',
    background: 'transparent',
    position: 'relative',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
// ... [existing styles] ...
  },
// ...
}));

const MarketGlobe = ({ coins = [] }) => {
  const classes = useStyles();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [stats, setStats] = useState({ bullish: 0, total: 0 });
  const [internalCoins, setInternalCoins] = useState([]);

  useEffect(() => {
    // Fetch coins if not provided
    const fetchCoins = async () => {
      if (coins.length === 0) {
        try {
          const { data } = await axios.get(CoinList("usd"));
          setInternalCoins(data.slice(0, 100));
        } catch (error) {
          console.error("Globe fetch error, utilizing fallback data", error);
          setInternalCoins(mockCoins);
        }
      }
    };
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coins]);

  const displayCoins = coins.length > 0 ? coins : internalCoins;

  useEffect(() => {
    // Calculate market stats
    if (displayCoins.length > 0) {
      const bullish = displayCoins.filter(c => c.price_change_percentage_24h > 0).length;
      setStats({ bullish, total: displayCoins.length });
    }
  }, [displayCoins]);

  useEffect(() => {
    let renderer, scene, camera, globe, particles = [];
    let isMounted = true;
    
    const init = async () => {
      try {
        const THREE = await import('three');
        if (!isMounted) return; // Prevent async race condition

        setThreeLoaded(true);

        if (!containerRef.current || !canvasRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 6;

        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create inner core
        const coreGeom = new THREE.SphereGeometry(1.4, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.1,
        });
        const core = new THREE.Mesh(coreGeom, coreMat);
        scene.add(core);

        // Create globe mesh (wireframe)
        const globeGeom = new THREE.SphereGeometry(2, 40, 40);
        const globeMat = new THREE.MeshBasicMaterial({
          color: 0x7b2dff,
          wireframe: true,
          transparent: true,
          opacity: 0.05,
        });
        globe = new THREE.Mesh(globeGeom, globeMat);
        scene.add(globe);

        // Add particles for coins
        const particleGeom = new THREE.SphereGeometry(0.06, 8, 8);
        displayCoins.slice(0, 100).forEach((coin, i) => {
          const isBull = (coin.price_change_percentage_24h || 0) > 0;
          const material = new THREE.MeshBasicMaterial({
            color: isBull ? 0x00ff88 : 0xff3366,
            transparent: true,
            opacity: 0.8,
          });
          const particle = new THREE.Mesh(particleGeom, material);

          // Golden Ratio distribution
          const phi = Math.acos(-1 + (2 * i) / 100);
          const theta = Math.sqrt(100 * Math.PI) * phi;
          
          const radius = 2.5 + Math.random() * 0.4;
          particle.position.x = radius * Math.cos(theta) * Math.sin(phi);
          particle.position.y = radius * Math.sin(theta) * Math.sin(phi);
          particle.position.z = radius * Math.cos(phi);
          
          particle.userData = { 
            originalRadius: radius,
            speed: 0.2 + Math.random() * 0.3,
            offset: Math.random() * Math.PI * 2
          };
          
          particles.push(particle);
          scene.add(particle);
        });


        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        let time = 0;
        const animate = () => {
          if (!isMounted || !renderer) return;

          time += 0.005;
          
          if (globe) globe.rotation.y += 0.001;
          
          particles.forEach((p) => {
            const data = p.userData;
            const float = Math.sin(time * data.speed + data.offset) * 0.1;
            p.position.multiplyScalar(1 + float / p.position.length());
            p.rotation.y += 0.01;
          });

          renderer.render(scene, camera);
          animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
          if (!containerRef.current) return;
          const w = containerRef.current.clientWidth;
          const h = containerRef.current.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

      } catch (err) {
        console.error('Three.js failed', err);
        if (isMounted) setThreeLoaded(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (renderer) {
        renderer.dispose();
        // Clean up scene to avoid WebGL context warnings
        if (scene) {
          scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (object.material.length) {
                 for (let i = 0; i < object.material.length; ++i) {
                   object.material[i].dispose();
                 }
              } else {
                 object.material.dispose();
              }
            }
          });
        }
      }
    };
  }, [coins, displayCoins]);

  return (
    <div className={classes.container} ref={containerRef}>
      {threeLoaded ? (
        <canvas ref={canvasRef} className={classes.canvas} />
      ) : (
        <div className={classes.fallback}>
          <div className={classes.fallbackLoader} />
          <div className={classes.subtitle}>Materializing Metaverse...</div>
        </div>
      )}
      
      <div className={classes.overlay}>
        <div className={classes.subtitle}>Global Pulse</div>
        <div className={classes.title}>Real-time Market Sphere</div>
      </div>

      <div className={classes.statsOverlay}>
        <div className={classes.statBox}>
          <div className={classes.statValue}>
            {((stats.bullish / stats.total) * 100 || 0).toFixed(1)}%
          </div>
          <div className={classes.statLabel}>Market Sentiment</div>
        </div>
      </div>

      <div className={classes.legend}>
        <div className={classes.legendItem}>
          <div className={classes.dot} style={{ background: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
          Bullish
        </div>
        <div className={classes.legendItem}>
          <div className={classes.dot} style={{ background: '#ff3366', boxShadow: '0 0 10px #ff3366' }} />
          Bearish
        </div>
        <div className={classes.legendItem}>
          <div className={classes.dot} style={{ background: '#7b2dff', opacity: 0.3 }} />
          Neutral
        </div>
      </div>
    </div>
  );
};

export default MarketGlobe;
