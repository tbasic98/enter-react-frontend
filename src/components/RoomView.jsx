import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRoomEvents, fetchRooms } from '../api';

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTopStyle(minutes) {
  return minutes * 2; // 1 min = 2 px, starting at 00:00
}

const HOURS_START = 0;
const HOURS_END = 24;

export default function RoomView() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [currentTimeTop, setCurrentTimeTop] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    async function load() {
      const roomsRes = await fetchRooms();
      const room = roomsRes.data.find(r => r.id === Number(id));
      setRoomName(room ? room.name : 'Room');

      const eventsRes = await fetchRoomEvents(id);
      setEvents(eventsRes.data);
    }
    load();
  }, [id]);

  useEffect(() => {
    function updateCurrentTime() {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();

      if (minutes < HOURS_START * 60 || minutes > HOURS_END * 60) {
        setCurrentTimeTop(null);
        return;
      }

      const top = minutesToTopStyle(minutes);
      setCurrentTimeTop(top);

      if (containerRef.current) {
        const container = containerRef.current;
        const containerHeight = container.clientHeight;

        const scrollTop = top - containerHeight / 2;
        const maxScrollTop = container.scrollHeight - containerHeight;
        const finalScrollTop = Math.min(Math.max(scrollTop, 0), maxScrollTop);

        container.scrollTo({ top: finalScrollTop, behavior: 'smooth' });
      }
    }

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Schedule for {roomName}</h2>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: 600,
          overflowY: 'hidden',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          borderRadius: 8,
          paddingLeft: 50,
          userSelect: 'none',
          fontSize: 14,
          color: '#555',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: HOURS_END * 120,
            width: '100%',
          }}
        >
          {[...Array(HOURS_END - HOURS_START + 1)].map((_, i) => {
            const hour = i + HOURS_START;
            return (
              <div
                key={hour}
                style={{
                  height: 120,
                  borderTop: '1px solid #ddd',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 40,
                    textAlign: 'right',
                    paddingRight: 5,
                    fontWeight: 'bold',
                  }}
                >
                  {hour}:00
                </div>
              </div>
            );
          })}

          {/* Current time line */}
          {currentTimeTop !== null && (
            <div
              style={{
                position: 'absolute',
                top: currentTimeTop,
                left: 40,
                right: 0,
                height: 2,
                backgroundColor: 'red',
                zIndex: 10,
              }}
            />
          )}

          {/* Events */}
          {events.map(event => {
            // Calculate top and height
            const startMinutes = timeToMinutes(event.start_time);
            const endMinutes = timeToMinutes(event.end_time);
            const top = minutesToTopStyle(startMinutes);
            const height = minutesToTopStyle(endMinutes - startMinutes);

            return (
              <div
                key={event.id}
                style={{
                  position: 'absolute',
                  top,
                  left: 50,
                  right: 10,
                  height,
                  backgroundColor: '#4096ff',
                  color: 'white',
                  borderRadius: 4,
                  padding: '4px 8px',
                  boxSizing: 'border-box',
                  fontWeight: 'bold',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {event.title || 'Event'}
                <small style={{ fontWeight: 'normal', fontSize: 12 }}>
                  {event.start_time} - {event.end_time}
                </small>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
