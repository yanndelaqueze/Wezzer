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
      {selectedCity && (
        <div className={s.list_title}>
          Weather Forecast (5 days) - {selectedCity.name} :
        </div>
      )}

      <div className={s.list}>
        {/* DISPLAY FORECAST LIST ITEMS */}
        {forecastList &&
          forecastList.map((fcst, i) => {
            return (
              <span className={s.forecast_item}>
                {fcst && <ForecastListItem key={fcst + i} fcst={fcst} />}
              </span>
            );
          })}
      </div>
    </div>
  );
}
