import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function LineChart({ data }) {
  //console.log(data);
  const dates = data.map((entry) => new Date(entry.date).toLocaleDateString());
  const confirmedCases = data.map((entry) => entry.confirmed);
  const deaths = data.map((entry) => entry.deaths);
  const recoveries = data.map((entry) => entry.recovered);

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
      type: "line",
      data: chartData,
    });
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Deaths",
        data: deaths,
        fill: true,
        backgroundColor: "rgba(251,180,174)",
        borderColor: "rgba(255, 0, 0, 1)",
        pointBorderColor: "rgba(255, 0, 0, 1)",
        pointBackgroundColor: "rgba(255, 0, 0, 1)",
        pointRadius: 2,
        pointStyle: "circle",
        hoverRadius: 10,
      },
      {
        label: "Recoveries",
        data: recoveries,
        fill: true,
        backgroundColor: "rgba(204,235,197)",
        borderColor: "rgba(12, 171, 12, 1)",
        pointBorderColor: "rgba(12, 171, 12, 1)",
        pointBackgroundColor: "rgba(12, 171, 12, 1)",
        pointRadius: 2,
        pointStyle: "circle",
        hoverRadius: 10,
      },
      {
        label: "Confirmed Cases",
        data: confirmedCases,
        fill: true,
        backgroundColor: "rgba(179,205,227)",
        borderColor: "rgba(0, 132, 255, 1)",
        pointBorderColor: "rgba(0, 132, 255, 1)",
        pointBackgroundColor: "rgba(0, 132, 255, 1)",
        pointRadius: 2,
        pointStyle: "circle",
        hoverRadius: 10,
      },
    ],
  };

  return (
    <div style={{ width: "1000px", height: "800px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default LineChart;
