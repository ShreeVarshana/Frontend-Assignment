import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/events.json')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  const startOfMonth = currentDate.startOf('month');
  const startDay = startOfMonth.day(); // Sunday = 0
  const daysInMonth = currentDate.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(dayjs(currentDate).date(i));
  }

  const handlePrev = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const handleNext = () => setCurrentDate(currentDate.add(1, 'month'));

  const getEventsForDate = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return events.filter(e => e.date === dateStr);
  };

  const isToday = (date) => {
    return dayjs().isSame(date, 'day');
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <button onClick={handlePrev}>&lt;</button>
        <h2>{currentDate.format('MMMM YYYY')}</h2>
        <button onClick={handleNext}>&gt;</button>
      </div>

      <div className="day-names">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="day-name">{day}</div>
        ))}
      </div>

      <div className="grid">
        {days.map((date, idx) => (
          <div key={idx} className={`cell ${date && isToday(date) ? 'today' : ''}`}>
            {date && (
              <>
                <div className="date-number">{date.date()}</div>
                <div className="events">
                  {getEventsForDate(date).map((e, i) => (
                    <div key={i} className="event">
                      <strong>{e.title}</strong>
                      <div className="time">{e.time} ({e.duration})</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
