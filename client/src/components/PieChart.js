import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function PieChart({ totalData }) {
  //console.log(totalData);
  const totalConfirmedCases = totalData.confirmed;
  const totalDeaths = totalData.deaths;
  const totalRecoveries = totalData.recovered;

  // used useRef due to the error:
  // "Canvas is already in use. Chart with ID '1' must be destroyed before the canvas with ID '1' can be reused."
  // source: https://www.youtube.com/watch?v=p3aEoyfhZ8o
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const myChartRef = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(myChartRef, {
      type: "pie",
      data: chartData,
    });
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const chartData = {
    labels: ["Confirmed Cases", "Deaths", "Recoveries"],
    datasets: [
      {
        data: [totalConfirmedCases, totalDeaths, totalRecoveries],
        backgroundColor: [
          "rgba(179,205,227)",
          "rgba(251,180,174)",
          "rgba(204,235,197)",
        ],
      },
    ],
  };

  return (
    <div className="flex justify-center items-center" style={{ width: "700px", height: "500px" }}>
      <canvas ref={chartRef}></canvas>
    </div>

  );
}

export default PieChart;
