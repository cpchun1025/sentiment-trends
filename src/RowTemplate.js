import React from 'react';
import { Sparkline } from 'devextreme-react/sparkline';

// This component renders a row for each stock
const RowTemplate = ({ stock, data }) => {
  return (
    <tr>
      <td>{stock}</td>
      <td>
        {data.last2d && data.last2d.length > 0 ? (
          <Sparkline
            dataSource={data.last2d}
            argumentField="published_at"
            valueField="confidence_score"
            type="line"
          />
        ) : <p>No Data</p>}
      </td>
      <td>
        {data.last5d && data.last5d.length > 0 ? (
          <Sparkline
            dataSource={data.last5d}
            argumentField="published_at"
            valueField="confidence_score"
            type="line"
          />
        ) : <p>No Data</p>}
      </td>
      <td>
        {data.last10d && data.last10d.length > 0 ? (
          <Sparkline
            dataSource={data.last10d}
            argumentField="published_at"
            valueField="confidence_score"
            type="line"
          />
        ) : <p>No Data</p>}
      </td>
    </tr>
  );
};

export default RowTemplate;