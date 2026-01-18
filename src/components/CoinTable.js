/**
 * Premium CoinTable with infinite scroll and 3D effects
 */
import {
  Container,
  InputAdornment,
  makeStyles,
  TextField,
  createTheme,
  ThemeProvider,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { CoinList } from '../config/api';
import { mockCoins } from '../config/mockData';
import { CryptoState } from '../CryptoContext';
import GlassCard from './ui/GlassCard';
import PriceChange from './ui/PriceChange';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '60px 0',
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: 800,
    marginBottom: 16,
    background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: "'Inter', 'Montserrat', sans-serif",
    [theme.breakpoints.down('sm')]: {
      fontSize: 28,
    },
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    maxWidth: 500,
    margin: '0 auto',
  },
  searchContainer: {
    maxWidth: 500,
    margin: '30px auto',
  },
  searchField: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 16,
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.1)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 212, 255, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#00d4ff',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255,255,255,0.4)',
    },
    '& .MuiInputBase-input': {
      color: '#fff',
      padding: '16px 20px',
    },
  },
  coinGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: 12,
  },
  coinRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    alignItems: 'center',
    padding: '16px 24px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateX(8px) scale(1.01)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
    },
  },
  coinInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  coinImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1) rotate(5deg)',
    },
  },
  coinName: {
    display: 'flex',
    flexDirection: 'column',
  },
  symbol: {
    fontSize: 18,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#fff',
  },
  name: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  price: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left',
    },
  },
  marketCap: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    marginRight: 12,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    padding: 40,
  },
  loadingDot: {
    width: 10,
    height: 10,
    margin: '0 5px',
    borderRadius: '50%',
    background: '#00d4ff',
    animation: '$bounce 1.4s ease-in-out infinite both',
    '&:nth-child(1)': { animationDelay: '-0.32s' },
    '&:nth-child(2)': { animationDelay: '-0.16s' },
  },
  '@keyframes bounce': {
    '0%, 80%, 100%': { transform: 'scale(0)' },
    '40%': { transform: 'scale(1)' },
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '12px 24px',
    marginBottom: 8,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  headerCell: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.4)',
    '&:not(:first-child)': {
      textAlign: 'right',
    },
  },
  loadMoreTrigger: {
    height: 1,
    width: '100%',
  },
  noResults: {
    textAlign: 'center',
    padding: 60,
    color: 'rgba(255,255,255,0.4)',
  },
}));

const CoinTable = () => {
  const classes = useStyles();
  const { currency, symbol } = CryptoState();
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const history = useHistory();
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Fetch coins with pagination
  const fetchCoins = useCallback(async (pageNum, reset = false) => {
    try {
      setLoading(true);
      const { data } = await axios.get(CoinList(currency, pageNum, 50));
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setCoins(prev => reset ? data : [...prev, ...data]);
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
      // Use fallback data and stop infinite scroll on first page
      if (pageNum === 1) {
        setCoins(mockCoins);
      }
      setHasMore(false); // Stop trying to load more
    } finally {
      setLoading(false);
    }
  }, [currency]);

  // Initial fetch
  useEffect(() => {
    setPage(1);
    setCoins([]);
    setHasMore(true);
    fetchCoins(1, true);
  }, [currency, fetchCoins]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchCoins(page);
    }
  }, [page, fetchCoins]);

  // Filter coins by search
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num?.toFixed(2) || '0';
  };

  const darkTheme = createTheme({
    palette: {
      primary: { main: '#00d4ff' },
      type: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container className={classes.container}>
        {/* Header */}
        <div className={classes.header}>
          <h2 className={classes.title}>
            Explore Cryptocurrencies
          </h2>
          <p className={classes.subtitle}>
            Track {coins.length}+ coins in real-time with AI-powered insights
          </p>
        </div>

        {/* Search */}
        <div className={classes.searchContainer}>
          <TextField
            className={classes.searchField}
            placeholder="Search coins by name or symbol..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: 'rgba(255,255,255,0.3)' }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Table Header */}
        <div className={classes.tableHeader}>
          <div className={classes.headerCell}>Coin</div>
          <div className={classes.headerCell}>Price</div>
          <div className={classes.headerCell}>24h Change</div>
          <div className={classes.headerCell}>Market Cap</div>
        </div>

        {/* Coin List */}
        <div className={classes.coinGrid}>
          {filteredCoins.map((coin, index) => (
            <GlassCard
              key={coin.id}
              className={classes.coinRow}
              interactive
              onClick={() => history.push(`/coins/${coin.id}`)}
              style={{
                animationDelay: `${index * 0.02}s`,
              }}
            >
              <div className={classes.coinInfo}>
                <span className={classes.rank}>{coin.market_cap_rank}</span>
                <img
                  className={classes.coinImage}
                  src={coin.image}
                  alt={coin.name}
                />
                <div className={classes.coinName}>
                  <span className={classes.symbol}>{coin.symbol}</span>
                  <span className={classes.name}>{coin.name}</span>
                </div>
              </div>
              
              <div className={classes.price}>
                {symbol}{formatNumber(coin.current_price)}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <PriceChange value={coin.price_change_percentage_24h} size="small" />
              </div>
              
              <div className={classes.marketCap}>
                {symbol}{formatNumber(coin.market_cap)}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className={classes.loader}>
            <div className={classes.loadingDot} />
            <div className={classes.loadingDot} />
            <div className={classes.loadingDot} />
          </div>
        )}

        {/* No results */}
        {!loading && filteredCoins.length === 0 && (
          <div className={classes.noResults}>
            No coins found matching "{search}"
          </div>
        )}

        {/* Infinite scroll trigger */}
        {!search && hasMore && (
          <div ref={loadMoreRef} className={classes.loadMoreTrigger} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default CoinTable;