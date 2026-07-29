import { useEffect, useEffectEvent, useRef, useState } from 'react';

const DEFAULT_SMOOTHING = 10;

export interface UseSmoothedValueOptions {
  target: number;
  enabled: boolean;
  smoothing?: number;
}

/** Interpolates toward sparse updates so UI eases instead of jumping. */
export function useSmoothedValue(options: UseSmoothedValueOptions): number {
  const { target, enabled, smoothing = DEFAULT_SMOOTHING } = options;
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);

  const readTarget = useEffectEvent(() => target);

  useEffect(() => {
    if (!enabled) {
      const goal = readTarget();
      displayRef.current = goal;
      setDisplay(goal);
      return;
    }

    let frame = 0;
    let lastAt = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastAt) / 1000);
      lastAt = now;
      const current = displayRef.current;
      const goal = readTarget();
      const delta = goal - current;

      if (Math.abs(delta) < 0.05) {
        if (current !== goal) {
          displayRef.current = goal;
          setDisplay(goal);
        }
        frame = requestAnimationFrame(tick);
        return;
      }

      const next = current + delta * (1 - Math.exp(-smoothing * dt));
      displayRef.current = next;
      setDisplay(next);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, smoothing]);

  return enabled ? display : target;
}
