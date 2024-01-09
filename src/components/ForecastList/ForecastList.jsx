import s from "./style.module.css";
import { useEffect, useState } from "react";
import { ForecastListItem } from "../ForecastListItem/ForecastListItem";
import { OpenWeatherAPI } from "../../api/openweather";

export function ForecastList({ selectedCity }) {
  const [forecastList, setforecastList] = useState();

  async function getWeatherForecast(city) {
    const res = await OpenWeatherAPI.getWeather(city.lat, city.lng);
    setforecastList(res.data.list);
  }

  useEffect(() => {
    if (selectedCity) {
      getWeatherForecast(selectedCity);
    }
  }, [selectedCity]);

  console.log("fcst list :", forecastList);

  return (
    <div>
      <span>
        <ForecastListItem />
      </span>
    </div>
  );
}
