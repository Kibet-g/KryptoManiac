/**
 * Premium MarketGlobe - 3D Interactive Market Visualization
 * Using Three.js for stunning 3D graphics and immersive market data
 */
import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { CoinList } from '../../config/api';

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
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 24,
    left: 24,
    color: '#fff',
    zIndex: 10,
    pointerEvents: 'none',
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 700,
  },
  legend: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    display: 'flex',
    gap: 20,
    background: 'rgba(255,255,255,0.03)',
    padding: '10px 20px',
    borderRadius: 30,
    border: '1px solid rgba(255,255,255,0.05)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },
  statsOverlay: {
    position: 'absolute',
    top: 24,
    right: 24,
    textAlign: 'right',
  },
  statBox: {
    background: 'rgba(0,0,0,0.2)',
    padding: '12px 20px',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fallback: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#fff',
    textAlign: 'center',
    gap: 20,
    background: 'radial-gradient(circle at center, #1a1a3e 0%, #0a0a1a 100%)',
  },
  fallbackLoader: {
    width: 60,
    height: 60,
    border: '2px solid rgba(0, 212, 255, 0.1)',
    borderTopColor: '#00d4ff',
    borderRadius: '50%',
    animation: '$spin 1s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
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
          console.error("Globe fetch error", error);
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
    
    const init = async () => {
      try {
        const THREE = await import('three');
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
        setThreeLoaded(false);
      }
    };

    init();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (renderer) renderer.dispose();
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
