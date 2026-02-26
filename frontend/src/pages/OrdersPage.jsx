import { useEffect, useState } from 'react';
import { api } from '../api/client';
import PhoneScreen from '../components/PhoneScreen';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [chat, setChat] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    Promise.all([api('/orders'), api('/chat')]).then(([o, c]) => {
      setOrders(o);
      setChat(c);
    });
  }, []);

  const send = async () => {
    if (!text.trim()) return;
    const msg = await api('/chat', { method: 'POST', body: JSON.stringify({ text }) });
    setChat((prev) => [...prev, msg]);
    setText('');
  };

  return (
    <div className="grid">
      <PhoneScreen title="My Orders" subtitle="Active + past">
        {orders.map((o) => (
          <div key={o.id} className="list-item">
            <strong>{o.id} — {o.status}</strong>
            <p>Total ${o.total.toFixed(2)} • ETA {o.eta}</p>
          </div>
        ))}
      </PhoneScreen>
      <PhoneScreen title="Track Order" subtitle="Map + rider status">
        <div className="map">Map placeholder</div>
        <button className="primary">Call Rider</button>
      </PhoneScreen>
      <PhoneScreen title="Chat Support" subtitle="Help center">
        {chat.map((m) => <div key={m.id} className="list-item"><strong>{m.from}</strong><p>{m.text}</p></div>)}
        <div className="row"><input placeholder="Type message" value={text} onChange={(e) => setText(e.target.value)} /><button onClick={send}>Send</button></div>
      </PhoneScreen>
      <PhoneScreen title="Rate Order" subtitle="Driver / restaurant">
        <p>⭐⭐⭐⭐☆</p>
        <textarea rows="3" placeholder="Write your review" />
        <button className="primary">Submit</button>
      </PhoneScreen>
    </div>
  );
}
