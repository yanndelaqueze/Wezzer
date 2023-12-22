import s from "./style.module.css";
import { useState, useEffect, useRef } from "react";

import { Map } from "./components/Map/Map";
import { CityList } from "./components/CityList/CityList";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { SuggestionList } from "./components/SuggestionList/SuggestionList";

import { GeocoderAPI } from "./api/geocoder";
import { ArrowClockwise } from "react-bootstrap-icons";

import CITIES from "./business/cities";

export function App() {
  const [userPosition, setUserPosition] = useState();
  const [userPositionInfo, setUserPositionInfo] = useState();
  const [placeList, setPlaceList] = useState(CITIES);
  const [clearInput, setClearInput] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestionsRef = useRef(null);

  // Hide Suggestions when clicked outside
  function handleClickOutside(event) {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target)
    ) {
      setShowSuggestions(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
    setPlaceList((prevPlaceList) => [cityToAdd, ...prevPlaceList]);
  }

  // AUTOCOMPLETE
  async function getSuggestions(input) {
    const suggestions = await GeocoderAPI.geocodeWithInput(input);
    if (suggestions && suggestions.length > 0) {
      setInput(input);
      setSuggestions(suggestions);
      setShowSuggestions(true);
    }
  }

  // ADD A CITY FROM SEARCH
  function addCityFromSearch(cityToAddFromSearch) {
    console.log(cityToAddFromSearch);
    const cityToAdd = {
      name: cityToAddFromSearch.text,
      lat: cityToAddFromSearch.geometry.coordinates[1],
      lng: cityToAddFromSearch.geometry.coordinates[0],
    };
    setPlaceList((prevPlaceList) => [cityToAdd, ...prevPlaceList]);
    setShowSuggestions(false);
    setInput("");
  }

  useEffect(() => {
    if (userPosition) {
      getUserPositionInfo();
    }
  }, [userPosition]);

  console.log(input);
  console.log(suggestions);

  return (
    <>
      <div className={s.main_container}>
        <div className={s.header}>
          <div className="row">
            <div className="col-4">LOGO</div>
            <div className="col-md-12 col-lg-4">
              <SearchBar onInput={getSuggestions} clearInput={clearInput} />
              <div ref={suggestionsRef}>
                {showSuggestions && input.length > 1 && (
                  <SuggestionList
                    suggestionList={suggestions}
                    onClickItem={addCityFromSearch}
                  />
                )}
              </div>
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
      </div>
    </>
  );
}
