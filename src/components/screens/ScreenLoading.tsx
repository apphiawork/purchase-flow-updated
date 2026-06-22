import TopNav from '../layout/TopNav';
import Footer from '../layout/Footer';

export default function ScreenLoading() {
  return (
    <div className="screen active">
      <TopNav stepNum={1} />
      <div className="loading-body">
        <div className="spinner-round" />
        <div className="loading-text">Hang tight! Finding the best plan for your trip…</div>
      </div>
      <Footer />
    </div>
  );
}
