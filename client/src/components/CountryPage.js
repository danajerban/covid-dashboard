// components/CountryPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LineChart from './LineChart';
import PolarAreaChart from './PolarAreaChart';

function CountryPage() {
  const { countryId } = useParams();
  const [data, setData] = useState(null);
  const [totalData, setTotalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/search/${countryId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/search/totals/${countryId}`);
        setTotalData(response.data);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data for country ID {countryId}</h1>
      {data && <LineChart data={data} /> }
      {totalData && <PolarAreaChart totalData={totalData} /> }
    </div>
  );
}

export default CountryPage;
