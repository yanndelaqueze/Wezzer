import s from "./style.module.css";
import { Trash } from "react-bootstrap-icons";
import { GeocoderAPI } from "../../api/geocoder";
import { useState, useEffect } from "react";

export function CityListItem({
  city,
  onClickTrash,
  selectedCity,
  onClickCity,
  user_position,
}) {
  const [cityInfo, setCityInfo] = useState();

  const handleTrashClick = (e, cityName) => {
    e.stopPropagation(); // Prevent event propagation to parent div
    onClickTrash(cityName);
  };

  // FUNCTION - GET PLACE INFO *****
  async function getCityInfo(latitude, longitude) {
    const res = await GeocoderAPI.geocodeWithCoords(latitude, longitude);
    return res.data.features[0];
  }

  useEffect(() => {
    if (city && city.lat && city.lng) {
      getCityInfo(city.lat, city.lng).then((info) => {
        setCityInfo(info);
      });
    }
  }, [city]);

  // BREAKDOWN CITY INFO
  const cityInfoArr = cityInfo && cityInfo.place_name.split(",");

  // get Container Class
  const containerClass =
    city === selectedCity ? s.container_selected : s.container;

  return (
    <div>
      {cityInfo && (
        <div className={containerClass} onClick={() => onClickCity(city)}>
          <div className={s.city_name}>{city.name}</div>
          <div className={s.region_country}>
            <div>{cityInfoArr[1]}</div>
            <div>{cityInfoArr[2]}</div>
          </div>
          {user_position === "no" && (
            <Trash
              className={s.trash}
              onClick={(e) => handleTrashClick(e, city.name)}
            />
          )}
        </div>
      )}
    </div>
  );
}
