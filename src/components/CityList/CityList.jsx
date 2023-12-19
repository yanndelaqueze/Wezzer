import s from "./style.module.css";
import { CityListItem } from "../CityListItem/CityListItem";

export function CityList() {
  return (
    <>
      <div className={s.list_title}>YOUR CITIES</div>
      <div className={s.list}>
        <span className={s.city_item}>
          <CityListItem />
        </span>
        <span className={s.city_item}>
          <CityListItem />
        </span>
        <span className={s.city_item}>
          <CityListItem />
        </span>
        <span className={s.city_item}>
          <CityListItem />
        </span>
        <span className={s.city_item}>
          <CityListItem />
        </span>
        <span className={s.city_item}>
          <CityListItem />
        </span>
        <span className={s.city_item}>
          <CityListItem />
        </span>
        <span className={s.city_item}>
          <CityListItem />
        </span>
        <span className={s.city_item}>
          <CityListItem />
        </span>
        <span className={s.city_item}>
          <CityListItem />
        </span>
      </div>
    </>
  );
}
