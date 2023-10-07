import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalHeatMapDeaths from "./GlobalHeatMapDeaths";
import ChoroplethGlobalMapCases from "./ChoroplethGlobalMapCases";
import SearchBar from "./SearchBar";
import ChoroplethGlobalMapDeaths from "./ChoroplethGlobalMapDeaths";
import GlobalHeatMapCases from "./GlobalHeatMapCases";

function Homepage() {
  const [view, setView] = useState("Cases");
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="p-4">
      <button onClick={handleGoToLogin}>Go to Login</button>
      <SearchBar />
      <label className="flex items-center cursor-pointer mt-4 mb-4">
        <div className="relative border border-pink-400 rounded-full">
          <input
            type="checkbox"
            className="sr-only"
            checked={view === "Deaths"}
            onChange={() => setView(view === "Cases" ? "Deaths" : "Cases")}
          />
          <div className="block bg-pink-100 w-14 h-8 rounded-full"></div>
          <div
            className={`dot absolute left-1 top-1 bg-pink-400 w-6 h-6 rounded-full transition transform duration-500 ease-in-out ${
              view === "Deaths" ? "translate-x-full" : ""
            }`}
          />
        </div>
        <div className="ml-3 text-gray-700 font-medium">{view}</div>
      </label>
      {view === "Cases" ? (
        <>
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-2">Country specific choropleth map for Confirmed Cases</h2>
            <ChoroplethGlobalMapCases />
          </div>
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-2">Relative intensity heatmap for Confirmed Cases</h2>
            <GlobalHeatMapCases />
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-2">
            Country specific choropleth map for Death cases
            </h2>
            <ChoroplethGlobalMapDeaths />
          </div>
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold mb-2">Relative intensity heatmap for Death Cases</h2>
            <GlobalHeatMapDeaths />
          </div>
        </>
      )}
    </div>
  );
}

export default Homepage;
