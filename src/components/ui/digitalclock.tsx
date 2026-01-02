import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-NG", {
    timeZone: "Africa/Lagos",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex items-center gap-2" title="Current Nigerian Time">
      <Clock className="h-4 w-4" />
      <span className="font-mono min-w-[90px]">{formattedTime}</span>
    </div>
  );
};

export default DigitalClock;