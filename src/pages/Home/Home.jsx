import React, { useContext, useState } from 'react';
import { CoinContext } from '../../context/CoinContext';
import './Home.css';

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for: ', searchQuery);
  };

  const filteredCoins = allCoin.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);
  const startIndex = (currentPage - 1) * coinsPerPage;
  const currentCoins = filteredCoins.slice(startIndex, startIndex + coinsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="home">
      <div className="bubble-background">
        <div className="hero">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search for a coin..." 
              value={searchQuery} 
              onChange={handleSearchChange} 
            />
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="crypto-table">
          {/* Table Header */}
          <div className="table-layout">
            <p>#</p>
            <p>Coin</p>
            <p>Price ({currency.symbol})</p>
            <p>24h Change</p>
            <p>Market Cap</p>
          </div>

          {/* Table Content - paginated */}
          {currentCoins.map((coin, index) => (
            <div className="table-layout" key={coin.id}>
              <p>{startIndex + index + 1}</p>
              <div>
                <img src={coin.image} alt={coin.name} />
                <p>{coin.name}</p>
              </div>
              <p>{currency.symbol}{coin.current_price.toLocaleString()}</p>
              <p className={coin.price_change_percentage_24h > 0 ? 'green' : 'red'}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
              <p className="market-cap">
                {currency.symbol}{coin.market_cap.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <p>Page {currentPage} of {totalPages}</p>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
