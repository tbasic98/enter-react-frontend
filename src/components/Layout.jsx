import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Layout() {
  const { logout } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <nav
        style={{
          backgroundColor: '#333',
          padding: '1rem',
          color: 'white',
          display: 'flex',
          gap: '1rem',
        }}
      >
        <Link to="/" style={{ color: 'white' }}>
          Rooms
        </Link>
        <Link to="/users" style={{ color: 'white' }}>
          Users
        </Link>
        <Link to="/events" style={{ color: 'white' }}>
          Events
        </Link>
        <button onClick={logout} style={{ marginLeft: 'auto', cursor: 'pointer' }}>
          Logout
        </button>
      </nav>
      <main style={{ flex: 1, overflow: 'auto', padding: '1rem', background: '#f0f2f5' }}>
        <Outlet />
      </main>
    </div>
  );
}
