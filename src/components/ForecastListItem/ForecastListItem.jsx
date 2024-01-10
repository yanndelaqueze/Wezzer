import s from "./style.module.css";
import { OPENWEATHER_ICONS_URL } from "../../config";

export function ForecastListItem({ fcst }) {
  // FORMATTING DATE
  const date = new Date(fcst.dt * 1000);
  const options = { month: "short", day: "numeric" };
  date.setHours(date.getHours() + 1);
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const finalDateFormat = `${formattedDate} - ${formattedTime}`;

  // GET LOGO
  const logo = `${OPENWEATHER_ICONS_URL}${fcst.weather[0].icon}.png`;

  return (
    <>
      <div className={s.container}>
        <div>{finalDateFormat}</div>
        <div>{fcst.weather[0].main}</div>
        <div>({fcst.weather[0].description})</div>
        <div>({Math.round(fcst.main.temp)}°C)</div>
        <img src={logo} alt="" />
      </div>
    </>
  );
}
