import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);
//sources: https://www.chartjs.org/docs/latest/charts/line.html & https://www.youtube.com/@ChartJS-tutorials

function LineChart({ data }) {
  const dates = data.map((entry) => new Date(entry.date).toLocaleDateString());
  const confirmedCases = data.map((entry) => entry.confirmed);
  const deaths = data.map((entry) => entry.deaths);
  const recoveries = data.map((entry) => entry.recovered);

  // for range selectors we have to filter the dates - they come from the database in this format 22/01/2020
  // we have to convert them in milliseconds time so we can filter them later from the user input (date picker format is yyyy-mm-dd)
  // also document.getElementById("endDate").value; returns a string in the format yyyy-mm-dd
  // so we have to convert it to milliseconds time as well: new Date(document.getElementById("startDate").value).getTime();
  // in order to compare milliseconds with milliseconds time

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
                enabled: true,
              },
              mode: "xy",
            },
            pan: {
              enabled: true,
              mode: "xy",
            },
          },
        },
      },
    });
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

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
    // due to trouble with this part of the code, I based my logic around this video:
    // https://www.youtube.com/watch?v=vmp3czGfw2U and the documentation of chart.js
    // Initially I wanted to filter in the back-end as well but I could see there was no point on
    // doing so, filtering in front-end worked just fine

    chartInstance.current.resetZoom();
    //we use setHours(0, 0, 0, 0) to skip the time part for all cases because we will work with milliseconds time (which includes the time)
    const startDate1 = new Date(document.getElementById("startDate").value);
    const startDate = startDate1.setHours(0, 0, 0, 0);

    const endDate1 = new Date(document.getElementById("endDate").value);
    const endDate = endDate1.setHours(0, 0, 0, 0);

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
    // update the chart with the filtered data
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
    chartInstance.current.resetZoom();
    chartInstance.current.update();
  }

  return (
    <div className="flex w-11/12 mx-auto bg-gray-100 rounded-lg items-center">
      <div className="flex-grow relative" style={{ height: "70vh" }}>
        <canvas ref={chartRef}></canvas>
      </div>
      <div
        className="flex flex-col items-center space-y-4 ml-1"
        style={{ minWidth: "150px", alignSelf: "center" }}
      >
        <div className="w-full text-gray-700 text-center flex flex-col space-y-1">
          Start Date:
          <input
            type="date"
            id="startDate"
            min="2020-01-22"
            max="2020-07-26"
            className=" text-gray-700 border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-600"
          />
          End Date:
          <input
            type="date"
            id="endDate"
            min="2020-01-23"
            max="2020-07-27"
            className=" text-gray-700 border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-600"
          />
        </div>
        <div className="w-full flex flex-col space-y-1 mt-4">
          <button
            onClick={filterDates}
            className="bg-pink-400 text-white rounded-lg p-2 w-full hover:bg-pink-600"
          >
            Filter
          </button>
          <button
            onClick={resetDates}
            className="bg-pink-400 text-white rounded-lg p-2 w-full hover:bg-pink-600"
          >
            Reset Filter
          </button>
        </div>
        <div className="w-full mt-4">
          <button
            onClick={resetZoom}
            className="bg-pink-300 text-white rounded-lg p-2 w-full hover:bg-pink-500"
          >
            Reset Zoom
          </button>
        </div>
      </div>
    </div>
  );
}

export default LineChart;
