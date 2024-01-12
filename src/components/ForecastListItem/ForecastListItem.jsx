import s from "./style.module.css";
import { OPENWEATHER_ICONS_URL } from "../../config";

export function ForecastListItem({ fcst, onClickTime, selectedTimeStamp }) {
  // FORMATTING DATE
  const date = new Date(fcst.dt * 1000);
  const options = { weekday: "long", month: "short", day: "numeric" };
  date.setHours(date.getHours() + 1);
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // GET LOGO
  const logo = `${OPENWEATHER_ICONS_URL}${fcst.weather[0].icon}.png`;

  return (
    <>
      {fcst.dt === selectedTimeStamp && (
        <div
          className={s.container_selected}
          onClick={() => onClickTime(fcst.dt)}
        >
          <div className={s.date}>{formattedDate}</div>
          <div>{fcst.weather[0].description}</div>
          <div></div>
          <img className={s.logo} src={logo} alt="" />
          <div>{Math.round(fcst.main.temp)}°C</div>
          <div className={s.time}>{formattedTime}</div>
        </div>
      )}
      {fcst.dt !== selectedTimeStamp && (
        <div className={s.container} onClick={() => onClickTime(fcst.dt)}>
          <div className={s.date}>{formattedDate}</div>
          <div>{fcst.weather[0].description}</div>
          <div></div>
          <img className={s.logo} src={logo} alt="" />
          <div>{Math.round(fcst.main.temp)}°C</div>
          <div className={s.time}>{formattedTime}</div>
        </div>
      )}
    </>
  );
}
