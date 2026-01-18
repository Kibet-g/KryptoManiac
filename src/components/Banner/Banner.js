/**
 * Premium Banner with 3D Effects
 * Apple-style hero section with floating particles and animated stats
 */
import { Container, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Corousels from './Corousels';
import FloatingParticles from '../3d/FloatingParticles';
import GlassCard from '../ui/GlassCard';
import AnimatedCounter from '../ui/AnimatedCounter';
import { GlobalStats } from '../../config/api';
import { CryptoState } from '../../CryptoContext';

const useStyles = makeStyles((theme) => ({
  banner: {
    position: 'relative',
    background: 'linear-gradient(180deg, #0a0b14 0%, #12141f 100%)',
    overflow: 'hidden',
    minHeight: 600,
    [theme.breakpoints.down('sm')]: {
      minHeight: 500,
    },
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(123, 45, 255, 0.12) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    paddingTop: 60,
    paddingBottom: 40,
  },
  hero: {
    textAlign: 'center',
    marginBottom: 50,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 20px',
    background: 'rgba(0, 212, 255, 0.1)',
    border: '1px solid rgba(0, 212, 255, 0.3)',
    borderRadius: 30,
    marginBottom: 24,
    fontSize: 13,
    fontWeight: 500,
    color: '#00d4ff',
    animation: '$fadeInUp 0.6s ease-out',
  },
  title: {
    fontSize: 64,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 50%, #7b2dff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: 16,
    fontFamily: "'Inter', 'Montserrat', sans-serif",
    letterSpacing: '-2px',
    animation: '$fadeInUp 0.6s ease-out 0.1s both',
    [theme.breakpoints.down('sm')]: {
      fontSize: 40,
    },
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 400,
    maxWidth: 600,
    margin: '0 auto',
    lineHeight: 1.6,
    animation: '$fadeInUp 0.6s ease-out 0.2s both',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
    marginTop: 50,
    animation: '$fadeInUp 0.6s ease-out 0.3s both',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      gap: 12,
    },
  },
  statCard: {
    textAlign: 'center',
    padding: 24,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 4,
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
    },
  },
  statChange: {
    fontSize: 13,
    fontWeight: 500,
  },
  positive: {
    color: '#00ff88',
  },
  negative: {
    color: '#ff3366',
  },
  carouselSection: {
    marginTop: 40,
    animation: '$fadeInUp 0.6s ease-out 0.4s both',
  },
  carouselTitle: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 20,
    textAlign: 'center',
  },
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  glowOrb: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    filter: 'blur(100px)',
    opacity: 0.3,
    pointerEvents: 'none',
    animation: '$orbFloat 8s ease-in-out infinite',
  },
  orbCyan: {
    background: '#00d4ff',
    top: -100,
    left: '20%',
  },
  orbPurple: {
    background: '#7b2dff',
    bottom: -100,
    right: '10%',
    animationDelay: '2s',
  },
  '@keyframes orbFloat': {
    '0%, 100%': { transform: 'translate(0, 0)' },
    '50%': { transform: 'translate(30px, 30px)' },
  },
}));

const Banner = () => {
  const classes = useStyles();
  const { symbol } = CryptoState();
  const [globalData, setGlobalData] = useState(null);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const { data } = await axios.get(GlobalStats());
        setGlobalData(data.data);
      } catch (error) {
        console.log('Error fetching global stats');
      }
    };
    fetchGlobalStats();
  }, []);

  return (
    <div className={classes.banner}>
      {/* Floating 3D Particles Background */}
      <FloatingParticles count={40} />
      
      {/* Gradient Overlay */}
      <div className={classes.gradientOverlay} />
      
      {/* Animated Glow Orbs */}
      <div className={`${classes.glowOrb} ${classes.orbCyan}`} />
      <div className={`${classes.glowOrb} ${classes.orbPurple}`} />

      <Container className={classes.content}>
        {/* Hero Section */}
        <div className={classes.hero}>
          <div className={classes.badge}>
            <span>🛡️</span>
            <span>AI-Powered Trading Intelligence</span>
          </div>
          
          <h1 className={classes.title}>
            CryptoManiac
          </h1>
          
          <p className={classes.subtitle}>
            Real-time AI predictions, whale tracking, and smart trading signals. 
            Your intelligent guardian for the crypto markets.
          </p>
        </div>

        {/* Global Market Stats */}
        {globalData && (
          <div className={classes.statsGrid}>
            <GlassCard className={classes.statCard} interactive>
              <div className={classes.statLabel}>Total Market Cap</div>
              <div className={classes.statValue}>
                {symbol}<AnimatedCounter value={globalData.total_market_cap?.usd || 0} />
              </div>
              <div className={`${classes.statChange} ${globalData.market_cap_change_percentage_24h_usd >= 0 ? classes.positive : classes.negative}`}>
                {globalData.market_cap_change_percentage_24h_usd >= 0 ? '↑' : '↓'} {Math.abs(globalData.market_cap_change_percentage_24h_usd || 0).toFixed(2)}% (24h)
              </div>
            </GlassCard>

            <GlassCard className={classes.statCard} interactive>
              <div className={classes.statLabel}>24h Volume</div>
              <div className={classes.statValue}>
                {symbol}<AnimatedCounter value={globalData.total_volume?.usd || 0} />
              </div>
              <div className={classes.statChange} style={{ color: 'rgba(255,255,255,0.5)' }}>
                Across all exchanges
              </div>
            </GlassCard>

            <GlassCard className={classes.statCard} interactive>
              <div className={classes.statLabel}>BTC Dominance</div>
              <div className={classes.statValue}>
                <AnimatedCounter value={globalData.market_cap_percentage?.btc || 0} decimals={1} suffix="%" />
              </div>
              <div className={classes.statChange} style={{ color: '#ff9500' }}>
                ₿ Bitcoin
              </div>
            </GlassCard>

            <GlassCard className={classes.statCard} interactive>
              <div className={classes.statLabel}>Active Cryptocurrencies</div>
              <div className={classes.statValue}>
                <AnimatedCounter value={globalData.active_cryptocurrencies || 0} />
              </div>
              <div className={classes.statChange} style={{ color: '#00d4ff' }}>
                Tracked coins
              </div>
            </GlassCard>
          </div>
        )}

        {/* Trending Coins Carousel */}
        <div className={classes.carouselSection}>
          <div className={classes.carouselTitle}>
            🔥 Trending Now
          </div>
          <Corousels />
        </div>
      </Container>
    </div>
  );
};

export default Banner;
