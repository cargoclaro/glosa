"use client";

import { useState, useEffect } from "react";

interface LoadingBarProps {
  duration?: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ duration = 200 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 1000;
    const step = 100 / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

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
