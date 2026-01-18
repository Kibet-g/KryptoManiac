/**
 * TradeValidator Component
 * Warns users before they make bad trades!
 */
import React, { useState } from 'react';
import { makeStyles, Dialog, DialogContent } from '@material-ui/core';
import { validateTrade } from '../services/MLService';

const useStyles = makeStyles(() => ({
  modal: {
    '& .MuiDialog-paper': {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: 20,
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#fff',
      minWidth: 400,
    },
  },
  content: {
    padding: 24,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warning: {
    background: 'rgba(255,23,68,0.2)',
    border: '1px solid #ff1744',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  warningText: {
    color: '#ff8a80',
    fontSize: 14,
    lineHeight: 1.5,
  },
  success: {
    background: 'rgba(0,200,83,0.2)',
    border: '1px solid #00c853',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  successText: {
    color: '#69f0ae',
    fontSize: 14,
    lineHeight: 1.5,
  },
  recommendation: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  recLabel: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  recText: {
    fontSize: 14,
    color: '#fff',
  },
  buttons: {
    display: 'flex',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    border: 'none',
    fontSize: 14,
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  cancelBtn: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
  },
  proceedBtn: {
    background: 'linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%)',
    color: '#000',
  },
  dangerBtn: {
    background: 'linear-gradient(135deg, #ff1744 0%, #ff5252 100%)',
    color: '#fff',
  },
  loading: {
    textAlign: 'center',
    padding: 40,
    color: '#888',
  },
}));

const TradeValidator = ({ 
  open, 
  onClose, 
  symbol, 
  action, 
  amount,
  onProceed 
}) => {
  const classes = useStyles();
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (open && symbol && action) {
      setLoading(true);
      validateTrade(symbol, action, amount).then(result => {
        setValidation(result);
        setLoading(false);
      });
    }
  }, [open, symbol, action, amount]);

  const handleProceed = () => {
    onProceed?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes.modal}>
      <DialogContent className={classes.content}>
        {loading ? (
          <div className={classes.loading}>
            🔍 Validating your trade...
          </div>
        ) : validation ? (
          <>
            <div className={classes.header}>
              <div className={classes.icon}>
                {validation.is_good_trade ? '✅' : '⚠️'}
              </div>
              <div className={classes.title}>
                Trade Validation: {symbol} {action}
              </div>
            </div>

            {validation.warning ? (
              <div className={classes.warning}>
                <div className={classes.warningText}>
                  {validation.warning}
                </div>
              </div>
            ) : (
              <div className={classes.success}>
                <div className={classes.successText}>
                  ✓ Trade looks good based on current market signals
                </div>
              </div>
            )}

            <div className={classes.recommendation}>
              <div className={classes.recLabel}>AI Recommendation</div>
              <div className={classes.recText}>
                {validation.recommendation}
              </div>
            </div>

            <div className={classes.buttons}>
              <button 
                className={`${classes.button} ${classes.cancelBtn}`}
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className={`${classes.button} ${
                  validation.is_good_trade ? classes.proceedBtn : classes.dangerBtn
                }`}
                onClick={handleProceed}
              >
                {validation.is_good_trade ? 'Proceed' : 'Proceed Anyway'}
              </button>
            </div>
          </>
        ) : (
          <div className={classes.loading}>
            ⚠️ Could not validate trade. ML Backend may be offline.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TradeValidator;
