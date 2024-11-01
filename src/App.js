import React, { useState, useEffect } from 'react';
import RowTemplate from './RowTemplate';
import axios from 'axios';

const stocks = ['AAPL', 'GOOGL', 'MSFT'];  // List of stock symbols

function App() {
  // Define state to hold the sentiment data for each stock
  const [sentimentData, setSentimentData] = useState({});

  // Fetch sentiment trends for each stock and each time period (2d, 5d, 10d)
  useEffect(() => {
    const fetchData = async () => {
      const stockData = {};

      for (const stock of stocks) {
        const data = {
          last2d: await fetchSentiment(stock, 2),
          last5d: await fetchSentiment(stock, 5),
          last10d: await fetchSentiment(stock, 10),
        };
        stockData[stock] = data;
      }

      setSentimentData(stockData);
    };

    fetchData();
  }, []);

  // Helper function to fetch sentiment data for a stock over a given number of days
  const fetchSentiment = async (stockSymbol, days) => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/sentiment-trends', {
        params: {
          stock_symbol: stockSymbol,
          start_date: getPastDate(days),
          end_date: new Date().toISOString().split('T')[0],
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching sentiment data for ${stockSymbol} (${days} days):`, error);
      return [];
    }
  };

  // Helper function to get the past date from today
  const getPastDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  return (
    <React.Fragment>
      <div className="long-title"><h3>Sentiment Trends for Stocks</h3></div>
      <div id="chart-demo">
        <table className="demo-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Last 2 Days</th>
              <th>Last 5 Days</th>
              <th>Last 10 Days</th>
            </tr>
          </thead>
          <tbody>
            {
              stocks.map((stock, index) => (
                <RowTemplate key={index} stock={stock} data={sentimentData[stock] || {}} />
              ))
            }
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export default App;