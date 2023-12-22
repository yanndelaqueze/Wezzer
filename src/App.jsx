import s from "./style.module.css";
import { useState, useEffect } from "react";

import { Map } from "./components/Map/Map";
import { CityList } from "./components/CityList/CityList";
import { SearchBar } from "./components/SearchBar/SearchBar";

import { GeocoderAPI } from "./api/geocoder";
import { ArrowClockwise } from "react-bootstrap-icons";

import CITIES from "./business/cities";

export function App() {
  const [userPosition, setUserPosition] = useState();
  const [userPositionInfo, setUserPositionInfo] = useState();
  const [placeList, setPlaceList] = useState(CITIES);

  // GET USER POSITION
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
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
    const details = await GeocoderAPI.geocodeWithCoords(
      userPosition.lat,
      userPosition.lng
    );
    setUserPositionInfo({
      name: details.data.features[0]?.text,
      lat: userPosition.lat,
      lng: userPosition.lng,
    });
  }

  // DELETE A CITY
  function deleteCity(cityNameToRemove) {
    const update = placeList.filter((city) => city.name !== cityNameToRemove);
    setPlaceList(update);
  }

  // ADD A CITY

  function addCity(cityToAdd) {
    setPlaceList((prevPlaceList) => [...prevPlaceList, cityToAdd]);
  }

  useEffect(() => {
    if (userPosition) {
      getUserPositionInfo();
    }
  }, [userPosition]);

  console.log(userPositionInfo);
  console.log("placeList", placeList);

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
          <CityList
            placeList={placeList}
            userPositionInfo={userPositionInfo}
            onClickTrash={deleteCity}
          />
        </div>
        <div className={s.map}>
          {!userPosition && (
            <div className={s.map_loading}>
              <ArrowClockwise />
              Map Loading
            </div>
          )}
          {userPosition && (
            <Map
              userPosition={userPosition}
              placeList={placeList}
              pinCity={addCity}
            />
          )}
        </div>
        <div className={s.weather_list}>Weather List here</div>
      </div>
    </>
  );
}
