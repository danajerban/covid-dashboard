import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat/dist/leaflet-heat.js";

const HeatmapLayer = ({ points, gradient }) => {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (heatRef.current) {
      map.removeLayer(heatRef.current);
    }

    heatRef.current = L.heatLayer(points, {
      radius: 20,
      blur: 15,
      max: 1.0,
      minOpacity: 0.6,
      gradient,
    }).addTo(map);

    function updateHeatLayer() {
      const zoomLevel = map.getZoom();
      const newRadius = Math.max(10, 30 - zoomLevel * 2);
      const newBlur = Math.max(5, 15 - zoomLevel);
      heatRef.current.setOptions({ radius: newRadius, blur: newBlur });
    }

    map.on('zoomend', updateHeatLayer);

    return () => {
      map.off('zoomend', updateHeatLayer);
      map.removeLayer(heatRef.current);
    };
  }, [map, points, gradient]);

  return null;
};

const GlobalHeatMapCases = () => {
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

  const heatData = data.map((item) => [
    item.latitude,
    item.longitude,
    item.confirmed,
  ]);

  const gradient = {
    0.0: "lightblue",
    0.25: "#0000FF",
    0.5: "blue",
    1.0: "darkblue"
  };

  return (
    <div style={{ margin: "0 auto" }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "80vh", width: "80%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {heatData.length > 0 && (
          <HeatmapLayer points={heatData} gradient={gradient} />
        )}
      </MapContainer>
    </div>
  );
};

export default GlobalHeatMapCases;
