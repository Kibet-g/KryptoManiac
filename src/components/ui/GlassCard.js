/**
 * GlassCard - Premium glassmorphism card component
 */
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  card: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: props => props.radius || 24,
    padding: props => props.padding || 24,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    },
  },
  interactive: {
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 60px rgba(0, 212, 255, 0.1)',
    },
  },
  glowBorder: {
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '-2px',
      borderRadius: 'inherit',
      padding: '2px',
      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(123, 45, 255, 0.3))',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      opacity: 0,
      transition: 'opacity 0.3s',
    },
    '&:hover::after': {
      opacity: 1,
    },
  },
}));

const GlassCard = ({ 
  children, 
  className = '', 
  interactive = false,
  glowBorder = false,
  padding,
  radius,
  style,
  onClick,
  ...props 
}) => {
  const classes = useStyles({ padding, radius });
  
  return (
    <div 
      className={`
        ${classes.card} 
        ${interactive ? classes.interactive : ''} 
        ${glowBorder ? classes.glowBorder : ''}
        ${className}
      `}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
