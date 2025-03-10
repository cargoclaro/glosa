"use client";

import { useState, useEffect } from "react";

interface LoadingBarProps {
  duration?: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ duration = 200 }) => {
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = 1000;

    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => {
        const newTime = prevTime + 1;
        if (newTime >= duration) {
          clearInterval(timer);
          return duration;
        }
        return newTime;
      });

      setProgress(easeOutExpo(timeElapsed / duration) * 100);
    }, interval);

    return () => clearInterval(timer);
  }, [duration, timeElapsed]);

  const easeOutExpo = (t: number) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  return (
    <div className="w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
      <div
        className="h-full bg-cargoClaroOrange transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LoadingBar;
