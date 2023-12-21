import s from "./style.module.css";

export function CityListItem({ city }) {
  console.log("city:", city);
  return (
    <div>
      <div className={s.container}>
        <div>{city.name}</div>
        <div>Weather</div>
      </div>
    </div>
  );
}
