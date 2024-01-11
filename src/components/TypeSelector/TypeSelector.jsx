import s from "./style.module.css";
import { CloudSun, Thermometer } from "react-bootstrap-icons";

export function TypeSelector({
  selectedType,
  onClickTemperature,
  onClickWeather,
}) {
  return (
    <div>
      {selectedType === "weather" && (
        <div className={s.container}>
          <CloudSun
            className={s.weather_selected}
            onClick={() => {
              onClickWeather();
            }}
          />
          <Thermometer
            className={s.temperature}
            onClick={() => {
              onClickTemperature();
            }}
          />
        </div>
      )}
      {selectedType === "temperature" && (
        <div className={s.container}>
          <CloudSun
            className={s.weather}
            onClick={() => {
              onClickWeather();
            }}
          />
          <Thermometer
            className={s.temperature_selected}
            onClick={() => {
              onClickTemperature();
            }}
          />
        </div>
      )}
    </div>
  );
}
