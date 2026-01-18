/**
 * Premium WhaleAlert Component
 * Apple-style blockchain activity monitor with glassmorphism
 */
import React, { useState, useEffect } from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';
import GlassCard from './ui/GlassCard';

const ML_API_BASE = process.env.REACT_APP_ML_API_URL || 'http://localhost:8000';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    '& span': {
      fontSize: 24,
      filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))',
    }
  },
  badge: {
    padding: '6px 16px',
    borderRadius: 30,
    fontWeight: 700,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  high: {
    background: 'rgba(255, 51, 102, 0.15)',
    color: '#ff3366',
    border: '1px solid rgba(255, 51, 102, 0.3)',
  },
  medium: {
    background: 'rgba(255, 170, 0, 0.15)',
    color: '#ffaa00',
    border: '1px solid rgba(255, 170, 0, 0.3)',
  },
  low: {
    background: 'rgba(0, 255, 136, 0.15)',
    color: '#00ff88',
    border: '1px solid rgba(0, 255, 136, 0.3)',
  },
  message: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
    lineHeight: 1.6,
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  stat: {
    textAlign: 'center',
    padding: '16px 8px',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: '#fff',
  },
  txList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  txItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    fontSize: 14,
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'rgba(0, 212, 255, 0.2)',
      transform: 'translateX(4px)',
    }
  },
  txTag: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: 600,
    fontSize: 12,
  },
  txAmount: {
    color: '#00ff88',
    fontWeight: 700,
  },
  txValue: {
    color: '#fff',
    fontWeight: 600,
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    gap: 20,
    color: 'rgba(255,255,255,0.4)',
  }
}));

const WhaleAlert = ({ symbol }) => {
  const classes = useStyles();
  const [whaleData, setWhaleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhales = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${ML_API_BASE}/api/v1/whales/${symbol}`);
        if (response.ok) {
          const data = await response.json();
          setWhaleData(data);
        }
      } catch (err) {
        console.error('Whale fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWhales();
    const interval = setInterval(fetchWhales, 60000); // 1 minute refresh for efficiency
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return (
      <GlassCard radius={24}>
        <div className={classes.loader}>
          <CircularProgress style={{ color: '#7b2dff' }} size={40} thickness={4} />
          <span>Scanning Deep Waters...</span>
        </div>
      </GlassCard>
    );
  }

  if (!whaleData) {
    return (
      <GlassCard radius={24}>
        <div className={classes.loader}>
          <span>🌊 Quiet waters... no whale activity detected.</span>
        </div>
      </GlassCard>
    );
  }

  const getAlertStyle = () => {
    if (whaleData.alert_level === 'HIGH') return classes.high;
    if (whaleData.alert_level === 'MEDIUM') return classes.medium;
    return classes.low;
  };

  const formatUSD = (value) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <GlassCard radius={24} glowBorder>
      <div className={classes.header}>
        <div className={classes.title}>
          <span>🐋</span> Whale Watch
        </div>
        <div className={`${classes.badge} ${getAlertStyle()}`}>
          {whaleData.alert_level}
        </div>
      </div>

      <div className={classes.message}>
        {whaleData.message}
      </div>

      <div className={classes.statsContainer}>
        <GlassCard className={classes.stat} radius={16} padding={0}>
          <div className={classes.statLabel}>Large Transactions</div>
          <div className={classes.statValue}>{whaleData.whale_count}</div>
        </GlassCard>
        
        <GlassCard className={classes.stat} radius={16} padding={0}>
          <div className={classes.statLabel}>Total Volume</div>
          <div className={classes.statValue}>
            {formatUSD(whaleData.total_volume_usd || 0)}
          </div>
        </GlassCard>
      </div>

      {whaleData.transactions && whaleData.transactions.length > 0 && (
        <div className={classes.txList}>
          {whaleData.transactions.slice(0, 3).map((tx, i) => (
            <div key={i} className={classes.txItem}>
              <span className={classes.txTag}>TX #{i + 1}</span>
              <span className={classes.txAmount}>
                {tx.amount.toFixed(2)} {tx.symbol}
              </span>
              <span className={classes.txValue}>
                {formatUSD(tx.usd_value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default WhaleAlert;
