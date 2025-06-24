// DayView.jsx
import React, { useState } from "react";
import dayjs from "dayjs";
import "./DayView.css";

export default function DayView({ selectedDate, events, onToday }) {
  const dateString = selectedDate.format("YYYY-MM-DD");
  const dayEvents = events
    .filter(event => event.date === dateString)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Conflict detection (same as Calendar)
  const eventsOverlap = (event1, event2) => {
    if (event1.date !== event2.date) return false;
    const start1 = dayjs(`${event1.date} ${event1.time}`);
    const end1 = start1.add(event1.duration, 'minute');
    const start2 = dayjs(`${event2.date} ${event2.time}`);
    const end2 = start2.add(event2.duration, 'minute');
    return start1.isBefore(end2) && start2.isBefore(end1);
  };
  const conflictIds = new Set();
  for (let i = 0; i < dayEvents.length; i++) {
    for (let j = i + 1; j < dayEvents.length; j++) {
      if (eventsOverlap(dayEvents[i], dayEvents[j])) {
        conflictIds.add(dayEvents[i].id);
        conflictIds.add(dayEvents[j].id);
      }
    }
  }

  const formatTime = (time) => dayjs(`2000-01-01 ${time}`).format("h:mm A");

  return (
    <div className="dayview">
      <button className="today-button" onClick={onToday}>Today</button>
      <div className="dayview-header">
        <h2> {selectedDate.format("dddd, MMMM D, YYYY")} </h2>
      </div>
      <div className="dayview-events">
        {dayEvents.length === 0 ? (
          <div className="no-events">No events for this day.</div>
        ) : (
          dayEvents.map(event => (
            <div key={event.id} className={`dayview-event${conflictIds.has(event.id) ? " conflict" : ""}`}>
              <div className="event-title">{event.title}</div>
              <div className="event-time">{formatTime(event.time)} - {event.duration} min</div>
              {conflictIds.has(event.id) && (
                <div className="conflict-warning">⚠ Conflict with another task</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
