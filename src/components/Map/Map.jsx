import s from "./style.module.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useRef, useEffect } from "react";
import { OpenWeatherAPI } from "../../api/openweather";
import { GeocoderAPI } from "../../api/geocoder";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY_PARAM;

export function Map({ userPosition }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);

  const [lng, setLng] = useState(userPosition.lon);
  const [lat, setLat] = useState(userPosition.lat);
  const [zoom, setZoom] = useState(9);

  async function getWeather(latitude, longitude) {
    const res = await OpenWeatherAPI.getCurrentWeather(latitude, longitude);
    return res.data.list[0].weather[0].main;
  }

  async function getCity(latitude, longitude) {
    const res = await GeocoderAPI.geocodeWithCoords(latitude, longitude);
    return res.data.features[0]?.text;
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    // Create a marker on click
    map.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      const weather = await getWeather(lat, lng);
      console.log("weather:", weather);

      const city = await getCity(lat, lng);
      console.log("city:", city);

      // Remove previous marker & popup if exist
      if (marker.current) {
        marker.current.remove();
      }
      if (popup.current) {
        popup.current.remove();
      }

      // Create a new marker at the clicked location
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Create a Popup to display Latitude and Longitude

      popup.current = new mapboxgl.Popup({
        offset: 25,
        className: `${s.popup}`,
      })
        .setLngLat([lng, lat])
        .setHTML(
          `<div>
            <p>${city}</p>
            <p>${weather}</p>
          </div>`
        )
        .addTo(map.current);

      // Console.log Latitude and Longitude
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
