import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import { CoinContext } from '../../context/CoinContext';

const Home = () => {
  const { allCoin } = useContext(CoinContext); 
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10; // Number of coins per page

  // Get the current coins for the page
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = displayCoin.slice(indexOfFirstCoin, indexOfLastCoin);

  const inputHandler = (event) => {
    setInput(event.target.value);
    if (event.target.value === "") {
      setDisplayCoin(allCoin);
    }
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    const coins = await allCoin.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
    setCurrentPage(1); // Reset to first page on search
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  return (
    <div className='home'>
      <div className='hero'>
        <h1>Krypto Maniac <br/> The Crypto Marketplace</h1>
        <p>
          Welcome to Krypto Maniac, the best place to check on your market prices.
        </p>
        <form onSubmit={searchHandler}>
          <input 
            onChange={inputHandler} 
            list='coinlist' 
            value={input} 
            type="text" 
            placeholder='Search crypto..' 
            required 
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{textAlign: "center"}}>24H Change</p>
          <p className='market-cap'>Market Cap</p>
        </div>
        {
          currentCoins.map((coin, index) => (
            <div className="table-layout" key={coin.id}>
              <p>{indexOfFirstCoin + index + 1}</p>
              <p>{coin.name}</p>
              <p>{coin.current_price}</p>
              <p style={{ textAlign: "center" }}>{coin.price_change_percentage_24h}%</p>
              <p className='market-cap'>{coin.market_cap}</p>
            </div>
          ))
        }
      </div>

      {/* Pagination Buttons */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={nextPage} disabled={indexOfLastCoin >= displayCoin.length}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
