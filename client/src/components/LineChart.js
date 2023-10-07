import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);
//sources: https://www.chartjs.org/docs/latest/charts/line.html & https://www.youtube.com/@ChartJS-tutorials

function LineChart({ data }) {
  //console.log(data);
  const dates = data.map((entry) => new Date(entry.date).toLocaleDateString());
  const confirmedCases = data.map((entry) => entry.confirmed);
  const deaths = data.map((entry) => entry.deaths);
  const recoveries = data.map((entry) => entry.recovered);

  //for range selectors we have to filter the dates
  //they come from the database in this format 22/01/2020
  //we have to convert them in milliseconds time so we can filter them later from the user input (date picker format is yyyy-mm-dd)
  // also document.getElementById("endDate").value; returns a string in the format yyyy-mm-dd
  // so we have to convert it to milliseconds time as well: new Date(document.getElementById("startDate").value).getTime(); to compare ms with ms

  function convertDatesFromDB(dates) {
    return dates.map((date) => {
      const [day, month, year] = date.split("/");
      const isoDate = `${year}-${month}-${day}`;
      return new Date(isoDate).setHours(0, 0, 0, 0);
    });
  }

  function convertMsToDateDBFormat(msDates) {
    return msDates.map((msDate) => {
      const date = new Date(msDate);
      const day = String(date.getDate()).padStart(2, "0");
      // getMonth() returns months 0-indexed, so we add 1 to get the correct month number
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    });
  }

  const convertedDatesFromDatabase = convertDatesFromDB(dates);

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
      options: {
        transitions: {
          show: {
            animations: {
              x: {
                from: 0,
              },
              y: {
                from: 0,
              },
            },
          },
          hide: {
            animations: {
              x: {
                to: 0,
              },
              y: {
                to: 0,
              },
            },
          },
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            },
            pan: {
              enabled: true,
              mode: 'xy',
            },
          }
        },
      },
    });
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
  //console.log({dates})

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

  function resetZoom() {
    chartInstance.current.resetZoom();
  }

  function filterDates() {
    //we use setHours(0, 0, 0, 0) to skip the time part for all cases because we will work with milliseconds time
    const startDate1 = new Date(document.getElementById("startDate").value);
    const startDate = startDate1.setHours(0, 0, 0, 0);
    // console.log(startDate)
    const endDate1 = new Date(document.getElementById("endDate").value);
    const endDate = endDate1.setHours(0, 0, 0, 0);
    //console.log(endDate)
    const filterDates = convertedDatesFromDatabase.filter(
      (date) => date >= startDate && date <= endDate
    );
    const startArrayIndex = convertedDatesFromDatabase.indexOf(filterDates[0]);
    const endArrayIndex = convertedDatesFromDatabase.indexOf(
      filterDates[filterDates.length - 1]
    );
    const copyConfirmedCases = [...confirmedCases];
    const copyDeaths = [...deaths];
    const copyRecoveries = [...recoveries];
    const filteredConfirmedCases = copyConfirmedCases.slice(
      startArrayIndex,
      endArrayIndex + 1
    );
    const filteredDeaths = copyDeaths.slice(startArrayIndex, endArrayIndex + 1);
    const filteredRecoveries = copyRecoveries.slice(
      startArrayIndex,
      endArrayIndex + 1
    );
    //update the chart
    chartData.labels = convertMsToDateDBFormat(filterDates);
    chartData.datasets[0].data = filteredDeaths;
    chartData.datasets[1].data = filteredRecoveries;
    chartData.datasets[2].data = filteredConfirmedCases;
    chartInstance.current.update();
  }

  function resetDates() {
    chartData.labels = dates;
    chartData.datasets[0].data = deaths;
    chartData.datasets[1].data = recoveries;
    chartData.datasets[2].data = confirmedCases;
    chartInstance.current.update();
  }

  return (
    <div style={{ width: "1000px", height: "800px" }}>
      <canvas ref={chartRef}></canvas>
      Start:
      <input type="date" id="startDate" min="2020-01-22" max="2020-07-26" />
      End: <input type="date" id="endDate" min="2020-01-23" max="2020-07-27" />
      <button onClick={resetZoom}>RZoom</button>
      <button onClick={filterDates}>Filter</button>
      <button onClick={resetDates}>Reset</button>
    </div>
  );
}

export default LineChart;
