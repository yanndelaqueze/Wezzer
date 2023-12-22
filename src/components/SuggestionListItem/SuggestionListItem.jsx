import s from "./style.module.css";

export function SuggestionListItem({ suggestion, onClick }) {
  return (
    <>
      <div className={s.suggestion_item} onClick={() => onClick(suggestion)}>
        <div className={s.name}>{suggestion.place_name}</div>
      </div>
    </>
  );
}
