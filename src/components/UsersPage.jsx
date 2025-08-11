import React, { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const startEdit = user => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '' });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', password: '' });
    setError(null);
  };

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, form);
      } else {
        await createUser(form);
      }
      cancelEdit();
      loadUsers();
    } catch {
      setError('Failed to save user');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch {
      setError('Failed to delete user');
    }
  };

  return (
    <div className='container-wrapper'>

      <div className="container">
      <h2>Users</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: 10 }}
          />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginRight: 10 }}
          />
        <input
          name="password"
          placeholder={editingUser ? 'Leave blank to keep password' : 'Password'}
          type="password"
          value={form.password}
          onChange={handleChange}
          {...(!editingUser && { required: true })}
          style={{ marginRight: 10 }}
          />
        <button type="submit">{editingUser ? 'Update' : 'Create'}</button>
        {editingUser && <button onClick={cancelEdit} type="button" style={{ marginLeft: 10 }}>Cancel</button>}
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No users found.</td></tr>
            )}
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button onClick={() => startEdit(u)}>Edit</button>
                  <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 10 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
      </div>
  );
}
