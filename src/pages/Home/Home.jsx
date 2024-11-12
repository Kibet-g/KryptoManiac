import React from 'react'
import './Home.css'

const Home = () => {
  return (
    <div clasName='home'>
        <div className='hero'>
            <h1>Track <br /> Your Crypto</h1>
            <p>Welcome To KryptoManiac Where you can
            track your favorite crypto currencies and get the latest prices
            </p>
            <form >
                <input type="text" placeholder= 'Search for Crypto'/>
                <button type="submit">Search</button>

            </form>

        </div>
        <div className="crypto-table">
  <div className="table-layout">
    <p>#</p>
    <p>Coins</p>
    <p>Price</p>
    <p>24h %</p>
    <p>Market Cap</p>
  </div>
</div>
    </div>
  )
}

export default Home