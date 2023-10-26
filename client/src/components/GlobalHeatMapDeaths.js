import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat/dist/leaflet-heat.js";

// sources: https://www.patrick-wied.at/static/heatmapjs/plugin-leaflet-layer.html and https://github.com/Leaflet/Leaflet.heat


const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatRef = useRef(null);
  useEffect(() => {
    if (heatRef.current) {
      map.removeLayer(heatRef.current);
    }

    const gradient = {
      0.0: "green",
      0.5: "orange",
      1.0: "red",
    };

    const maxDeaths = Math.max(...points.map((point) => point[2]));

    heatRef.current = L.heatLayer(points, {
      radius: 20,
      blur: 10,
      max: maxDeaths, // Set max value based on the points data
      minOpacity: 0.6,
      gradient,
    }).addTo(map);
    console.log({ maxDeaths });
    function updateHeatLayer() {
      const zoomLevel = map.getZoom();
      const newRadius = Math.max(10, 30 - zoomLevel);
      const newBlur = Math.max(5, 20 - zoomLevel);
      heatRef.current.setOptions({ radius: newRadius, blur: newBlur });
    }

    map.on("zoomend", updateHeatLayer);

    return () => {
      map.off("zoomend", updateHeatLayer);
      map.removeLayer(heatRef.current);
    };
  }, [map, points]); // suggested practice

  return null;
};

const GlobalHeatMapDeaths = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_LOCAL_URL}/total-cases`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);
  // this is a relative map, so after mapping the data from the back-end
  // the process is simple, just map the data to the heatmap
  // and when zooming in/out, the heatmap will change the radius and blur for a better user experience
  // remember this is a RELATIVE traditional heatmap - showing the intensity of deaths worldwide - not a choropleth map that is based on the countries
  const heatData = data.map((item) => [
    item.latitude,
    item.longitude,
    item.deaths,
  ]);

  return (
    <div className="flex justify-center">
      <div className="w-9/12">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {heatData.length > 0 && <HeatmapLayer points={heatData} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default GlobalHeatMapDeaths;
