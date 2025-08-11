import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError('Failed to register');
    }
  };

  return (
    <div className='container-wrapper'>
    
     <div className="auth-container">
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          value={form.password_confirmation}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: 10 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
    </div>
  );
}
