import "./map.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useRef, useEffect } from "react";
import { OpenWeatherAPI } from "../../api/openweather";
import { GeocoderAPI } from "../../api/geocoder";
import { OPENWEATHER_ICONS_URL } from "../../config";
import pin from "../../assets/images/pin_blue.png";
import { DateMap } from "../DateMap/DateMap";
import { TypeSelector } from "../TypeSelector/TypeSelector";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY_PARAM;

export function Map({
  userPosition,
  userPositionInfo,
  placeList,
  pinCity,
  selectedCity,
  selectedTimeStamp,
  onClickMarker,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);
  const currentPopup = useRef(null);
  const markers = useRef([]);

  const [selectedType, setSelectedType] = useState("weather");

  // FUNCTION - GET WEATHER *****
  async function getWeatherForecast(latitude, longitude) {
    const res = await OpenWeatherAPI.getWeather(latitude, longitude);
    return res.data || "N/A";
  }

  // FUNCTION - GET PLACE INFO *****
  async function getCityInfo(latitude, longitude) {
    const res = await GeocoderAPI.geocodeWithCoords(latitude, longitude);
    return res.data.features[0];
  }

  // FUNCTION - FIT MARKERS IN MAP (NOT USED) *****
  async function fitMarkersToBounds() {
    const placeList_extended = userPositionInfo
      ? [...placeList, userPositionInfo]
      : placeList;

    const bounds = new mapboxgl.LngLatBounds();
    // Extend the bounds to include all marker coordinates
    for (const city of placeList_extended) {
      bounds.extend([city.lng, city.lat]);
    }
    // Fit the map to the calculated bounds
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 150,
        maxZoom: 14,
      });
    }
  }

  // FUNCTION - CENTER MAP ON SELECTED CITY
  function centerMapOnSelectedCity() {
    if (selectedCity) {
      map.current.flyTo({
        center: [selectedCity.lng, selectedCity.lat],
        zoom: 5,
        essential: true,
      });
    }
  }

  // ***** INITIALIZE MAP INITIALIZED ***** //
  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
      });
    }

    return () => {
      // Cleanup map on unmount
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // ***** CREATE A MARKER WITH INFO ON CLICK ***** //
  useEffect(() => {
    map.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      const city = await getCityInfo(lat, lng);

      // Remove previous marker & popup if they exist
      if (marker.current) {
        marker.current.remove();
      }
      if (popup.current) {
        popup.current.remove();
      }

      // Create a DOM element for the custom marker with weather icon
      const cityMarker = document.createElement("div");
      cityMarker.className = "pin_marker";
      const img = document.createElement("img");
      img.src = pin;
      cityMarker.appendChild(img);

      // Create a new marker at the clicked location
      marker.current = new mapboxgl.Marker(cityMarker)
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Break Down place_name (city / region / country)
      const place_name_arr = city?.place_name.split(",");

      // Create a Popup to display Latitude and Longitude
      let html = "";

      html = city
        ? `
      <div class="popup_content">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-pin" viewBox="0 0 16 16" onClick="clickPin()">
          <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zm1.58 1.408-.002-.001.002.001m-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a4.922 4.922 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a4.915 4.915 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.775 1.775 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14c.06.1.133.191.214.271a1.78 1.78 0 0 0 .37.282"/>
          </svg>
        </div>
        <div class="info">
          <p class="city">${place_name_arr[0]}</p>
          <p class="region_country">${place_name_arr[1]}, ${place_name_arr[2]}</p>
        </div>
      </div>
      `
        : `
        <div class="popup_content">
          <div class="info">
            <p class="city">Unknown location !</p>
          </div>
        </div>
        `;

      popup.current = new mapboxgl.Popup({
        offset: 25,
        className: "popup",
      })
        .setLngLat([lng, lat])
        .setHTML(html)
        .addTo(map.current);

      window.clickPin = function () {
        // prop function named pinCity
        pinCity({ name: city?.text, lat: lat, lng: lng });
        // Close the current popup (if any)
        if (popup.current) {
          popup.current.remove();
          popup.current = null;
        }
      };

      // Remove Popup AND Marker when click on close button
      popup.current.on("close", () => {
        if (marker.current) {
          marker.current.remove();
          marker.current = null;
        }
      });
    });
  }, [selectedTimeStamp]);

  // ***** CREATE / UPDATE MARKERS FROM PLACELIST ***** //
  async function updateMarkers() {
    // Remove all existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // (re)Create all  markers
    const placeList_extended = userPositionInfo
      ? [...placeList, userPositionInfo]
      : placeList;

    for (const city of placeList_extended) {
      if (!markers.current[city.name]) {
        try {
          // Get weather information for the city
          const weather = await getWeatherForecast(city.lat, city.lng);

          // Get the right weather icon
          const weatherIcon = selectedTimeStamp
            ? `${OPENWEATHER_ICONS_URL}${
                weather.list.find((fcst) => fcst.dt === selectedTimeStamp)
                  .weather[0].icon
              }.png`
            : `${OPENWEATHER_ICONS_URL}${weather.list[0].weather[0].icon}.png`;

          // Get the right temperature

          const temperature = selectedTimeStamp
            ? `${Math.round(
                weather.list.find((fcst) => fcst.dt === selectedTimeStamp).main
                  .temp
              )}°C`
            : `${Math.round(weather.list[0].main.temp)}°C`;

          // Check if Selected
          const selectedClass =
            selectedCity && selectedCity.name === city.name
              ? "city_marker_label_selected"
              : "city_marker_label";

          // Create a DOM element for the custom marker
          const cityMarker = document.createElement("div");

          // Customize marker with weather Icon or Temperature, depending on SelectedType
          if (selectedType === "weather") {
            cityMarker.className = "city_marker_weather";
            cityMarker.style.backgroundImage = `url(${weatherIcon})`;
          } else if (selectedType === "temperature") {
            cityMarker.className = "city_marker_temperature";
            cityMarker.textContent = temperature;
          }

          // Add City Name Label to cityMarker
          const text = document.createElement("div");
          text.className = selectedClass;
          text.textContent = `${city.name}`;
          cityMarker.appendChild(text);

          // Create the marker and add it to map
          const newMarker = new mapboxgl.Marker(cityMarker)
            .setLngLat([city.lng, city.lat])
            .addTo(map.current);
          markers.current.push(newMarker);

          // Add  Event listener for marker click to open popup and select City //
          newMarker.getElement().addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentPopup.current) {
              currentPopup.current.remove();
            }
            onClickMarker(city);
          });
        } catch (error) {
          console.error("Error creating marker:", error);
        }
      }
    }
  }

  useEffect(() => {
    // Update markers when selectedCity or placeList change
    if (map.current && selectedCity) {
      const isPlaceListChange = placeList.some(
        (city) => city.name === selectedCity.name
      );
      if (!isPlaceListChange) {
        updateMarkers().then(() => {
          centerMapOnSelectedCity();
        });
      } else {
        updateMarkers().then(() => {
          centerMapOnSelectedCity();
        });
      }
    }
  }, [placeList, selectedCity, selectedTimeStamp, selectedType]);

  return (
    <div className="map">
      {userPosition && <div ref={mapContainer} className="map_container"></div>}
      <div className="date">
        <DateMap selectedTimeStamp={selectedTimeStamp} />
        <TypeSelector
          selectedType={selectedType}
          onClickWeather={() => {
            setSelectedType("weather");
          }}
          onClickTemperature={() => {
            setSelectedType("temperature");
          }}
        />
      </div>
    </div>
  );
}
