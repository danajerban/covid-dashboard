import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geojsonData from "../countries.geo.json";

//sources: https://leafletjs.com/examples/choropleth/ && https://github.com/johan/world.geo.json for GeoJSON data
// and Chat gpt for legend of the table and the math for the color intensity

const getColor = (d, maxDeaths) => {
  const intensity = Math.log(d + 1) / Math.log(maxDeaths + 1);
  return intensity > 0.9
    ? "#800026"
    : intensity > 0.8
    ? "#BD0026"
    : intensity > 0.7
    ? "#E31A1C"
    : intensity > 0.6
    ? "#FC4E2A"
    : intensity > 0.5
    ? "#FD8D3C"
    : intensity > 0.4
    ? "#FEB24C"
    : intensity > 0.3
    ? "#FED976"
    : intensity > 0.2
    ? "#FFEDA0"
    : intensity > 0.1
    ? "#green"
    : "yellow";
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
      ? "#800026"
      : d > maxDeaths * 0.8
      ? "#BD0026"
      : d > maxDeaths * 0.7
      ? "#E31A1C"
      : d > maxDeaths * 0.6
      ? "#FC4E2A"
      : d > maxDeaths * 0.5
      ? "#FD8D3C"
      : d > maxDeaths * 0.4
      ? "#FEB24C"
      : d > maxDeaths * 0.3
      ? "#FED976"
      : d > maxDeaths * 0.2
      ? "#FFEDA0"
      : d > maxDeaths * 0.1
      ? "green"
      : "yellow";
  }

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
      let labels = [];

      for (let i = 0; i < grades.length; i++) {
        const from = Math.round(grades[i] * maxDeaths);
        const to = grades[i + 1]
          ? Math.round(grades[i + 1] * maxDeaths)
          : maxDeaths;
        labels.push(
          '<div style="background-color:' +
            getColor(from + 1) +
            '; width: 24px; height: 24px; float: left; opacity: 0.7;"></div> ' +
            from +
            (to ? "&ndash;" + to + "<br>" : "+")
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
          feature.properties.deaths = countryData
            ? countryData.deaths
            : 0;
          return feature;
        }
      );
      setGeoJsonData(updatedGeoJsonData);
    }
  }, [data]);

  return (
    <div style={{ margin: "0 auto" }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "80vh", width: "80%" }}
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
  );
};

export default ChoroplethGlobalMapDeaths;
