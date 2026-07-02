import { usePurchaseStore } from './store/usePurchaseStore';
import Screen1Quote from './components/screens/Screen1Quote';
import ScreenLoading from './components/screens/ScreenLoading';
import Screen2Plan from './components/screens/Screen2Plan';
import Screen3Addons from './components/screens/Screen3Addons';
import Screen4Travellers from './components/screens/Screen4Travellers';
import Screen5Review from './components/screens/Screen5Review';
import Screen6Confirm from './components/screens/Screen6Confirm';
import Dialog from './components/ui/Dialog';
import Toast from './components/ui/Toast';

export default function App() {
  const { currentScreen, loading } = usePurchaseStore();

  let screen: React.ReactNode;
  if (loading) screen = <ScreenLoading />;
  else if (currentScreen === 1) screen = <Screen1Quote />;
  else if (currentScreen === 2) screen = <Screen2Plan />;
  else if (currentScreen === 3) screen = <Screen3Addons />;
  else if (currentScreen === 4) screen = <Screen4Travellers />;
  else if (currentScreen === 5) screen = <Screen5Review />;
  else if (currentScreen === 6) screen = <Screen6Confirm />;
  else screen = <Screen1Quote />;

  return (
    <>
      {screen}
      <Dialog />
      <Toast />
    </>
  );
}
