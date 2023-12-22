import s from "./style.module.css";
import { Trash } from "react-bootstrap-icons";

export function CityListItem({ city, onClick }) {
  return (
    <div>
      <div className={s.container}>
        <div>{city.name}</div>
        <Trash onClick={() => onClick(city.name)} />
      </div>
    </div>
  );
}
