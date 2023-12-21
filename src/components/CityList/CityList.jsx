import s from "./style.module.css";
import { CityListItem } from "../CityListItem/CityListItem";

export function CityList({ placeList }) {
  console.log(placeList);
  return (
    <>
      <div className={s.list_title}>YOUR CITIES</div>
      <div className={s.list}>
        {placeList.map((city, i) => {
          return (
            <span className={s.city_item}>
              {city && <CityListItem key={city + i} city={city} />}
            </span>
          );
        })}
      </div>
    </>
  );
}
