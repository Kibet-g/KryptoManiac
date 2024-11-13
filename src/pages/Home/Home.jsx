import React, { useContext, useEffect, useState} from 'react'
import './Home.css'
import { CoinContext } from '../../context/CoinContext'

const Home = () => {

  const {allCoin, currency} = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');

  const inputHandler = (event)=>{
    setInput(event.target.value);
    if(event.target.value === ""){
      setDisplayCoin(allCoin);
    }

  }

  const searchHandler = async (event)=>{
    event.preventDefault();
     const coins = await allCoin.filter((item)=>{
       return item.name.toLowerCase().includes(input.toLowerCase())
    })
    setDisplayCoin(coins);
  }

  useEffect(()=>{
    setDisplayCoin(allCoin);
  },[allCoin])

  return (
    <div className='home'>
      <div className='hero'>
        <h1>Krypto Maniac <br/> The Crypto Marketplace</h1>
        <p>
          Welcome to krypto maniac, the best place to Check on your Market Prices.
        </p>
        <form onSubmit={searchHandler}>


          <input onChange={inputHandler} list='coinlist' value={input} type="text" placeholder='Search crypto..' required/>
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
         
        }
      </div>
    </div>
  )
}

export default Home
