/**
 * Premium Trending Carousel
 * Showcases trending coins with smooth animations and glass cards
 */
import { makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { TrendingCoins } from '../../config/api';
import { CryptoState } from '../../CryptoContext';
import axios from 'axios';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import PriceChange from '../ui/PriceChange';
import { mockCoins } from '../../config/mockData';

const useStyles = makeStyles((theme) => ({
  carousel: {
    height: "auto",
    display: "flex",
    alignItems: "center",
    padding: "20px 0",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
    textDecoration: "none",
    margin: "0 10px",
  },
  card: {
    width: "100%",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  coinImage: {
    height: 80,
    marginBottom: 16,
    transition: 'transform 0.3s ease',
    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))',
  },
  symbol: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
    color: '#fff',
  },
  price: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: 8,
    color: '#00d4ff',
  },
}))

export function coinWithComa(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const Corousels = () => {
  const classes = useStyles();
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);
    } catch (error) {
      console.error("Error fetching trending coins, using fallback", error);
      setTrending(mockCoins.slice(0, 10)); // Use mock data as fallback
    }
  }

  useEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency])

  const responsive = {
    0: { items: 2 },
    600: { items: 3 },
    1024: { items: 4 },
    1440: { items: 5 }
  };

  const items = trending.map((coin) => {
    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`} key={coin.id}>
        <GlassCard className={classes.card} interactive glowBorder>
          <img 
            src={coin?.image}
            alt={coin.name}
            className={classes.coinImage}
          />
          
          <div className={classes.symbol}>{coin?.symbol}</div>
          
          <PriceChange value={coin?.price_change_percentage_24h} size="small" />
          
          <div className={classes.price}>
            {symbol}{coinWithComa(coin?.current_price.toFixed(2))}
          </div>
        </GlassCard>
      </Link>
    )
  })

  return (
    <div className={classes.carousel}>
      <AliceCarousel 
        mouseTracking
        infinite
        autoPlayInterval={2000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  )
}

export default Corousels
