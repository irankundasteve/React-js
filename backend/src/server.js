import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const db = {
  user: {
    id: 'u1',
    name: 'Alex Doe',
    email: 'alex@example.com',
    phone: '+1 999 333 111',
    avatar: 'https://i.pravatar.cc/100?img=12',
    loyaltyPoints: 1250
  },
  onboarding: [
    { id: 1, title: 'Delicious Food', subtitle: 'Fresh meals delivered quickly' },
    { id: 2, title: 'Fast Shipping', subtitle: 'Track your rider in real-time' },
    { id: 3, title: 'Certified Chefs', subtitle: 'Best quality restaurants only' },
    { id: 4, title: 'Payment Online', subtitle: 'Secure wallet and card support' }
  ],
  categories: ['Burger', 'Pizza', 'Pasta', 'Sushi', 'Dessert'],
  products: [
    { id: 'p1', name: 'Cheese Burger', category: 'Burger', price: 8.5, rating: 4.7, image: '🍔', desc: 'Juicy beef burger with cheddar and pickles.' },
    { id: 'p2', name: 'Pepperoni Pizza', category: 'Pizza', price: 14.2, rating: 4.5, image: '🍕', desc: 'Stone baked pepperoni pizza.' },
    { id: 'p3', name: 'Creamy Pasta', category: 'Pasta', price: 11.0, rating: 4.4, image: '🍝', desc: 'Alfredo sauce with mushroom.' },
    { id: 'p4', name: 'Salmon Sushi', category: 'Sushi', price: 15.0, rating: 4.8, image: '🍣', desc: 'Fresh salmon nigiri and maki.' },
    { id: 'p5', name: 'Chocolate Cake', category: 'Dessert', price: 6.0, rating: 4.6, image: '🍰', desc: 'Rich dark chocolate cake slice.' }
  ],
  addresses: [{ id: 'a1', label: 'Home', details: '21 Brookline St, NY' }],
  paymentMethods: [{ id: 'pm1', type: 'Card', title: 'Visa **** 4242' }, { id: 'pm2', type: 'Wallet', title: 'Apple Pay' }],
  cart: [{ productId: 'p1', qty: 1 }],
  orders: [
    { id: 'o1001', status: 'Preparing', eta: '20 min', items: [{ productId: 'p2', qty: 1 }], total: 14.2 },
    { id: 'o1002', status: 'Delivered', eta: '-', items: [{ productId: 'p1', qty: 2 }], total: 17 }
  ],
  notifications: [
    { id: 'n1', title: 'Order accepted', body: 'Restaurant started preparing your meal.' },
    { id: 'n2', title: '50% Promo', body: 'Use code FOOD50 for selected dishes.' }
  ],
  chats: [
    { id: 'c1', from: 'Support', text: 'Hi! Need help with your order?' }
  ],
  reviews: []
};

const enrichCart = () => db.cart.map((entry) => ({ ...entry, product: db.products.find((p) => p.id === entry.productId) }));
const cartTotal = () => enrichCart().reduce((sum, item) => sum + item.qty * item.product.price, 0);

app.get('/health', (_, res) => res.json({ ok: true }));
app.get('/api/onboarding', (_, res) => res.json(db.onboarding));
app.post('/api/auth/login', (req, res) => res.json({ token: 'demo-token', user: db.user, ...req.body }));
app.post('/api/auth/signup', (req, res) => res.status(201).json({ user: { ...db.user, ...req.body } }));
app.post('/api/auth/forgot-password', (_, res) => res.json({ message: 'OTP sent to your email/phone' }));
app.get('/api/home', (_, res) => res.json({ categories: db.categories, featured: db.products.slice(0, 3), popular: db.products }));
app.get('/api/products', (req, res) => {
  const q = (req.query.search || '').toString().toLowerCase();
  const category = req.query.category?.toString();
  const list = db.products.filter((p) => (!q || p.name.toLowerCase().includes(q)) && (!category || p.category === category));
  res.json(list);
});
app.get('/api/products/:id', (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ ...product, ingredients: ['Cheese', 'Tomato', 'Lettuce'], nutrition: '450 kcal' });
});

app.get('/api/cart', (_, res) => res.json({ items: enrichCart(), total: cartTotal() }));
app.post('/api/cart', (req, res) => {
  const { productId, qty = 1 } = req.body;
  const existing = db.cart.find((c) => c.productId === productId);
  if (existing) existing.qty += qty;
  else db.cart.push({ productId, qty });
  res.status(201).json({ items: enrichCart(), total: cartTotal() });
});
app.patch('/api/cart/:productId', (req, res) => {
  const item = db.cart.find((c) => c.productId === req.params.productId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.qty = Math.max(1, Number(req.body.qty || 1));
  res.json({ items: enrichCart(), total: cartTotal() });
});
app.delete('/api/cart/:productId', (req, res) => {
  db.cart = db.cart.filter((c) => c.productId !== req.params.productId);
  res.json({ items: enrichCart(), total: cartTotal() });
});

app.get('/api/orders', (_, res) => res.json(db.orders));
app.post('/api/orders/checkout', (req, res) => {
  const order = {
    id: `o${Date.now()}`,
    status: 'Preparing',
    eta: '25 min',
    items: db.cart,
    total: cartTotal(),
    ...req.body
  };
  db.orders.unshift(order);
  db.cart = [];
  res.status(201).json(order);
});
app.post('/api/orders/:id/review', (req, res) => {
  db.reviews.push({ orderId: req.params.id, ...req.body });
  res.status(201).json({ ok: true });
});

app.get('/api/profile', (_, res) => res.json(db.user));
app.patch('/api/profile', (req, res) => {
  db.user = { ...db.user, ...req.body };
  res.json(db.user);
});
app.get('/api/addresses', (_, res) => res.json(db.addresses));
app.post('/api/addresses', (req, res) => {
  const next = { id: `a${Date.now()}`, ...req.body };
  db.addresses.push(next);
  res.status(201).json(next);
});
app.get('/api/payment-methods', (_, res) => res.json(db.paymentMethods));
app.post('/api/payment-methods', (req, res) => {
  const next = { id: `pm${Date.now()}`, ...req.body };
  db.paymentMethods.push(next);
  res.status(201).json(next);
});
app.get('/api/notifications', (_, res) => res.json(db.notifications));
app.get('/api/chat', (_, res) => res.json(db.chats));
app.post('/api/chat', (req, res) => {
  const msg = { id: `m${Date.now()}`, from: 'You', text: req.body.text };
  db.chats.push(msg);
  res.status(201).json(msg);
});

app.use((_, res) => res.status(404).json({ message: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

export default app;
