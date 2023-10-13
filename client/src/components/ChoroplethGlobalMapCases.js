import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geojsonData from "../countries.geo.json";

// sources: https://leafletjs.com/examples/choropleth/ && https://github.com/johan/world.geo.json for GeoJSON data
// and Chat GPT for the legend of the table and the math behind the color intensities
// basically the intensity varies from 0 - 1.0 and the color is based on the intensity

const getColor = (d, maxConfirmed) => {
  const intensity = Math.log(d + 1) / Math.log(maxConfirmed + 1);
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

const countryStyle = (feature, maxConfirmed) => {
  return {
    fillColor: getColor(feature.properties.confirmed, maxConfirmed),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
};
const Legend = ({ maxConfirmed }) => {
  const map = useMap();

  function getColor(d) {
    return d > maxConfirmed * 0.9
      ? "#8b0000"
      : d > maxConfirmed * 0.8
      ? "#b22222"
      : d > maxConfirmed * 0.7
      ? "#dc143c"
      : d > maxConfirmed * 0.6
      ? "#ff4500"
      : d > maxConfirmed * 0.5
      ? "#ff6347"
      : d > maxConfirmed * 0.4
      ? "#ff7f50"
      : d > maxConfirmed * 0.3
      ? "#ffa07a"
      : d > maxConfirmed * 0.2
      ? "#ffb6c1"
      : d > maxConfirmed * 0.1
      ? "#ffc0cb"
      : "#ffd1dc";
  }

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      let labels = [];
      // create the div for the legend with the colors and the labels formatted to the closest 250000
      for (let i = 0; i < grades.length; i++) {
        const from = grades[i] * 250000;
        const to = grades[i + 1] ? grades[i + 1] * 250000 : null;
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
  }, [map, maxConfirmed]);

  return null;
};
const ChoroplethGlobalMapCases = () => {
  const [data, setData] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [maxConfirmed, setMaxConfirmed] = useState(0);

// basically what is happening here is: get the total confirmed cases data for each country from the latest date
// (remember how the backend is set up - sorting by date in descending order and then getting the first element)
// from the back-end and then use the geojson data to map the data to the countries (check countries.geo.json file)
// and then use the color intensities to color the countries based on the number of cases

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_LOCAL_URL}/total-cases`
        );
        setData(response.data);
        const maxConfirmedValue = response.data.reduce(
          (max, item) => Math.max(max, item.confirmed),
          0
        );
        setMaxConfirmed(maxConfirmedValue);
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
          feature.properties.confirmed = countryData
            ? countryData.confirmed
            : 0;
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
              style={(feature) => countryStyle(feature, maxConfirmed)}
            />
          )}
          <Legend maxConfirmed={maxConfirmed} />
        </MapContainer>
      </div>
    </div>
  );
};

export default ChoroplethGlobalMapCases;
