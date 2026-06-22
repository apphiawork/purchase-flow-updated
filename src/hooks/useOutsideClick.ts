import { useEffect, useRef } from 'react';

/** Calls `onOutside` when a mousedown/click lands outside the returned ref's element.
 *  Replaces the raw global document click handlers for closing dropdowns/popovers. */
export function useOutsideClick<T extends HTMLElement>(active: boolean, onOutside: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [active, onOutside]);
  return ref;
}
