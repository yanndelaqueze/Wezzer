import s from "./style.module.css";
import { useState, useEffect } from "react";

import { Map } from "./components/Map/Map";
import { CityList } from "./components/CityList/CityList";
import { SearchBar } from "./components/SearchBar/SearchBar";

import { GeocoderAPI } from "./api/geocoder";
import { ArrowClockwise, Search } from "react-bootstrap-icons";

export function App() {
  const [userPosition, setUserPosition] = useState();
  const [placeList, setPlaceList] = useState([]);

  // GET USER POSITION
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // GET USER POSITION DETAILS
  async function getUserPositionInfo() {
    const details = await GeocoderAPI.geocodeWithCoords(userPosition);
    console.log("user Position:", userPosition);
    // console.log("details:", details.data.features[0]?.place_name);
    // console.log("details:", details.data.features[0]?.text);
  }

  useEffect(() => {
    if (userPosition) {
      getUserPositionInfo();
    }
  });

  return (
    <>
      <div className={s.main_container}>
        <div className={s.header}>
          <div className="row">
            <div className="col-4">LOGO</div>
            <div className="col-md-12 col-lg-4">
              <SearchBar />
            </div>
          </div>
        </div>
        <div className={s.city_list}>
          <CityList />
        </div>
        <div className={s.map}>
          {!userPosition && (
            <div className={s.map_loading}>
              <ArrowClockwise />
              Map Loading
            </div>
          )}
          {userPosition && <Map userPosition={userPosition} />}
        </div>
        <div className={s.weather_list}>Weather List here</div>
      </div>
    </>
  );
}
