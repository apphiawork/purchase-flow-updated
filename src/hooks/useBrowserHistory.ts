import { useEffect, useRef } from 'react';
import { usePurchaseStore } from '../store/usePurchaseStore';

/**
 * Lets the browser's Back and Forward buttons move between screens. Each screen the customer reaches
 * gets a history entry; the loading interstitial (0) never does. Forward is limited to screens already
 * reached in this quote, and leaving the confirmation page starts a fresh quote.
 */
export function useBrowserHistory() {
  const currentScreen = usePurchaseStore((s) => s.currentScreen);
  const fromPop = useRef(false);
  const furthest = useRef(1);

  useEffect(() => {
    window.history.replaceState({ screen: 1 }, '');
    const onPop = (e: PopStateEvent) => {
      const target = typeof e.state?.screen === 'number' ? e.state.screen : 1;
      const s = usePurchaseStore.getState();
      fromPop.current = true;
      if (s.currentScreen === 6 || target > furthest.current) {
        // A paid policy can't be reopened for editing; out-of-range Forward also starts over.
        furthest.current = 1;
        s.resetFlow();
        window.history.replaceState({ screen: 1 }, '');
        return;
      }
      usePurchaseStore.setState({ currentScreen: target, loading: false, dialog: { ...s.dialog, open: false } });
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (currentScreen === 0) return;
    if (fromPop.current) { fromPop.current = false; return; }
    if (window.history.state?.screen === currentScreen) return;
    furthest.current = Math.max(furthest.current, currentScreen);
    window.history.pushState({ screen: currentScreen }, '');
  }, [currentScreen]);
}
