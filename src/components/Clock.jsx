import React, { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState({ time: "00:00:00:00", rate: 30, from: "" });

  useEffect(() => {
    window.electron.receive("time", theTime => setTime(theTime));

    return () => {
      window.electron.removeListener("time");
    };
  }, []);

  const makeTime = () => {
    if (time.rate !== 29.97) return time.time;
    else {
      const tAr = time.time.split(":");
      return `${tAr[0]}:${tAr[1]}:${tAr[2]};${tAr[3]}`;
    }
  };

  return (
    <div className="clockBox">
      <div className="clockDigits">{makeTime()}</div>
      <div className="frameRate">{time.rate}fps</div>
      <div className="from">{time.from}</div>
    </div>
  );
}
