import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function PieChart({ totalData }) {
  // basically same logic as line chart, implemented for a nice UI/UX
  // same canvas error so used useRef again

  const totalConfirmedCases = totalData.confirmed;
  const totalDeaths = totalData.deaths;
  const totalRecoveries = totalData.recovered;
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
  }, [totalData]);

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
    <div
      className="flex justify-center items-center"
      style={{ width: "700px", height: "500px" }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default PieChart;
