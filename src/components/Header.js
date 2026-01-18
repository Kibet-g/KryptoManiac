/**
 * Premium Header with Glassmorphism
 */
import React from 'react';
import { AppBar, Container, Toolbar, makeStyles, createTheme, ThemeProvider } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import AuthModal from './Athentication/AuthModal';
import UserSidebar from './Athentication/UserSidebar';
import CurrencySelector from './CurrencySelector';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: 'rgba(10, 11, 20, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: 'none',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  logoIcon: {
    fontSize: 28,
    filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontFamily: "'Inter', 'Montserrat', sans-serif",
    letterSpacing: '-0.5px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
}));

const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = CryptoState();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#00d4ff',
      },
      type: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="sticky" className={classes.appBar}>
        <Container>
          <Toolbar className={classes.toolbar} disableGutters>
            {/* Premium Logo */}
            <div className={classes.logo} onClick={() => history.push('/')}>
              <span className={classes.logoIcon}>🛡️</span>
              <span className={classes.logoText}>CryptoManiac</span>
            </div>

            {/* Right Section */}
            <div className={classes.rightSection}>
              <CurrencySelector />
              {user ? <UserSidebar /> : <AuthModal />}
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;

