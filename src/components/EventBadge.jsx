// EventBadge.jsx
import React from "react";
import dayjs from "dayjs";
import "./EventBadge.css";

export default function EventBadge({ event, hasConflict, showTime = true }) {
  const formatTime = (time) => {
    return dayjs(`2000-01-01 ${time}`).format("h:mm A");
  };

  const getEndTime = (startTime, duration) => {
    const start = dayjs(`2000-01-01 ${startTime}`);
    const end = start.add(duration, 'minute');
    return end.format("h:mm A");
  };

  return (
    <div className={`event-badge ${hasConflict ? "conflict" : ""}`}>
      <div className="event-title">{event.title}
        {!showTime && hasConflict && (
          <span className="conflict-indicator"> ⚠️</span>
        )}
      </div>
      {showTime && (
        <div className="event-time">
          {formatTime(event.time)} - {getEndTime(event.time, event.duration)}
          {hasConflict && (
            <span className="conflict-indicator"> ⚠️</span>
          )}
        </div>
      )}
    </div>
  );
}