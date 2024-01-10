import s from "./style.module.css";
import { useState, useEffect, useRef } from "react";

import { Map } from "./components/Map/Map";
import { CityList } from "./components/CityList/CityList";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { SuggestionList } from "./components/SuggestionList/SuggestionList";
import { ForecastList } from "./components/ForecastList/ForecastList";
import { Logo } from "./components/Logo/Logo";

import { GeocoderAPI } from "./api/geocoder";
import { ArrowClockwise } from "react-bootstrap-icons";

import logo from "./assets/images/logo.png";

export function App() {
  const [userPosition, setUserPosition] = useState();
  const [userPositionInfo, setUserPositionInfo] = useState();
  const [placeList, setPlaceList] = useState([]);
  const [clearInput, setClearInput] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState(userPositionInfo);
  const [selectedTimeStamp, setSelectedTimeStamp] = useState();

  const suggestionsRef = useRef(null);

  // Retrieve placeList from Local Storage
  useEffect(() => {
    const storedPlaceList = localStorage.getItem("placeList");
    if (storedPlaceList) {
      setPlaceList(JSON.parse(storedPlaceList));
    }
  }, []);

  // Save placeList in Local Storage when it changes
  useEffect(() => {
    localStorage.setItem("placeList", JSON.stringify(placeList));
  }, [placeList]);

  // const checkLocalStorage = () => {
  //   const storedPlaceList = localStorage.getItem("placeList");

  //   if (storedPlaceList) {
  //     const parsedPlaceList = JSON.parse(storedPlaceList);
  //     console.log("Data found in localStorage:", parsedPlaceList);
  //   } else {
  //     console.log("No data found in localStorage");
  //   }
  // };
  // checkLocalStorage();

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
    const updatedList = placeList.filter(
      (city) => city.name !== cityNameToRemove
    );
    setPlaceList(updatedList);
    setSelectedCity(userPositionInfo);
  }

  // ADD A CITY
  function addCity(cityToAdd) {
    setPlaceList((prevPlaceList) => [cityToAdd, ...prevPlaceList]);
    setSelectedCity(cityToAdd);
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
    setClearInput(true);
  }

  // CHANGE SELECTED CITY BY CLICKING ON MAP
  function onClickMarker(city) {
    console.log("Clicked marker for city:", city);
    setSelectedCity(city);
  }

  useEffect(() => {
    if (userPosition) {
      getUserPositionInfo();
    }
  }, [userPosition]);

  useEffect(() => {
    if (userPositionInfo) {
      setSelectedCity(userPositionInfo);
    }
  }, [userPositionInfo, placeList]);

  console.log("timeStamp:", selectedTimeStamp);

  return (
    <>
      <div className={s.main_container}>
        <div className={s.header}>
          <div className="row">
            <div className="col-4">
              <Logo title="Wezzer" subtitle="Sunny or not ?" image={logo} />
            </div>
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
            selectedCity={selectedCity}
            placeList={placeList}
            userPositionInfo={userPositionInfo}
            onClickTrash={deleteCity}
            onClickCity={(city) => {
              setSelectedCity(city);
            }}
          />
        </div>
        <div className={s.forecast_list}>
          <ForecastList
            selectedCity={selectedCity}
            selectedTimeStamp={selectedTimeStamp}
            onClickTime={(time) => {
              setSelectedTimeStamp(time);
            }}
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
              selectedCity={selectedCity}
              selectedTimeStamp={selectedTimeStamp}
              onClickMarker={onClickMarker}
            />
          )}
        </div>
      </div>
    </>
  );
}
