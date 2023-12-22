import s from "./style.module.css";
import { CityListItem } from "../CityListItem/CityListItem";
import { ArrowClockwise } from "react-bootstrap-icons";
import { Pin } from "react-bootstrap-icons";

export function CityList({ placeList, userPositionInfo, onClickTrash }) {
  return (
    <>
      <div className={s.list_title}>
        <Pin /> Pinned Cities ({placeList.length})
      </div>
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
              {city && (
                <CityListItem
                  key={city + i}
                  city={city}
                  onClick={onClickTrash}
                />
              )}
            </span>
          );
        })}
      </div>
    </>
  );
}
