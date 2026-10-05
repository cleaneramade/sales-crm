import { useCallback, useEffect, useRef } from "react";

const FALLBACK_MS = 600;

export function useHandoff() {
  const pending = useRef<(() => void) | null>(null);
  const timer = useRef<number | null>(null);
  const frame = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    timer.current = null;
    frame.current = null;
  }, []);

  const flush = useCallback(() => {
    clear();
    const action = pending.current;
    pending.current = null;
    if (!action) return false;
    action();
    return true;
  }, [clear]);

  useEffect(() => clear, [clear]);

  const run = useCallback(
    (close: () => void, action: () => void) => {
      clear();
      pending.current = action;
      close();
      timer.current = window.setTimeout(() => {
        timer.current = null;
        frame.current = window.requestAnimationFrame(() => {
          frame.current = null;
          flush();
        });
      }, FALLBACK_MS);
    },
    [clear, flush],
  );

  const onCloseAutoFocus = useCallback(
    (event: Event) => {
      if (flush()) event.preventDefault();
    },
    [flush],
  );

  return { run, onCloseAutoFocus };
}
