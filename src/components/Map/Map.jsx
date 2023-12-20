import s from "./style.module.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useRef, useEffect } from "react";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY_PARAM;

export function Map({ userPosition }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [lng, setLng] = useState(userPosition.lon);
  const [lat, setLat] = useState(userPosition.lat);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      // Remove previous marker if exists
      if (marker.current) {
        marker.current.remove();
      }

      // Create a new marker at the clicked location
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Display Latitude and Longitude
      console.log(`Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`);
    });

    // Cleanup function
    return () => {
      map.current.remove(); // Remove map instance on unmount
    };
  }, [lat, lng, zoom]);

  return (
    <div>
      {userPosition && <div ref={mapContainer} className={s.map_container} />}
    </div>
  );
}
