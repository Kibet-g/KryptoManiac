/**
 * Premium LivePriceTicker - Real-time market pulse with glassmorphism
 */
import React from 'react';
import { makeStyles } from '@material-ui/core';
import useRealTimePrice from '../hooks/useRealTimePrice';
import GlassCard from './ui/GlassCard';
import PriceChange from './ui/PriceChange';

const useStyles = makeStyles((theme) => ({
  ticker: {
    padding: '24px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: 20,
      textAlign: 'center',
    },
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  right: {
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  pair: {
    fontSize: 14,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: '#00ff88',
    background: 'rgba(0, 255, 136, 0.1)',
    padding: '4px 12px',
    borderRadius: 20,
    border: '1px solid rgba(0, 255, 136, 0.2)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#00ff88',
    boxShadow: '0 0 10px #00ff88',
    animation: '$pulse 1.5s infinite',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.5)', opacity: 0.5 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
  price: {
    fontSize: 42,
    fontWeight: 800,
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '-1px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 32,
    },
  },
  signalBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 20px',
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 700,
    marginTop: 12,
  },
  BUY: {
    background: 'rgba(0, 255, 136, 0.15)',
    color: '#00ff88',
    border: '1px solid rgba(0, 255, 136, 0.3)',
  },
  SELL: {
    background: 'rgba(255, 51, 102, 0.15)',
    color: '#ff3366',
    border: '1px solid rgba(255, 51, 102, 0.3)',
  },
  HOLD: {
    background: 'rgba(255, 170, 0, 0.15)',
    color: '#ffaa00',
    border: '1px solid rgba(255, 170, 0, 0.3)',
  },
  offline: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
  }
}));

const LivePriceTicker = ({ symbol }) => {
  const classes = useStyles();
  const { price, signal, connected } = useRealTimePrice(symbol);

  if (!connected || !price) {
    return (
      <GlassCard className={classes.ticker} radius={24}>
        <div className={classes.left}>
          <div className={classes.pair}>
            {symbol?.toUpperCase()} / USDT
            <span className={classes.offline}>(Connecting...)</span>
          </div>
          <div className={classes.price}>——</div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className={classes.ticker} radius={24} glowBorder>
      <div className={classes.left}>
        <div className={classes.pair}>
          {symbol?.toUpperCase()} / USDT
          <div className={classes.liveIndicator}>
            <div className={classes.dot} />
            LIVE
          </div>
        </div>
        <div className={classes.price}>
          ${price.price?.toLocaleString(undefined, { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
        </div>
      </div>
      
      <div className={classes.right}>
        <PriceChange value={price.price_change_24h} size="large" />
        
        {signal && (
          <div>
            <div className={`${classes.signalBox} ${classes[signal.type]}`}>
              {signal.emoji} {signal.type} SIGNAL
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default LivePriceTicker;
