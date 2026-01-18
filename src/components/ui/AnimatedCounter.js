/**
 * AnimatedCounter - Smooth number animation for statistics
 */
import React, { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ 
  value, 
  duration = 1000, 
  prefix = '', 
  suffix = '',
  decimals = 0,
  className = '',
  style = {},
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  const formatNumber = (num) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(decimals);
  };

  return (
    <span className={className} style={style}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  );
};

export default AnimatedCounter;
