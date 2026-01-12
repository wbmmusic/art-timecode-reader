import React, { useEffect, useState } from "react";
import type { TimeData } from "../types";

export default function Clock() {
  const [time, setTime] = useState<TimeData>({
    time: "00:00:00:00",
    rate: 30,
    from: "",
  });

  useEffect(() => {
    window.electron.receive("time", (theTime: TimeData) => setTime(theTime));

    return () => {
      window.electron.removeListener("time");
    };
  }, []);

  const makeTime = (): string => {
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
