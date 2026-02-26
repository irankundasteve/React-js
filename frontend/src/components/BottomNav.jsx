import { NavLink } from 'react-router-dom';

const tabs = [
  ['/', 'Overview'],
  ['/shop', 'Shop'],
  ['/orders', 'Orders'],
  ['/profile', 'Profile']
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(([to, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
