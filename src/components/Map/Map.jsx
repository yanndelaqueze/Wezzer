import "./map.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useRef, useEffect } from "react";
import { OpenWeatherAPI } from "../../api/openweather";
import { GeocoderAPI } from "../../api/geocoder";
import { OPENWEATHER_ICONS_URL } from "../../config";
import pin from "../../assets/images/pin_blue.png";
import { Date } from "../../components/Date/Date";

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
  const markers = useRef({});
  const marker = useRef(null);
  const popup = useRef(null);
  const currentPopup = useRef(null);

  const [lng, setLng] = useState(userPosition.lng);
  const [lat, setLat] = useState(userPosition.lat);
  const [zoom, setZoom] = useState(9);

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

  // FUNCTION - FIT MARKERS IN MAP *****
  async function fitMarkersToBounds() {
    const bounds = new mapboxgl.LngLatBounds();
    // Extend the bounds to include all marker coordinates
    for (const city of placeList) {
      bounds.extend([city.lng, city.lat]);
    }
    // Fit the map to the calculated bounds
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }

  // ***** INITIALIZE MAP INITIALIZED ***** //
  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [lng, lat],
        zoom: zoom,
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

      const weather = await getWeatherForecast(lat, lng);
      let icon = "";
      if (selectedTimeStamp) {
        icon = `${OPENWEATHER_ICONS_URL}${
          weather.list.find((fcst) => fcst.dt === selectedTimeStamp).weather[0]
            .icon
        }.png`;
      } else {
        icon = `${OPENWEATHER_ICONS_URL}${weather.list[0].weather[0].icon}.png`;
      }
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
      const place_name_arr = city.place_name.split(",");

      // Create a Popup to display Latitude and Longitude
      popup.current = new mapboxgl.Popup({
        offset: 25,
        className: "popup",
      })
        .setLngLat([lng, lat])
        .setHTML(
          `
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
        )
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

  useEffect(() => {
    // Update markers when selectedCity or placeList change
    if (map.current && selectedCity) {
      const isPlaceListChange = placeList.some(
        (city) => city.name === selectedCity.name
      );
      if (!isPlaceListChange) {
        updateMarkers().then(() => {
          fitMarkersToBounds();
        });
      } else {
        updateMarkers().then(() => {
          fitMarkersToBounds();
        });
      }
    }
  }, [placeList, selectedCity, selectedTimeStamp]);

  // ***** CREATE / UPDATE MARKERS FROM PLACELIST ***** //
  async function updateMarkers() {
    // Remove all existing markers
    for (const markerName in markers.current) {
      markers.current[markerName].remove();
    }
    markers.current = {};

    // (re)Create all  markers
    const placeList_extended = [...placeList, userPositionInfo];

    for (const city of placeList_extended) {
      if (!markers.current[city.name]) {
        try {
          // Get weather information for the city
          const weather = await getWeatherForecast(city.lat, city.lng);
          // const icon = `${OPENWEATHER_ICONS_URL}${weather.list[0].weather[0].icon}.png`;
          let icon = "";
          if (selectedTimeStamp) {
            icon = `${OPENWEATHER_ICONS_URL}${
              weather.list.find((fcst) => fcst.dt === selectedTimeStamp)
                .weather[0].icon
            }.png`;
          } else {
            icon = `${OPENWEATHER_ICONS_URL}${weather.list[0].weather[0].icon}.png`;
          }

          // Check if Selected
          let selectedClass = "";
          selectedCity && selectedCity.name === city.name
            ? (selectedClass = "city_marker_name_selected")
            : (selectedClass = "city_marker_name");

          // Create a DOM element for the custom marker with weather icon
          const cityMarker = document.createElement("div");
          cityMarker.className = "city_marker";
          cityMarker.style.backgroundImage = `url(${icon})`;

          // Add City Name to cityMarker
          const text = document.createElement("div");
          text.className = selectedClass;
          text.textContent = `${city.name}`;
          cityMarker.appendChild(text);

          const newMarker = new mapboxgl.Marker(cityMarker)
            .setLngLat([city.lng, city.lat])
            .addTo(map.current);
          markers.current[city.name] = newMarker;

          //**  Event listener for marker click to open popup and select City **//
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

  return (
    <div>
      {userPosition && (
        <div ref={mapContainer} className="map_container">
          <div className="date">
            <Date selectedTimeStamp={selectedTimeStamp} />
          </div>
        </div>
      )}
    </div>
  );
}
