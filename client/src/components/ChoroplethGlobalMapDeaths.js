import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geojsonData from "../countries.geo.json";

// sources: https://leafletjs.com/examples/choropleth/ && https://github.com/johan/world.geo.json for GeoJSON data
// and Chat gpt for legend of the table and the math behind the color intensities

const getColor = (d, maxDeaths) => {
  const intensity = Math.log(d + 1) / Math.log(maxDeaths + 1);
  return intensity > 0.9
    ? "#8b0000"
    : intensity > 0.8
    ? "#b22222"
    : intensity > 0.7
    ? "#dc143c"
    : intensity > 0.6
    ? "#ff4500"
    : intensity > 0.5
    ? "#ff6347"
    : intensity > 0.4
    ? "#ff7f50"
    : intensity > 0.3
    ? "#ffa07a"
    : intensity > 0.2
    ? "#ffb6c1"
    : intensity > 0.1
    ? "#ffc0cb"
    : "#ffd1dc";
};

const countryStyle = (feature, maxDeaths) => {
  return {
    fillColor: getColor(feature.properties.deaths, maxDeaths),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
};
const Legend = ({ maxDeaths }) => {
  const map = useMap();

  function getColor(d) {
    return d > maxDeaths * 0.9
      ? "#8b0000"
      : d > maxDeaths * 0.8
      ? "#b22222"
      : d > maxDeaths * 0.7
      ? "#dc143c"
      : d > maxDeaths * 0.6
      ? "#ff4500"
      : d > maxDeaths * 0.5
      ? "#ff6347"
      : d > maxDeaths * 0.4
      ? "#ff7f50"
      : d > maxDeaths * 0.3
      ? "#ffa07a"
      : d > maxDeaths * 0.2
      ? "#ffb6c1"
      : d > maxDeaths * 0.1
      ? "#ffc0cb"
      : "#ffd1dc";
  }

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      let labels = [];

      for (let i = 0; i < grades.length; i++) {
        const from = grades[i] * 10000;
        const to = grades[i + 1] ? grades[i + 1] * 10000 : null;
        labels.push(
          '<div style="background-color:' +
            getColor(from + 1) +
            '; width: 24px; height: 24px; float: left; opacity: 0.7; margin-right: 5px;"></div> ' +
            from.toLocaleString() +
            (to ? "&ndash;" + to.toLocaleString() + "<br>" : " +")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);

    return () => {
      map.removeControl(legend);
    };
  }, [map, maxDeaths]);

  return null;
};
const ChoroplethGlobalMapDeaths = () => {
  const [data, setData] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [maxDeaths, setMaxDeaths] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/total-cases");
        setData(response.data);
        const maxDeathsValue = response.data.reduce(
          (max, item) => Math.max(max, item.deaths),
          0
        );
        setMaxDeaths(maxDeathsValue);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const updatedGeoJsonData = { ...geojsonData };
      updatedGeoJsonData.features = updatedGeoJsonData.features.map(
        (feature) => {
          const countryData = data.find(
            (item) => item.country === feature.properties.name
          );
          feature.properties.deaths = countryData ? countryData.deaths : 0;
          return feature;
        }
      );
      setGeoJsonData(updatedGeoJsonData);
    }
  }, [data]);

  return (
    <div className="flex justify-center">
      <div className="w-9/12">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={(feature) => countryStyle(feature, maxDeaths)}
            />
          )}
          <Legend maxDeaths={maxDeaths} />
        </MapContainer>
      </div>
    </div>
  );
};

export default ChoroplethGlobalMapDeaths;
