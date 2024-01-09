import s from "./style.module.css";
import { Trash } from "react-bootstrap-icons";

export function CityListItem({
  city,
  onClickTrash,
  selectedCity,
  onClickCity,
}) {
  return (
    <div>
      {city === selectedCity && (
        <div className={s.container_selected} onClick={() => onClickCity(city)}>
          <div>{city.name}</div>
          <Trash onClick={() => onClickTrash(city.name)} />
        </div>
      )}
      {city !== selectedCity && (
        <div className={s.container} onClick={() => onClickCity(city)}>
          <div>{city.name}</div>
          <Trash onClick={() => onClickTrash(city.name)} />
        </div>
      )}
    </div>
  );
}
