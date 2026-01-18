/**
 * Premium PredictionCard Component
 * Apple-style display of AI trading signals with glassmorphism
 */
import React, { useState, useEffect } from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';
import { getPrediction, getMarketAlerts } from '../services/MLService';
import GlassCard from './ui/GlassCard';

import { CryptoState } from '../CryptoContext';

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
  signalBox: {
    padding: '8px 20px',
    borderRadius: 30,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  buySignal: {
    background: 'rgba(0, 255, 136, 0.15)',
    color: '#00ff88',
    border: '1px solid rgba(0, 255, 136, 0.3)',
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
  },
  sellSignal: {
    background: 'rgba(255, 51, 102, 0.15)',
    color: '#ff3366',
    border: '1px solid rgba(255, 51, 102, 0.3)',
    boxShadow: '0 0 20px rgba(255, 51, 102, 0.1)',
  },
  holdSignal: {
    background: 'rgba(255, 170, 0, 0.15)',
    color: '#ffaa00',
    border: '1px solid rgba(255, 170, 0, 0.3)',
    boxShadow: '0 0 20px rgba(255, 170, 0, 0.1)',
  },
  explanation: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
    lineHeight: 1.6,
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
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
    fontSize: 18,
    fontWeight: 800,
    color: '#fff',
  },
  stars: {
    color: '#ffaa00',
    fontSize: 14,
    letterSpacing: 2,
    textShadow: '0 0 10px rgba(255, 170, 0, 0.3)',
  },
  riskBadge: {
    padding: '4px 10px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
  },
  alert: {
    background: 'rgba(255, 51, 102, 0.1)',
    border: '1px solid rgba(255, 51, 102, 0.2)',
    borderRadius: 16,
    padding: '12px 20px',
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: '#ff8a80',
    fontSize: 14,
  },
  tradeButton: {
    width: '100%',
    padding: '16px',
    marginTop: 20,
    borderRadius: 16,
    border: 'none',
    background: 'linear-gradient(135deg, #f0b90b 0%, #f9d423 100%)',
    color: '#000',
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    boxShadow: '0 10px 20px rgba(240, 185, 11, 0.2)',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0 15px 30px rgba(240, 185, 11, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0) scale(0.98)',
    }
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

const PredictionCard = ({ coinId, symbol }) => {
  const classes = useStyles();
  const [prediction, setPrediction] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [predData, alertData] = await Promise.all([
          getPrediction(symbol || coinId),
          getMarketAlerts(symbol || coinId)
        ]);
        setPrediction(predData);
        setAlerts(alertData?.alerts || []);
      } catch (error) {
        console.error("AI fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (coinId || symbol) {
      fetchData();
    }
  }, [coinId, symbol]);

  if (loading) {
    return (
      <GlassCard radius={24}>
        <div className={classes.loader}>
          <CircularProgress style={{ color: '#00d4ff' }} size={40} thickness={4} />
          <span>Consulting AI Guardian...</span>
        </div>
      </GlassCard>
    );
  }

  if (!prediction) {
    return (
      <GlassCard radius={24}>
        <div className={classes.loader}>
          <span>⚠️ AI Engine is calibrating...</span>
        </div>
      </GlassCard>
    );
  }

  const getSignalStyle = () => {
    if (prediction.signal === 'BUY') return classes.buySignal;
    if (prediction.signal === 'SELL') return classes.sellSignal;
    return classes.holdSignal;
  };

  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <GlassCard radius={24} glowBorder>
      <div className={classes.header}>
        <div className={classes.title}>
          <span>🛡️</span> AI Guardian
        </div>
        <div className={`${classes.signalBox} ${getSignalStyle()}`}>
          {prediction.signal}
        </div>
      </div>

      <div className={classes.explanation}>
        {prediction.explanation}
      </div>

      <div className={classes.statsGrid}>
        <GlassCard className={classes.stat} radius={16} padding={0}>
          <div className={classes.statLabel}>Target</div>
          <div className={classes.statValue}>
            {prediction.predicted_price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
        </GlassCard>
        
        <GlassCard className={classes.stat} radius={16} padding={0}>
          <div className={classes.statLabel}>Confidence</div>
          <div className={classes.stars}>
            {renderStars(prediction.confidence_stars || 3)}
          </div>
        </GlassCard>
        
        <GlassCard className={classes.stat} radius={16} padding={0}>
          <div className={classes.statLabel}>Risk</div>
          <div className={classes.statValue}>
            <span style={{ 
              color: prediction.risk_level === 'LOW' ? '#00ff88' : 
                     prediction.risk_level === 'HIGH' ? '#ff3366' : '#ffaa00'
            }}>
              {prediction.risk_level}
            </span>
          </div>
        </GlassCard>
      </div>

      {alerts.filter(a => a.should_pause).map((alert, i) => (
        <div key={i} className={classes.alert}>
          <span>⚠️</span>
          <span>{alert.message}</span>
        </div>
      ))}

      <button 
        className={classes.tradeButton}
        onClick={() => window.open(`https://www.binance.com/trade/${prediction.symbol || symbol || coinId}_USDT`, '_blank')}
      >
        Trade {prediction.symbol || symbol || coinId} on Binance
      </button>

    </GlassCard>
  );
};

export default PredictionCard;

