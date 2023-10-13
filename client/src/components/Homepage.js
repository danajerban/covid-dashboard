import React, { useState } from "react";
import GlobalHeatMapDeaths from "./GlobalHeatMapDeaths";
import ChoroplethGlobalMapCases from "./ChoroplethGlobalMapCases";
import ChoroplethGlobalMapDeaths from "./ChoroplethGlobalMapDeaths";
import GlobalHeatMapCases from "./GlobalHeatMapCases";

function Homepage() {
  const [view, setView] = useState("Cases");
  const [mapType, setMapType] = useState("Choropleth");

  // this code is just for handling the homepage view and map type
  // it has 2 toggles, 1 for cases/deaths and 1 for choropleth/heatmap
  // and renders the map based on the user's choice
  // the code is pretty self-explanatory, so I won't go into details
  return (
    <div className="p-4 bg-gray-100">
      <div className="flex justify-end space-x-4 mt-4 mb-4">
        {/* First Toggle for Cases/Deaths */}
        <label className="flex items-center cursor-pointer">
          <div className="relative border border-gray-300 rounded-full">
            <input
              type="checkbox"
              className="sr-only"
              checked={view === "Deaths"}
              onChange={() => setView(view === "Cases" ? "Deaths" : "Cases")}
            />
            <div className="block w-12 h-6 rounded-full"></div>
            <div
              className={`dot absolute left-1 top-0.5 bg-pink-600 w-5 h-5 rounded-full transition transform duration-500 ease-in-out ${
                view === "Deaths" ? "translate-x-full" : ""
              }`}
            />
          </div>
          <div className="ml-3 text-gray-700 font-medium">{view}</div>
        </label>
        {/* second toggle for Choropleth/Heatmap */}
        <label className="flex items-center cursor-pointer">
          <div className="relative border border-gray-300 rounded-full">
            <input
              type="checkbox"
              className="sr-only"
              checked={mapType === "Heatmap"}
              onChange={() =>
                setMapType(mapType === "Choropleth" ? "Heatmap" : "Choropleth")
              }
            />
            <div className="block w-12 h-6 rounded-full"></div>
            <div
              className={`dot absolute left-1 top-0.5 bg-pink-600 w-5 h-5 rounded-full transition transform duration-500 ease-in-out ${
                mapType === "Heatmap" ? "translate-x-full" : ""
              }`}
            />
          </div>
          <div className="ml-3 text-gray-700 font-medium">{mapType}</div>
        </label>
      </div>
      {view === "Cases" ? (
        <>
          <div className="text-center text-gray-700 mb-4">
            <h2 className="text-xl font-semibold mb-2">
              {`${
                mapType === "Choropleth"
                  ? "Country specific choropleth map"
                  : "Relative intensity heatmap"
              } for Confirmed Cases`}
            </h2>
            {mapType === "Choropleth" ? (
              <ChoroplethGlobalMapCases />
            ) : (
              <GlobalHeatMapCases />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="text-center text-gray-700 mb-4">
            <h2 className="text-xl font-semibold mb-2">
              {`${
                mapType === "Choropleth"
                  ? "Country specific choropleth map"
                  : "Relative intensity heatmap"
              } for Death Cases`}
            </h2>
            {mapType === "Choropleth" ? (
              <ChoroplethGlobalMapDeaths />
            ) : (
              <GlobalHeatMapDeaths />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Homepage;
