// DayView.jsx
import React from "react";
import dayjs from "dayjs";
import "./DayView.css";

export default function DayView({ selectedDate, events }) {
  const dateString = selectedDate.format("YYYY-MM-DD");
  const dayEvents = events
    .filter(event => event.date === dateString)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Check for conflicts
  const detectConflicts = (eventsList) => {
    const conflictSet = new Set();
    for (let i = 0; i < eventsList.length; i++) {
      for (let j = i + 1; j < eventsList.length; j++) {
        if (eventsList[i].time === eventsList[j].time) {
          conflictSet.add(eventsList[i].id);
          conflictSet.add(eventsList[j].id);
        } else {
          const startA = dayjs(`2000-01-01 ${eventsList[i].time}`);
          const endA = startA.add(eventsList[i].duration, 'minute');
          const startB = dayjs(`2000-01-01 ${eventsList[j].time}`);
          const endB = startB.add(eventsList[j].duration, 'minute');

          if (startA.isBefore(endB) && startB.isBefore(endA)) {
            conflictSet.add(eventsList[i].id);
            conflictSet.add(eventsList[j].id);
          }
        }
      }
    }
    return conflictSet;
  };

  const conflictIds = detectConflicts(dayEvents);

  const formatTime = (time) => dayjs(`2000-01-01 ${time}`).format("h:mm A");

  return (
    <div className="dayview">
      <div className="dayview-header">
        <h2> {selectedDate.format("dddd, MMMM D, YYYY")} </h2>
      </div>
      <div className="dayview-events">
        {dayEvents.length === 0 ? (
          <div className="no-events">No events for this day.</div>
        ) : (
          dayEvents.map(event => (
            <div
              key={event.id}
              className={`dayview-event ${conflictIds.has(event.id) ? "conflict" : ""}`}
            >
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
