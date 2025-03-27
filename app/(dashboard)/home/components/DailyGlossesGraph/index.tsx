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
        count: 0
      });
    }
    
    // Count glosses for each day
    glosses.forEach(gloss => {
      const glossDate = new Date(gloss.createdAt);
      const formattedGlossDate = formatDate(glossDate);
      
      const dayData = last7Days.find(day => day.date === formattedGlossDate);
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
  const maxCount = Math.max(...dailyData.map(d => d.count), 1);
  
  return (
    <GenericCard customClass="h-full min-h-[305px] flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <ArrowTrendingUp size="size-5" />
        <h2 className="font-semibold text-xl">Glosas Diarias</h2>
      </div>
      <div className="border-t border-gray-300 my-2" />
      
      <div className="flex flex-col flex-grow justify-end">
        <div className="flex h-[200px] items-end gap-2 justify-between pr-2">
          {dailyData.map((day, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-end h-full"
            >
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium mb-1">{day.count}</span>
                <div 
                  className="w-[30px] bg-primary rounded-t-md transition-all duration-500"
                  style={{ 
                    height: `${(day.count / maxCount) * 150}px`,
                    backgroundColor: day.count === 0 ? '#e5e7eb' : undefined
                  }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex flex-col items-center">
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