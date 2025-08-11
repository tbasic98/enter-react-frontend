import axios from 'axios';

const API_BASE = 'https://enter-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the token for auth headers
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// AUTH
export function login(email, password) {
  return api.post('/login', { email, password });
}

export function register(data) {
  return api.post('/register', data);
}

// USERS
export function fetchUsers() {
  return api.get('/users');
}

export function fetchUser(id) {
  return api.get(`/users/${id}`);
}

export function createUser(data) {
  return api.post('/users', data);
}

export function updateUser(id, data) {
  return api.put(`/users/${id}`, data);
}

export function deleteUser(id) {
  return api.delete(`/users/${id}`);
}

// ROOMS
export function fetchRooms() {
  return api.get('/rooms');
}

export function fetchRoom(id) {
  return api.get(`/rooms/${id}`);
}

export function createRoom(data) {
  return api.post('/rooms', data);
}

export function updateRoom(id, data) {
  return api.put(`/rooms/${id}`, data);
}

export function deleteRoom(id) {
  return api.delete(`/rooms/${id}`);
}

// EVENTS
export function fetchEvents() {
  return api.get('/events');
}

export function fetchEvent(id) {
  return api.get(`/events/${id}`);
}

export function fetchRoomEvents(roomId) {
  return api.get(`/rooms/${roomId}/events`);
}

export function createEvent(data) {
  return api.post('/events', data);
}

export function updateEvent(id, data) {
  return api.put(`/events/${id}`, data);
}

export function deleteEvent(id) {
  return api.delete(`/events/${id}`);
}
