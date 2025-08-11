import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UsersPage from './components/UsersPage';
import RoomsPage from './components/RoomsPage';
import RoomView from './components/RoomView';
import EventsPage from './components/EventsPage';


function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', }}>
        <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <Link to="/users" style={{ marginRight: 15 }}>Users</Link>
          <Link to="/rooms" style={{ marginRight: 15 }}>Rooms</Link>
          <Link to="/events" style={{ marginRight: 15 }}>Events</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/users" element={<UsersPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomView />} />
          <Route path="/events" element={<EventsPage />} />

          {/* Redirect any unknown route to /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
