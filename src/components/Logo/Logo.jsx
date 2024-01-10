import s from "./style.module.css";

export function Logo({ image, title, subtitle }) {
  return (
    <div>
      <div className={s.container}>
        <img className={s.img} src={image} alt="" />
        <div className={s.title_subtitle}>
          <div className={s.title}>{title}</div>
          <div className={s.subtitle}>{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
