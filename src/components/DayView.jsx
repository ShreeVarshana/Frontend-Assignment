import React, { useState } from "react";
import dayjs from "dayjs";
import "./DayView.css";

export default function DayView({ selectedDate, events, onToday, onAddTask }) {
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
  const getEndTime = (startTime, duration) => {
    const start = dayjs(`2000-01-01 ${startTime}`);
    const end = start.add(duration, 'minute');
    return end.format("h:mm A");
  };

  return (
    <div className="dayview">
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="today-button" onClick={onToday}>Today</button>
        <button className="add-task-button" onClick={() => {
          const title = prompt('Enter task title:');
          if (!title) return;
          const time = prompt('Enter start time (HH:mm):');
          if (!time) return;
          const duration = prompt('Enter duration (minutes):');
          if (!duration) return;
          onAddTask(title, time, duration);
        }}>Add Tasks</button>
      </div>
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
              <div className="event-time">{formatTime(event.time)} - {getEndTime(event.time, event.duration)}</div>
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
