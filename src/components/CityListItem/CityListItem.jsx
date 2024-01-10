import s from "./style.module.css";
import { Trash } from "react-bootstrap-icons";

export function CityListItem({
  city,
  onClickTrash,
  selectedCity,
  onClickCity,
}) {
  const handleTrashClick = (e, cityName) => {
    e.stopPropagation(); // Prevent event propagation to parent div
    onClickTrash(cityName);
  };

  return (
    <div>
      {city === selectedCity && (
        <div className={s.container_selected} onClick={() => onClickCity(city)}>
          <div>{city.name}</div>
          <Trash onClick={(e) => handleTrashClick(e, city.name)} />
        </div>
      )}
      {city !== selectedCity && (
        <div className={s.container} onClick={() => onClickCity(city)}>
          <div>{city.name}</div>
          <Trash onClick={(e) => handleTrashClick(e, city.name)} />
        </div>
      )}
    </div>
  );
}
