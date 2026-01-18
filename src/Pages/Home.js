import React from 'react'
import Banner from '../components/Banner/Banner'
import CoinTable from '../components/CoinTable'
import MarketGlobe from '../components/3d/MarketGlobe'
import { Container, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  section: {
    padding: '60px 0',
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 40,
    background: 'linear-gradient(135deg, #fff 0%, #00d4ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
  }
}));

const Home = () => {
  const classes = useStyles();
  return (
    <>
      <Banner />
      <Container>
        <div className={classes.section}>
          <h2 className={classes.title}>Global Market Dynamics</h2>
          <MarketGlobe />
        </div>
        <CoinTable />
      </Container>
    </>
  )
}

export default Home
