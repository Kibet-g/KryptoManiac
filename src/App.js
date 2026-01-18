import './App.css';
import './styles/theme.css'; // Premium design system
import Header from './components/Header';
import Home from './Pages/Home';
import Bitcoin from './Pages/Bitcoin';
import {BrowserRouter, Route} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Alert from './components/Alert';

function App() {
  const useStyle = makeStyles(() => ({
    App: {
      background: 'linear-gradient(180deg, #0a0b14 0%, #12141f 50%, #0a0b14 100%)',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      minHeight: '100vh',
      position: 'relative',
    },
  }));
  
  const classes = useStyle();
  
  return (
    <>
      <BrowserRouter>
        <div className={classes.App}>
          <Header />
          <Route path='/' component={Home} exact />
          <Route path='/coins/:id' component={Bitcoin} exact />
        </div>
        <Alert />
      </BrowserRouter>
    </>
  );
}

export default App;

