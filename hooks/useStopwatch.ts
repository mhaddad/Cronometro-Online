import { useState, useRef, useCallback } from 'react';

export const useStopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // FIX: Initialize useRef with an initial value of undefined and update type to handle number or undefined.
  const requestRef = useRef<number | undefined>();
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);

  const animate = useCallback(() => {
    const now = performance.now();
    setTime(elapsedTimeRef.current + (now - startTimeRef.current));
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(animate);
  }, [isRunning, animate]);

  const pause = useCallback(() => {
    if (!isRunning || !requestRef.current) return;
    cancelAnimationFrame(requestRef.current);
    requestRef.current = undefined;
    elapsedTimeRef.current = time;
    setIsRunning(false);
  }, [isRunning, time]);

  const reset = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
    setIsRunning(false);
    setTime(0);
    elapsedTimeRef.current = 0;
    startTimeRef.current = 0;
  }, []);

  return { time, isRunning, start, pause, reset };
};
