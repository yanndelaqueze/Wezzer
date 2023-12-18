import s from "./style.module.css";
import { useState, useEffect } from "react";

import { Map } from "./components/Map/Map";

export function App() {
  const [userPosition, setUserPosition] = useState([]);

  // GET USER POSITION
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  console.log("user Position:", userPosition);

  return (
    <>
      <div className={s.main_container}>
        <div className={s.header}>
          <div className="row">
            <div className="col-4">LOGO</div>
            <div className="col-md-12 col-lg-4">SearchBar here</div>
          </div>
        </div>
        <div className={s.city_list}>City List here</div>
        <div className={s.map}>
          <Map />
        </div>
        <div className={s.weather_list}>Weather List here</div>
      </div>
    </>
  );
}
