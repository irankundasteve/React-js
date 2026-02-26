import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import OverviewPage from './pages/OverviewPage';
import ShopPage from './pages/ShopPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <main>
        <h1>Food Delivery Superflow (Mockup Implementation)</h1>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  );
}
