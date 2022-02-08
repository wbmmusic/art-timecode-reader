import React, { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState({ time: "01:23:45:57", rate: 30 });

  useEffect(() => {
    window.electron.receive("time", theTime => setTime(theTime));

    return () => {
      window.electron.removeListener("time");
    };
  }, []);

  return (
    <div className="clockBox">
      <div className="clockDigits">{time.time}</div>
      <div className="frameRate">{time.rate}fps</div>
    </div>
  );
}
