import s from "./style.module.css";
import { ForecastListItem } from "../ForecastListItem/ForecastListItem";

export function ForecastList({ selectedCity }) {
  return (
    <div>
      <span>
        <ForecastListItem />
      </span>
    </div>
  );
}
