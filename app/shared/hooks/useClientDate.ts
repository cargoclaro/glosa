import { useState } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import todayIs from '../utils/today-is';

const useClientDate = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setIsMounted(true);
    setCurrentDate(todayIs(new Date()));
  }, []);

  return { currentDate: isMounted ? currentDate : '', isMounted };
};

export default useClientDate; 