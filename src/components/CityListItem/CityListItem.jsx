import s from "./style.module.css";

export function CityListItem({ city }) {
  return (
    <div>
      <div className={s.container}>
        <div>{city.name}</div>
        <div>Weather</div>
      </div>
    </div>
  );
}
