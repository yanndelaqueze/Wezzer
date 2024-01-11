import s from "./style.module.css";

export function DateMap({ selectedTimeStamp }) {
  // FUNCTION - FORMATTING DATE
  const date = new Date();
  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: "long", month: "short", day: "numeric" };
    date.setHours(date.getHours() + 1);
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} - ${formattedTime}`;
  }

  return (
    <div>
      {selectedTimeStamp && (
        <div className={s.date}>{formatDate(selectedTimeStamp)}</div>
      )}
    </div>
  );
}
