import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparkline } from 'devextreme-react/sparkline';

const SentimentSparkline = () => {
  const [sentimentData, setSentimentData] = useState([]);  // Holds the data for Sparkline
  const [stockSymbol, setStockSymbol] = useState('');
  const [sentimentLabel, setSentimentLabel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch sentiment trend data from the Flask API with filters
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/sentiment-trends', {
        params: {
          stock_symbol: stockSymbol,
          sentiment_label: sentimentLabel,
          start_date: startDate,
          end_date: endDate,
        },
      });

      // Format data if necessary and set it to the state
      const formattedData = response.data.map(item => ({
        published_at: item.published_at,  // Ensure this is a date field
        confidence_score: item.confidence_score  // Ensure this is a numeric value
      }));
      
      console.log('Formatted Data:', formattedData);  // Log the formatted data for debugging
      setSentimentData(formattedData);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchData();
  }, [stockSymbol, sentimentLabel, startDate, endDate]);

  // Handle form submission for filtering
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Sentiment Trends</h2>

      {/* Filter Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label>
          Stock Symbol:
          <input type="text" value={stockSymbol} onChange={(e) => setStockSymbol(e.target.value)} />
        </label>
        <label>
          Sentiment Label:
          <input type="text" value={sentimentLabel} onChange={(e) => setSentimentLabel(e.target.value)} />
        </label>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <button type="submit">Filter</button>
      </form>

      {/* Sparkline Chart */}
      {sentimentData.length > 0 ? (
        <Sparkline
          dataSource={sentimentData}  // Providing the dataSource here
          argumentField="published_at"  // X-axis
          valueField="confidence_score"  // Y-axis
          type="line"
          showMinMax={true}
          showFirstLast={true}
          tooltip={{
            enabled: true,
            customizeTooltip(arg) {
              return {
                text: `Date: ${arg.argumentText}\nScore: ${arg.valueText}`
              };
            }
          }}
        />
      ) : (
        <p>No data available for the selected filters</p>
      )}
    </div>
  );
};

export default SentimentSparkline;