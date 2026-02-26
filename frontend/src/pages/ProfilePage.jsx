import { useEffect, useState } from 'react';
import { api } from '../api/client';
import PhoneScreen from '../components/PhoneScreen';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    Promise.all([api('/profile'), api('/addresses'), api('/payment-methods')]).then(([p, a, pm]) => {
      setProfile(p);
      setAddresses(a);
      setPayments(pm);
    });
  }, []);

  if (!profile) return null;

  return (
    <div className="grid">
      <PhoneScreen title="My Profile" subtitle={profile.email}>
        <p><strong>{profile.name}</strong></p>
        <p>📱 {profile.phone}</p>
        <p>🏅 Points: {profile.loyaltyPoints}</p>
      </PhoneScreen>
      <PhoneScreen title="My Address" subtitle="Saved places">
        {addresses.map((a) => <div key={a.id} className="list-item"><strong>{a.label}</strong><p>{a.details}</p></div>)}
        <button className="primary">Add Address</button>
      </PhoneScreen>
      <PhoneScreen title="Payment Methods" subtitle="Cards + wallet">
        {payments.map((p) => <div key={p.id} className="list-item">{p.title}</div>)}
        <button className="primary">Add Payment</button>
      </PhoneScreen>
      <PhoneScreen title="Settings" subtitle="Security & preferences">
        <div className="list-item">Change password</div>
        <div className="list-item">Language</div>
        <div className="list-item">Push notifications</div>
        <button>Logout</button>
      </PhoneScreen>
    </div>
  );
}
