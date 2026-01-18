/**
 * Premium CoinInfo Component
 * Integrates interactive charts with AI Trading Guardian insights
 */
import { CircularProgress, createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { HistoricalChart } from '../config/api';
import { CryptoState } from '../CryptoContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { chartDays } from '../config/data';
import SelectButton from './SelectButton';
import GlassCard from './ui/GlassCard';
import { getMockHistory } from '../config/mockData';

// AI Trading Guardian Components
import PredictionCard from './PredictionCard';
import PredictionChart from './PredictionChart';
import LivePriceTicker from './LivePriceTicker';
import WhaleAlert from './WhaleAlert';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);



const useStyles = makeStyles((theme) => ({
// ... 
}));

const CoinInfo = () => {
  const { id } = useParams();
  const [historicData, sethistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const classes = useStyles();

  const fetchHistoricData = async () => {
     try {
       const { data } = await axios.get(HistoricalChart(id, days, currency));
       sethistoricData(data.prices);
     } catch (error) {
       console.error("Error fetching historic data, utilizing fallback", error);
       sethistoricData(getMockHistory(days, currency));
     }
  }

  useEffect(() => {
    fetchHistoricData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, days, id]);

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#00d4ff" },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        
        {/* Live Market Pulse Header */}
        <LivePriceTicker symbol={id} />

        {/* Technical Analysis Chart */}
        <GlassCard className={classes.chartContainer} radius={32}>
          <div className={classes.sectionTitle}>
            Market Performance
          </div>
          
          {!historicData ? (
            <div className={classes.loaderBox}>
              <CircularProgress style={{ color: "#00d4ff" }} size={100} thickness={2} />
            </div>
          ) : (
            <>
              <PredictionChart 
                historicData={historicData}
                symbol={id}
                days={days}
                currency={currency}
              />
              <div className={classes.timeframeRow}>
                {chartDays.map(day => (
                  <SelectButton 
                    key={day.value}
                    onClick={() => setDays(day.value)}  
                    selected={day.value === days}
                  >
                    {day.label}
                  </SelectButton>
                ))}
              </div>
            </>
          )}
        </GlassCard>

        {/* AI Trading Guardian Insights */}
        <div className={classes.aiGrid}>
          {/* AI Signals Card */}
          <div>
            <div className={classes.sectionTitle}>AI Prediction Engine</div>
            <PredictionCard coinId={id} symbol={id?.toUpperCase()} />
          </div>
          
          {/* Whale Activity Card */}
          <div>
            <div className={classes.sectionTitle}>Blockchain Intelligence</div>
            <WhaleAlert symbol={id} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default CoinInfo;


