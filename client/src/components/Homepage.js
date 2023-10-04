import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GlobalHeatMapDeaths from "./GlobalHeatMapDeaths";
import ChoroplethGlobalMapCases from "./ChoroplethGlobalMapCases";

function Homepage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await axios.get("http://localhost:5000");
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="p-4">
      <button onClick={handleGoToLogin}>Go to Login</button>
      <ChoroplethGlobalMapCases />
      <br></br>
      <GlobalHeatMapDeaths />
    </div>
  );
}

export default Homepage;
