import s from "./style.module.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useRef, useEffect } from "react";
import { OpenWeatherAPI } from "../../api/openweather";
import { GeocoderAPI } from "../../api/geocoder";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY_PARAM;

export function Map({ userPosition, placeList }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);
  const markers = useRef({});
  const currentPopup = useRef(null);

  const [lng, setLng] = useState(userPosition.lng);
  const [lat, setLat] = useState(userPosition.lat);
  const [zoom, setZoom] = useState(9);

  async function getWeather(latitude, longitude) {
    const res = await OpenWeatherAPI.getCurrentWeather(latitude, longitude);
    return res.data.list[0].weather[0].main || "N/A";
  }

  async function getCity(latitude, longitude) {
    const res = await GeocoderAPI.geocodeWithCoords(latitude, longitude);
    return res.data.features[0]?.text;
  }

  useEffect(() => {
    // ***** INITIALIZE MAP (only once) *****//
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    // ***** CREATE A MARKER WITH INFO ON CLICK ***** //
    map.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      const weather = await getWeather(lat, lng);
      const city = await getCity(lat, lng);

      // Remove previous marker & popup if they exist
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
          `
          <div>
            <p>${city}</p>
            <p>${weather}</p>
          </div>
          `
        )
        .addTo(map.current);

      // Remove Popup AND Marker when click on close button
      popup.current.on("close", () => {
        if (marker.current) {
          marker.current.remove();
          marker.current = null;
        }
      });
    });

    // ***** ADD MARKERS AND POPUPS FOR ALL CITIES IN PLACE LIST ***** //
    async function createMarkers() {
      for (const city of placeList) {
        const { name, lat, lng } = city;

        try {
          // Get weather information for the city
          const weather = await getWeather(lat, lng);

          // Create a marker for the city
          const newMarker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current);
          markers.current[name] = newMarker;

          // Create a Popup to display city information with weather
          const newPopup = new mapboxgl.Popup({
            offset: 25,
            className: `${s.popup}`,
          }).setHTML(`
          <div>
            <p>${name}</p>
            <p>${weather}</p>
          </div>
          `);

          // Attach the popup to the marker
          newMarker.setPopup(newPopup);

          // Event listener for marker click to open popup
          newMarker.getElement().addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent the click event from propagating to the map
            // Close the currently opened popup (if any)
            if (currentPopup.current) {
              currentPopup.current.remove();
            }

            // Open the popup for the clicked marker
            newPopup.addTo(map.current);
            currentPopup.current = newPopup;
          });
        } catch (error) {
          console.error("Error fetching weather:", error);
        }
      }

      // Calculate the bounds of all markers
      const bounds = new mapboxgl.LngLatBounds();
      Object.values(markers.current).forEach((marker) => {
        bounds.extend(marker.getLngLat());
      });

      // Fit the map to the bounds containing all markers
      map.current.fitBounds(bounds, {
        padding: 50, // Adjust the padding as needed to ensure all markers are visible
        maxZoom: 15, // You can set a maximum zoom level if necessary
      });
    }

    createMarkers();

    // Cleanup function
    return () => {
      Object.values(markers.current).forEach((marker) => marker.remove());
      markers.current = {};
      map.current.remove(); // Remove map instance on unmount
    };
  }, [lat, lng, zoom, placeList]);

  return (
    <div>
      {userPosition && <div ref={mapContainer} className={s.map_container} />}
    </div>
  );
}
