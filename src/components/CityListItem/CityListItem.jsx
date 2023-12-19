import s from "./style.module.css";

export function CityListItem() {
  return (
    <div>
      <div className={s.container}>
        <div>City</div>
        <div>Weather</div>
      </div>
    </div>
  );
}
