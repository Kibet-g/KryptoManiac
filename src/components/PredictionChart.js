/**
 * Premium PredictionChart Component - Chart with AI prediction overlay
 * Showcases historical movement with a futuristic AI projection
 */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import { getPrediction } from '../services/MLService';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    position: 'relative',
    marginTop: 20,
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    fontWeight: 600,
  },
  lineIndicator: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  toggleArea: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 24,
  },
  predictionBtn: {
    padding: '12px 28px',
    borderRadius: 30,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  btnActive: {
    background: 'var(--accent-gradient)',
    color: '#fff',
    boxShadow: 'var(--accent-glow)',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)',
    },
  },
  btnInactive: {
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.6)',
    },
  },
}));

const PredictionChart = ({ 
  historicData, 
  symbol, 
  days, 
  currency 
}) => {
  const classes = useStyles();
  const [showPrediction, setShowPrediction] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!showPrediction || !symbol) return;
      
      setLoading(true);
      try {
        const data = await getPrediction(symbol, 7);
        if (data?.predictions) {
          setPredictions(data.predictions);
        }
      } catch (err) {
        console.error('Prediction error:', err);
      }
      setLoading(false);
    };

    fetchPredictions();
  }, [symbol, showPrediction]);

  if (!historicData) return null;

  // Prepare historical labels and data
  const historicalLabels = historicData.map((coin) => {
    let date = new Date(coin[0]);
    let time = date.getHours() > 12 
      ? `${date.getHours() - 12}:${date.getMinutes()}PM`
      : `${date.getHours()}:${date.getMinutes()}AM`;
    return days === 1 ? time : date.toLocaleDateString();
  });

  const historicalPrices = historicData.map((coin) => coin[1]);

  // Prepare prediction data
  let predictionLabels = [];
  let predictionData = [];
  
  if (showPrediction && predictions.length > 0) {
    predictionLabels = predictions.map((p) => {
      const date = new Date(p.timestamp);
      return date.toLocaleDateString();
    });
    
    predictionData = [
      ...Array(historicalPrices.length - 1).fill(null),
      historicalPrices[historicalPrices.length - 1], // Connect point
      ...predictions.map(p => p.predicted_price)
    ];
  }

  const allLabels = showPrediction 
    ? [...historicalLabels, ...predictionLabels]
    : historicalLabels;

  const datasets = [
    {
      data: historicalPrices,
      label: `Historical Price`,
      borderColor: '#00d4ff',
      borderWidth: 3,
      pointRadius: (context) => (context.dataIndex === historicalPrices.length - 1 ? 5 : 0),
      pointBackgroundColor: '#00d4ff',
      backgroundColor: (context) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0.1)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
    }
  ];

  if (showPrediction && predictions.length > 0) {
    datasets.push({
      data: predictionData,
      label: 'AI Projection',
      borderColor: '#7b2dff',
      borderDash: [8, 4],
      borderWidth: 3,
      backgroundColor: (context) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(123, 45, 255, 0)');
        gradient.addColorStop(1, 'rgba(123, 45, 255, 0.1)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointRadius: (context) => (context.dataIndex === predictionData.length - 1 ? 6 : 0),
      pointBackgroundColor: '#7b2dff',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    });
  }

  return (
    <div className={classes.container}>
      <Line
        data={{
          labels: allLabels,
          datasets: datasets,
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(10, 11, 20, 0.9)',
              titleColor: '#00d4ff',
              bodyColor: '#fff',
              cornerRadius: 12,
              padding: 12,
              bodySpacing: 8,
              usePointStyle: true,
            },
          },
          scales: {
            y: {
              grid: {
                color: 'rgba(255,255,255,0.05)',
                drawBorder: false,
              },
              ticks: {
                color: 'rgba(255,255,255,0.4)',
                font: { size: 11 },
                callback: (value) => '$' + value.toLocaleString(),
              },
            },
            x: {
              grid: { display: false },
              ticks: {
                color: 'rgba(255,255,255,0.4)',
                font: { size: 11 },
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 10,
              },
            },
          },
        }}
      />

      <div className={classes.legend}>
        <div className={classes.legendItem}>
          <div className={classes.lineIndicator} style={{ background: '#00d4ff' }} />
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Verified Market Data</span>
        </div>
        {showPrediction && (
          <div className={classes.legendItem}>
            <div className={classes.lineIndicator} style={{ background: '#7b2dff', border: '1px dashed #fff' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
              {loading ? 'Analyzing...' : 'AI Predicted Path'}
            </span>
          </div>
        )}
      </div>

      <div className={classes.toggleArea}>
        <button
          className={`${classes.predictionBtn} ${
            showPrediction ? classes.btnActive : classes.btnInactive
          }`}
          onClick={() => setShowPrediction(!showPrediction)}
        >
          <span>{showPrediction ? '🛡️' : '🔮'}</span>
          {showPrediction ? 'AI Oracle Active' : 'Enable AI Predictions'}
        </button>
      </div>
    </div>
  );
};

export default PredictionChart;

