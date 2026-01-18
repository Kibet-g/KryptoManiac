import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CryptoContext from './CryptoContext';
import "react-alice-carousel/lib/alice-carousel.css";


const isConfigured = process.env.REACT_APP_FIREBASE_API_KEY;

ReactDOM.render(
  <React.StrictMode>
    {isConfigured ? (
      <CryptoContext>
        <App />
      </CryptoContext>
    ) : (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#14161a',
        color: 'white',
        fontFamily: 'Montserrat',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ color: '#ff3366' }}>Configuration Missing</h1>
        <p style={{ maxWidth: '600px', lineHeight: '1.6' }}>
          The application cannot start because the Environment Variables are missing.
          <br /><br />
          <strong>Solution:</strong>
          <br />
          1. Go to Netlify Site Settings &gt; Environment Variables.
          <br />
          2. Ensure `REACT_APP_FIREBASE_API_KEY` is added.
          <br />
          3. <strong>IMPORTANT:</strong> Go to Deploys and click <strong>"Trigger Deploy"</strong> to apply the changes.
        </p>
      </div>
    )}
  </React.StrictMode>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

