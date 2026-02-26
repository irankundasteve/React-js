import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import PhoneScreen from '../components/PhoneScreen';

export default function ShopPage() {
  const [home, setHome] = useState({ categories: [], featured: [], popular: [] });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([api('/home'), api('/products'), api('/cart')]).then(([h, p, c]) => {
      setHome(h);
      setProducts(p);
      setCart(c);
    });
  }, []);

  const filtered = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [products, search]);

  const add = async (id) => {
    setCart(await api('/cart', { method: 'POST', body: JSON.stringify({ productId: id, qty: 1 }) }));
  };

  return (
    <div className="grid">
      <PhoneScreen title="Food Menu" subtitle="Home / categories">
        <input placeholder="Search food" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="chips">{home.categories.map((c) => <span key={c}>{c}</span>)}</div>
        {filtered.slice(0, 4).map((p) => (
          <div className="list-item row" key={p.id}><span>{p.image} {p.name}</span><button onClick={() => add(p.id)}>Add</button></div>
        ))}
      </PhoneScreen>
      <PhoneScreen title="Popular" subtitle="Restaurant list">
        {home.popular.map((p) => (
          <div key={p.id} className="list-item">
            <strong>{p.name}</strong>
            <p>{p.desc}</p>
          </div>
        ))}
      </PhoneScreen>
      <PhoneScreen title="Product Detail" subtitle="Ingredients / rating">
        {home.featured.map((p) => <div key={p.id} className="list-item row"><span>{p.image} {p.name}</span><span>${p.price}</span></div>)}
        <button className="primary">Customize</button>
      </PhoneScreen>
      <PhoneScreen title="Cart" subtitle="Checkout preview">
        {cart.items.map((i) => (
          <div className="list-item row" key={i.productId}><span>{i.product.image} {i.product.name} x{i.qty}</span><span>${(i.qty * i.product.price).toFixed(2)}</span></div>
        ))}
        <h3>Total: ${cart.total.toFixed(2)}</h3>
      </PhoneScreen>
    </div>
  );
}
