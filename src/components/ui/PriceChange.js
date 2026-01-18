/**
 * PriceChange - Animated price change indicator with pulse effect
 */
import React from 'react';
import { makeStyles } from '@material-ui/core';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';

const useStyles = makeStyles(() => ({
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 20,
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.3s ease',
  },
  positive: {
    background: 'rgba(0, 255, 136, 0.12)',
    color: '#00ff88',
    '&:hover': {
      background: 'rgba(0, 255, 136, 0.2)',
      boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
    },
  },
  negative: {
    background: 'rgba(255, 51, 102, 0.12)',
    color: '#ff3366',
    '&:hover': {
      background: 'rgba(255, 51, 102, 0.2)',
      boxShadow: '0 0 20px rgba(255, 51, 102, 0.3)',
    },
  },
  neutral: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  icon: {
    fontSize: 18,
  },
  pulse: {
    animation: '$pulse 0.5s ease-out',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
  },
  large: {
    padding: '10px 20px',
    fontSize: 18,
    borderRadius: 24,
  },
  small: {
    padding: '4px 10px',
    fontSize: 12,
    gap: 4,
  },
}));

const PriceChange = ({ 
  value, 
  showIcon = true, 
  showPercent = true,
  size = 'medium', // 'small', 'medium', 'large'
  className = '',
}) => {
  const classes = useStyles();
  
  const numValue = parseFloat(value) || 0;
  const isPositive = numValue > 0;
  const isNegative = numValue < 0;
  
  const getStatusClass = () => {
    if (isPositive) return classes.positive;
    if (isNegative) return classes.negative;
    return classes.neutral;
  };

  const getSizeClass = () => {
    if (size === 'large') return classes.large;
    if (size === 'small') return classes.small;
    return '';
  };

  const getIcon = () => {
    if (isPositive) return <TrendingUpIcon className={classes.icon} />;
    if (isNegative) return <TrendingDownIcon className={classes.icon} />;
    return <TrendingFlatIcon className={classes.icon} />;
  };

  return (
    <div 
      className={`
        ${classes.container} 
        ${getStatusClass()} 
        ${getSizeClass()}
        ${className}
      `}
    >
      {showIcon && getIcon()}
      <span>
        {isPositive && '+'}
        {numValue.toFixed(2)}
        {showPercent && '%'}
      </span>
    </div>
  );
};

export default PriceChange;
