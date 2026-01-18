/**
 * CurrencySelector Component
 * Searchable dropdown with all world currencies
 * Shows popup on first visit to select currency based on location
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment,
  Typography,
  Popover,
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import PublicIcon from '@material-ui/icons/Public';
import { CURRENCIES, getCurrencyByCode, searchCurrencies, COUNTRY_TO_CURRENCY } from '../config/currencies';
import { CryptoState } from '../CryptoContext';

const useStyles = makeStyles((theme) => ({
  selectorButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    cursor: 'pointer',
    minWidth: 120,
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
    },
  },
  flag: {
    fontSize: 20,
  },
  currencyCode: {
    fontWeight: 'bold',
  },
  popover: {
    '& .MuiPopover-paper': {
      background: '#1a1a2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      width: 320,
      maxHeight: 400,
    },
  },
  searchField: {
    margin: 12,
    width: 'calc(100% - 24px)',
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
    },
  },
  listItem: {
    '&:hover': {
      background: 'rgba(4, 181, 229, 0.2)',
    },
  },
  selectedItem: {
    background: 'rgba(4, 181, 229, 0.3) !important',
  },
  dialog: {
    '& .MuiDialog-paper': {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: 20,
      padding: 16,
      minWidth: 400,
    },
  },
  dialogTitle: {
    color: '#fff',
    textAlign: 'center',
    '& h2': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
  },
  dialogContent: {
    color: '#a0a0a0',
    textAlign: 'center',
  },
  detectedCurrency: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    margin: '16px 0',
    background: 'rgba(4, 181, 229, 0.2)',
    borderRadius: 12,
    fontSize: 18,
  },
  orText: {
    margin: '16px 0',
    color: '#888',
  },
  currencyList: {
    maxHeight: 200,
    overflow: 'auto',
    margin: '0 -16px',
  },
  actionButton: {
    borderRadius: 12,
    padding: '10px 24px',
    fontWeight: 'bold',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #04b5e5 0%, #0088cc 100%)',
    color: '#fff',
  },
}));

const CurrencySelector = () => {
  const classes = useStyles();
  const { currency, setCurrency } = CryptoState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [detectedCurrency, setDetectedCurrency] = useState(null);
  const [detectedCountry, setDetectedCountry] = useState(null);

  // Check if first visit
  useEffect(() => {
    const hasSelectedCurrency = localStorage.getItem('cryptoManiac_currencySelected');
    if (!hasSelectedCurrency) {
      detectLocation();
      setShowWelcomeDialog(true);
    }
  }, []);

  // Detect user location and suggest currency
  const detectLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const countryCode = data.country_code;
      const suggestedCurrency = COUNTRY_TO_CURRENCY[countryCode] || 'USD';
      setDetectedCurrency(suggestedCurrency);
      setDetectedCountry(data.country_name);
    } catch (error) {
      console.log('Location detection failed, defaulting to USD');
      setDetectedCurrency('USD');
      setDetectedCountry('Unknown');
    }
  };

  // Filter currencies based on search
  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) return CURRENCIES;
    return searchCurrencies(searchQuery);
  }, [searchQuery]);

  const currentCurrency = getCurrencyByCode(currency);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery('');
  };

  const handleSelect = (code) => {
    setCurrency(code);
    handleClose();
    localStorage.setItem('cryptoManiac_currencySelected', 'true');
    localStorage.setItem('cryptoManiac_currency', code);
  };

  const handleWelcomeSelect = (code) => {
    setCurrency(code);
    setShowWelcomeDialog(false);
    localStorage.setItem('cryptoManiac_currencySelected', 'true');
    localStorage.setItem('cryptoManiac_currency', code);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {/* Currency Button */}
      <div className={classes.selectorButton} onClick={handleOpen}>
        <span className={classes.flag}>{currentCurrency?.flag}</span>
        <span className={classes.currencyCode}>{currency}</span>
        <span style={{ opacity: 0.7 }}>{currentCurrency?.symbol}</span>
      </div>

      {/* Dropdown Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={classes.popover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <TextField
          className={classes.searchField}
          placeholder="Search currency..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#888' }} />
              </InputAdornment>
            ),
          }}
        />
        <List style={{ padding: 0 }}>
          {filteredCurrencies.slice(0, 15).map((curr) => (
            <ListItem
              key={curr.code}
              button
              onClick={() => handleSelect(curr.code)}
              className={`${classes.listItem} ${currency === curr.code ? classes.selectedItem : ''}`}
            >
              <ListItemIcon style={{ minWidth: 40 }}>
                <span style={{ fontSize: 24 }}>{curr.flag}</span>
              </ListItemIcon>
              <ListItemText
                primary={
                  <span>
                    <strong>{curr.code}</strong>
                    <span style={{ opacity: 0.7, marginLeft: 8 }}>{curr.symbol}</span>
                  </span>
                }
                secondary={curr.name}
              />
            </ListItem>
          ))}
          {filteredCurrencies.length === 0 && (
            <ListItem>
              <ListItemText secondary="No currencies found" />
            </ListItem>
          )}
        </List>
      </Popover>

      {/* Welcome Dialog */}
      <Dialog
        open={showWelcomeDialog}
        onClose={() => {}}
        className={classes.dialog}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle className={classes.dialogTitle}>
          <PublicIcon style={{ fontSize: 32, color: '#04b5e5' }} />
          <span>Choose Your Currency</span>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Typography>
            Welcome to CryptoManiac! Please select your preferred currency for displaying prices.
          </Typography>

          {detectedCurrency && (
            <>
              <Typography style={{ marginTop: 16 }}>
                Based on your location ({detectedCountry}), we suggest:
              </Typography>
              <div className={classes.detectedCurrency}>
                <span style={{ fontSize: 32 }}>{getCurrencyByCode(detectedCurrency)?.flag}</span>
                <span>
                  <strong>{detectedCurrency}</strong> - {getCurrencyByCode(detectedCurrency)?.name}
                </span>
              </div>
              <Button
                variant="contained"
                className={`${classes.actionButton} ${classes.primaryButton}`}
                onClick={() => handleWelcomeSelect(detectedCurrency)}
                fullWidth
              >
                Use {getCurrencyByCode(detectedCurrency)?.name}
              </Button>
            </>
          )}

          <Typography className={classes.orText}>— or choose another currency —</Typography>

          <TextField
            placeholder="Search currencies..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 12 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#888' }} />
                </InputAdornment>
              ),
            }}
          />

          <List className={classes.currencyList}>
            {filteredCurrencies.slice(0, 10).map((curr) => (
              <ListItem
                key={curr.code}
                button
                onClick={() => handleWelcomeSelect(curr.code)}
              >
                <ListItemIcon style={{ minWidth: 40 }}>
                  <span style={{ fontSize: 20 }}>{curr.flag}</span>
                </ListItemIcon>
                <ListItemText
                  primary={<strong>{curr.code}</strong>}
                  secondary={`${curr.name} (${curr.symbol})`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', paddingBottom: 16 }}>
          <Button
            onClick={() => handleWelcomeSelect('USD')}
            style={{ color: '#888' }}
          >
            Keep USD (Default)
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CurrencySelector;
