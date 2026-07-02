import { useEffect, useState } from 'react';

/** True when the viewport is ≤ maxWidth (default 640px). Tracks live via matchMedia. */
export function useIsMobile(maxWidth = 640): boolean {
  const query = `(max-width:${maxWidth}px)`;
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMobile(mq.matches);
    setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return mobile;
}
