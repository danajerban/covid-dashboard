import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LineChart from './LineChart';
import PieChart from './PieChart';

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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-bold mb-4 text-center w-full">Data for country ID {countryId}</h1>
      <div className="flex justify-center w-full mb-16">
        {data && <LineChart data={data} />}
      </div>
      <p className="text-center w-full mb-4">Complete statistics for "country name" from "22 January 2020 until 20 June 2020"</p>
      <div className="flex justify-center w-full">
        {totalData && <PieChart totalData={totalData} />}
      </div>
    </div>
  );
}

export default CountryPage;
