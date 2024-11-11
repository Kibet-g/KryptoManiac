import React from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={logo} alt="logo" />
        <ul>
            <li>Home</li>
        </ul>
        <div clasName="nav-right">
            <select>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="ksh">KSH</option>
            </select>
        </div>
    </div>
  )
}

export default Navbar