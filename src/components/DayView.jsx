// DayView.jsx
import React from "react";
import dayjs from "dayjs";
import "./DayView.css";

export default function DayView({ selectedDate, events, onBackToMonth }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter(event => event.date === selectedDate.format("YYYY-MM-DD"));

  const getEventStyle = (event) => {
    const startTime = dayjs(`${event.date} ${event.time}`);
    const startHour = startTime.hour();
    const startMinute = startTime.minute();
    const top = (startHour * 60 + startMinute) * (60 / 60); // 60px per hour
    const height = (event.duration / 60) * 60; // 60px per hour

    return {
      position: 'absolute',
      top: `${top}px`,
      left: '80px',
      right: '20px',
      height: `${height}px`,
      zIndex: 10
    };
  };

  const getEventColor = (eventId) => {
    // Different colors for different events
    const colors = [
      '#22c55e', // green
      '#3b82f6', // blue
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#ec4899', // pink
      '#10b981'  // emerald
    ];
    return colors[eventId % colors.length];
  };

  return (
    <div className="day-view">
      <div className="day-view-header">
        <button onClick={onBackToMonth} className="back-button">
          ← Back to Month
        </button>
        <div className="day-view-title">
          <h2>{selectedDate.format("dddd, MMMM D, YYYY")}</h2>
        </div>
      </div>

      <div className="day-view-content">
        <div className="time-column">
          {hours.map(hour => (
            <div key={hour} className="time-slot">
              <div className="time-label">
                {dayjs().hour(hour).minute(0).format("HH:mm")}
              </div>
            </div>
          ))}
        </div>

        <div className="events-column">
          <div className="hour-lines">
            {hours.map(hour => (
              <div key={hour} className="hour-line"></div>
            ))}
          </div>

          {dayEvents.map(event => (
            <div
              key={event.id}
              className="day-event"
              style={{
                ...getEventStyle(event),
                backgroundColor: getEventColor(event.id)
              }}
            >
              <div className="day-event-content">
                <div className="day-event-title">{event.title}</div>
                <div className="day-event-time">
                  {dayjs(`2000-01-01 ${event.time}`).format("HH:mm")} ({event.duration} min)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}