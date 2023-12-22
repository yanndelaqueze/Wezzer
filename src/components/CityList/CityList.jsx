import s from "./style.module.css";
import { CityListItem } from "../CityListItem/CityListItem";
import { ArrowClockwise } from "react-bootstrap-icons";

export function CityList({ placeList, userPositionInfo }) {
  return (
    <>
      <div className={s.list_title}>YOUR CITIES</div>
      <div className={s.list}>
        <span className={s.city_item}>
          {!userPositionInfo && (
            <div className={s.position_loading}>
              <ArrowClockwise />
              Loading
            </div>
          )}
          {userPositionInfo && <CityListItem city={userPositionInfo} />}
        </span>
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
