'use client';

import { GenericCard } from '@/shared/components';
import { ArrowTrendingUp } from '@/shared/icons';
import { useEffect, useState } from 'react';
import type { CustomGlossTable } from '~/db/schema';

interface GlossData {
  date: string;
  count: number;
}

interface DailyGlossesGraphProps {
  glosses: CustomGlossTable[];
}

const DailyGlossesGraph = ({ glosses }: DailyGlossesGraphProps) => {
  const [dailyData, setDailyData] = useState<GlossData[]>([]);

  useEffect(() => {
    // Process glosses to get daily counts for the last 7 days
    const today = new Date();
    const last7Days: GlossData[] = [];

    // Create the last 7 days with zero counts initially
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = formatDate(date);
      last7Days.push({
        date: formattedDate,
        count: 0,
      });
    }

    // Count glosses for each day
    glosses.forEach((gloss) => {
      const glossDate = new Date(gloss.createdAt);
      const formattedGlossDate = formatDate(glossDate);

      const dayData = last7Days.find((day) => day.date === formattedGlossDate);
      if (dayData) {
        dayData.count += 1;
      }
    });

    setDailyData(last7Days);
  }, [glosses]);

  // Format date as DD/MM
  const formatDate = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  // Format short day name (Mon, Tue, etc)
  const formatDay = (dateStr: string): string => {
    const parts = dateStr.split('/').map(Number);
    const day = parts[0] || 1; // Default to 1 if undefined
    const month = parts[1] || 0; // Default to January if undefined

    const date = new Date();
    date.setDate(day);
    date.setMonth(month - 1);
    return date.toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 3);
  };

  // Find the maximum count for scaling
  const maxCount = Math.max(...dailyData.map((d) => d.count), 1);

  return (
    <GenericCard customClass="h-full min-h-[305px] flex flex-col">
      <div className="mb-2 flex items-center gap-2">
        <ArrowTrendingUp size="size-5" />
        <h2 className="font-semibold text-xl">Glosas Diarias</h2>
      </div>
      <div className="my-2 border-gray-300 border-t" />

      <div className="flex flex-grow flex-col justify-end">
        <div className="flex h-[200px] items-end justify-between gap-2 pr-2">
          {dailyData.map((day, index) => (
            <div
              key={index}
              className="flex h-full flex-col items-center justify-end"
            >
              <div className="flex flex-col items-center">
                <span className="mb-1 font-medium text-xs">{day.count}</span>
                <div
                  className="w-[30px] rounded-t-md bg-primary transition-all duration-500"
                  style={{
                    height: `${(day.count / maxCount) * 150}px`,
                    backgroundColor: day.count === 0 ? '#e5e7eb' : undefined,
                  }}
                ></div>
              </div>
              <div className="mt-2 flex flex-col items-center text-gray-500 text-xs">
                <span>{formatDay(day.date)}</span>
                <span>{day.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GenericCard>
  );
};

export default DailyGlossesGraph;
