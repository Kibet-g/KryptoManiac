// API Configuration for CoinGecko
// Now supports pagination with 250 coins per page (max allowed)

export const CoinList = (currency, page = 1, perPage = 250) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;

export const SingleCoin = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}`;

export const HistoricalChart = (id, days = 365, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const TrendingCoins = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

// Get all coins (for search) - returns IDs and names only
export const AllCoins = () =>
  `https://api.coingecko.com/api/v3/coins/list`;

// Global market stats
export const GlobalStats = () =>
  `https://api.coingecko.com/api/v3/global`;
