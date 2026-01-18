/**
 * Premium Coin Detail Page
 * Apple-style layout with glassmorphism and animated stats
 */
import { Button, LinearProgress, makeStyles, Container } from '@material-ui/core';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { coinWithComa } from '../components/Banner/Corousels';
import CoinInfo from '../components/CoinInfo';
import { SingleCoin } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { db } from '../firebase';
import GlassCard from '../components/ui/GlassCard';
import PriceChange from '../components/ui/PriceChange';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import MarketGlobe from '../components/3d/MarketGlobe';


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    padding: "40px 0",
    gap: 40,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
    },
  },
  sidebar: {
    width: "35%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
  },
  coinHeader: {
    textAlign: 'center',
    marginBottom: 30,
  },
  coinImage: {
    height: 180,
    marginBottom: 20,
    filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.3))',
    animation: '$floating 4s ease-in-out infinite',
  },
  '@keyframes floating': {
    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
    '50%': { transform: 'translateY(-15px) rotate(5deg)' },
  },
  title: {
    fontSize: 48,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: "'Inter', sans-serif",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'justify',
    marginBottom: 30,
  },
  marketData: {
    display: 'grid',
    gap: 16,
  },
  dataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.4)',
  },
  value: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
  },
  watchlistBtn: {
    marginTop: 30,
    padding: '14px',
    borderRadius: 16,
    fontWeight: 700,
    textTransform: 'none',
    fontSize: 16,
    transition: 'all 0.3s ease',
  },
  mainContent: {
    flex: 1,
    width: '100%',
  },
}));

const Bitcoin = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol, user, watchlist, setAlert } = CryptoState();
  const classes = useStyles();

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (error) {
      console.error("Error fetching coin data", error);
    }
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const inWatchlist = watchlist.includes(coin?.id);

  const toggleWatchlist = async () => {
    if (!user) {
      setAlert({
        open: true,
        message: "Please login to add coins to watchlist",
        type: "error"
      });
      return;
    }

    const coinref = doc(db, "watchlist", user.uid);
    try {
      const newWatchlist = inWatchlist 
        ? watchlist.filter((watch) => watch !== coin?.id)
        : [...(watchlist || []), coin?.id];

      await setDoc(coinref, { coins: newWatchlist });
      
      setAlert({
        open: true,
        message: `${coin.name} ${inWatchlist ? 'Removed from' : 'Added to'} Watchlist!`,
        type: "success"
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      });
    }
  };

  if (!coin) return <LinearProgress style={{ backgroundColor: "#00d4ff" }} />;

  return (
    <Container className={classes.container}>
      {/* Sidebar - Coin Info */}
      <div className={classes.sidebar}>
        <div className={classes.coinHeader}>
          <img
            src={coin?.image.large}
            alt={coin?.name}
            className={classes.coinImage}
          />
          <h1 className={classes.title}>{coin?.name}</h1>
          <PriceChange value={coin?.market_data.price_change_percentage_24h} size="large" />
        </div>

        <p className={classes.description}>
          {coin?.description.en.split(". ")[0]}. 
          {coin?.description.en.split(". ")[1] && coin?.description.en.split(". ")[1] + "."}
        </p>

        <div className={classes.marketData}>
          <GlassCard className={classes.dataRow} radius={16} padding={16}>
            <span className={classes.label}>Market Rank</span>
            <span className={classes.value}>#{coin?.market_cap_rank}</span>
          </GlassCard>

          <GlassCard className={classes.dataRow} radius={16} padding={16}>
            <span className={classes.label}>Current Price</span>
            <span className={classes.value}>
              {symbol}{coinWithComa(coin?.market_data.current_price[currency.toLowerCase()].toFixed(2))}
            </span>
          </GlassCard>

          <GlassCard className={classes.dataRow} radius={16} padding={16}>
            <span className={classes.label}>Market Cap</span>
            <span className={classes.value}>
              {symbol}<AnimatedCounter value={coin?.market_data.market_cap[currency.toLowerCase()]} />
            </span>
          </GlassCard>
        </div>

        <Button
          variant="contained"
          className={classes.watchlistBtn}
          style={{
            background: inWatchlist ? 'rgba(255, 51, 102, 0.2)' : 'linear-gradient(135deg, #00d4ff 0%, #7b2dff 100%)',
            color: inWatchlist ? '#ff3366' : '#fff',
            border: inWatchlist ? '1px solid #ff3366' : 'none',
          }}
          onClick={toggleWatchlist}
        >
          {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </Button>
      </div>

      {/* Main Content - Chart & Insights */}
      <div className={classes.mainContent}>
        <CoinInfo coin={coin} />
        
        {/* Market Globe for Sentiment Context */}
        <div style={{ marginTop: 60 }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 800, 
            marginBottom: 30,
            background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 15
          }}>
            <span style={{ fontSize: 32 }}>🌐</span> Global Market Context
          </h2>
          <MarketGlobe />
        </div>
      </div>
    </Container>
  );
};

export default Bitcoin;

