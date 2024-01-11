import s from "./style.module.css";

export function Date({ selectedTimeStamp }) {
  // FORMATTING DATE
  // const date = new Date(parseInt(selectedTimeStamp * 1000));
  const date = selectedTimeStamp && new Date(selectedTimeStamp * 1000);
  // const options = { weekday: "long", month: "short", day: "numeric" };
  // date.setHours(date.getHours() + 1);
  // const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  // const formattedTime = date.toLocaleTimeString("en-US", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });

  console.log("date:", selectedTimeStamp, typeof selectedTimeStamp);

  return <div>{selectedTimeStamp}</div>;
}
