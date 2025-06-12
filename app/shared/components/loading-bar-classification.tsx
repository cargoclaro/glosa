'use client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  duration?: number; // default 15000ms
}

const LoadingBarClassification: React.FC<Props> = ({ duration = 15000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 50;
    const total = duration / interval;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      const linear = current / total;
      const eased = Math.pow(linear, 0.8) * 100;
      setProgress(Math.min(eased, 99));
    }, interval);
    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" /> Clasificando documentos...
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LoadingBarClassification; 