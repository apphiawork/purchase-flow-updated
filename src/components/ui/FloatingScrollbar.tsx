import { useEffect, useRef } from 'react';

const MIN_THUMB = 40;
const EDGE = 16; // px from the right edge where hovering reveals the bar
const HIDE_AFTER = 900; // ms after the last scroll

/**
 * Page scrollbar that floats over the content (like macOS / Vercel), so the layout never changes width
 * when a page becomes scrollable. The browser's own page scrollbar is hidden in flow.css; scrolling itself
 * (wheel, trackpad, keyboard, touch) is still native — this only draws the thumb and lets you drag it.
 */
export default function FloatingScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current, thumb = thumbRef.current;
    if (!track || !thumb) return;
    const root = document.documentElement;
    let hideTimer = 0, dragging = false, hovering = false, frame = 0;

    const metrics = () => {
      const view = window.innerHeight, content = root.scrollHeight;
      const thumbH = Math.max(MIN_THUMB, (view / content) * view);
      return { view, content, thumbH, maxScroll: content - view, maxTop: view - thumbH };
    };
    const render = () => {
      frame = 0;
      const m = metrics();
      track.hidden = m.maxScroll <= 1;
      if (track.hidden) return;
      thumb.style.height = `${m.thumbH}px`;
      thumb.style.transform = `translateY(${(window.scrollY / m.maxScroll) * m.maxTop}px)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const show = () => {
      track.classList.add('on');
      window.clearTimeout(hideTimer);
      if (!dragging && !hovering) hideTimer = window.setTimeout(() => track.classList.remove('on'), HIDE_AFTER);
    };

    const onScroll = () => { schedule(); show(); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const near = e.clientX >= window.innerWidth - EDGE;
      if (near !== hovering) { hovering = near; show(); }
    };
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      dragging = true;
      thumb.setPointerCapture(e.pointerId);
      const startY = e.clientY, startScroll = window.scrollY, m = metrics();
      const move = (ev: PointerEvent) => window.scrollTo(0, startScroll + ((ev.clientY - startY) * m.maxScroll) / m.maxTop);
      const up = () => {
        dragging = false;
        thumb.removeEventListener('pointermove', move);
        thumb.removeEventListener('pointerup', up);
        thumb.removeEventListener('pointercancel', up);
        show();
      };
      thumb.addEventListener('pointermove', move);
      thumb.addEventListener('pointerup', up);
      thumb.addEventListener('pointercancel', up);
    };

    // Content height changes (screen switches, the calendar growing the page) need a re-measure.
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pointermove', onMove, { passive: true });
    thumb.addEventListener('pointerdown', onDown);
    render();
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pointermove', onMove);
      thumb.removeEventListener('pointerdown', onDown);
      window.clearTimeout(hideTimer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="f-scroll" ref={trackRef} aria-hidden="true" hidden>
      <div className="f-scroll-thumb" ref={thumbRef} />
    </div>
  );
}
