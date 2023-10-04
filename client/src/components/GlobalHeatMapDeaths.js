import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat/dist/leaflet-heat.js";

//sources: https://leafletjs.com/examples/choropleth/ && https://www.patrick-wied.at/static/heatmapjs/plugin-leaflet-layer.html
// and Chat gpt for legend of the table and the math for the color intensity

const HeatmapLayer = ({ points, maxDeaths }) => {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (heatRef.current) {
      map.removeLayer(heatRef.current);
    }

    const gradient = {
      0.0: "#00793c",
      0.4: "#f8c903",
      0.6: "#f60000",
      1.0: "#f60000", // most intense color 0.6 and above
    };

    heatRef.current = L.heatLayer(points, {
      radius: 30,
      blur: 25,
      max: 1.0,
      minOpacity: 0.6,
      gradient,
    }).addTo(map);

    return () => {
      map.removeLayer(heatRef.current);
    };
  }, [map, points]);

  return null;
};

const Legend = ({ maxDeaths }) => {
  const map = useMap();

  function getColor(d) {
    return d > maxDeaths * 0.6
      ? "#f60000"
      : d > maxDeaths * 0.4
      ? "#f8c903"
      : "#00793c";
  }

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 0.4, 0.6, 1];
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

const GlobalHeatMapDeaths = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/total-cases");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const maxDeaths = data.reduce((max, item) => Math.max(max, item.deaths), 0);

  const heatData = data.map((item) => [
    item.latitude,
    item.longitude,
    item.deaths / maxDeaths,
  ]);

  return (
    <div style={{ margin: "0 auto" }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "80vh", width: "80%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {heatData.length > 0 && (
          <HeatmapLayer points={heatData} maxDeaths={maxDeaths} />
        )}
        <Legend maxDeaths={maxDeaths} />
      </MapContainer>
    </div>
  );
};

export default GlobalHeatMapDeaths;
