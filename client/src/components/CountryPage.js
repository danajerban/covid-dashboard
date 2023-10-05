// components/CountryPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CountryPage() {
  const { countryId } = useParams();
  const [data, setData] = useState(null);

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
  }, [countryId]);

  return (
    <div>
      <h1>Data for country ID {countryId}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>  {/* double checking data */}
    </div>
  );
}

export default CountryPage;
