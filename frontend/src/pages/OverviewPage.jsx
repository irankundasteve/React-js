import { useEffect, useState } from 'react';
import { api } from '../api/client';
import PhoneScreen from '../components/PhoneScreen';

export default function OverviewPage() {
  const [onboarding, setOnboarding] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    Promise.all([api('/onboarding'), api('/notifications')]).then(([ob, nf]) => {
      setOnboarding(ob);
      setNotifications(nf);
    });
  }, []);

  return (
    <div className="grid">
      {onboarding.map((item) => (
        <PhoneScreen key={item.id} title={item.title} subtitle={item.subtitle} accent>
          <button className="primary">Next</button>
        </PhoneScreen>
      ))}
      <PhoneScreen title="Sign In" subtitle="Email + password">
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />
        <button className="primary">Sign in</button>
      </PhoneScreen>
      <PhoneScreen title="Sign Up" subtitle="Create account">
        <input placeholder="Name" />
        <input placeholder="Email" />
        <input placeholder="Phone" />
        <button className="primary">Sign up</button>
      </PhoneScreen>
      <PhoneScreen title="Forgot Password" subtitle="Reset with OTP">
        <input placeholder="Email" />
        <button className="primary">Send code</button>
      </PhoneScreen>
      <PhoneScreen title="Notifications" subtitle="Alerts & promos">
        {notifications.map((n) => (
          <div key={n.id} className="list-item">
            <strong>{n.title}</strong>
            <p>{n.body}</p>
          </div>
        ))}
      </PhoneScreen>
    </div>
  );
}
