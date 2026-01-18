export const mockCoins = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 64230,
    market_cap: 1200000000000,
    price_change_percentage_24h: 2.5
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3450,
    market_cap: 400000000000,
    price_change_percentage_24h: -1.2
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 145,
    market_cap: 65000000000,
    price_change_percentage_24h: 5.4
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 590,
    market_cap: 87000000000,
    price_change_percentage_24h: 0.8
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.62,
    market_cap: 34000000000,
    price_change_percentage_24h: -0.5
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.45,
    market_cap: 16000000000,
    price_change_percentage_24h: 1.1
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 35.20,
    market_cap: 13000000000,
    price_change_percentage_24h: 4.2
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.16,
    market_cap: 23000000000,
    price_change_percentage_24h: -2.3
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 7.20,
    market_cap: 10000000000,
    price_change_percentage_24h: 0.5
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: 14.50,
    market_cap: 8500000000,
    price_change_percentage_24h: 3.1
  }
];

export const getMockCoinDetail = (id) => {
  const coin = mockCoins.find(c => c.id === id) || mockCoins[0];
  
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    image: {
      large: coin.image
    },
    description: {
      en: "Market data for this asset is currently being served from our backup nodes due to high traffic functionality on the public API. Real-time updates will resume automatically."
    },
    market_cap_rank: 1,
    market_data: {
      current_price: {
        usd: coin.current_price
      },
      market_cap: {
        usd: coin.market_cap
      },
      price_change_percentage_24h: coin.price_change_percentage_24h
    }
  };
};

export const getMockHistory = () => {
  const data = [];
  let price = 50000;
  const now = Date.now();
  
  for (let i = 100; i > 0; i--) {
    price = price * (1 + (Math.random() - 0.5) * 0.05); // +/- 2.5% variation
    data.push([
      now - i * 24 * 60 * 60 * 1000,
      price
    ]);
  }
  return data;
};

export const getMockPrediction = (symbol, days = 7) => {
  const mockCoin = mockCoins.find(c => c.id === symbol?.toLowerCase() || c.symbol === symbol?.toLowerCase()) || mockCoins[0];
  const basePrice = mockCoin.current_price;
  const targetPrice = basePrice * (1 + (Math.random() * 0.1 + 0.02)); // 2-12% increase
  
  return {
    symbol: mockCoin.symbol.toUpperCase(),
    signal: 'BUY',
    predicted_price: targetPrice,
    confidence_stars: 4,
    risk_level: 'MEDIUM',
    explanation: `Based on technical analysis, ${mockCoin.name} shows strong momentum with positive market sentiment. AI models suggest accumulation within this price range.`,
    prediction: Array.from({ length: days }, (_, i) => ({
      day: `Day ${i + 1}`,
      price: basePrice * (1 + (i * 0.015))
    }))
  };
};

export const getMockWhaleAlerts = (symbol) => {
  return {
    alert_level: "HIGH",
    message: "Significant accumulation detected by institutional wallets.",
    whale_count: 12,
    total_volume_usd: 156000000,
    transactions: [
      { amount: 500, symbol: symbol.toUpperCase(), usd_value: 25000000 },
      { amount: 320, symbol: symbol.toUpperCase(), usd_value: 16000000 },
      { amount: 150, symbol: symbol.toUpperCase(), usd_value: 7500000 }
    ]
  };
};
