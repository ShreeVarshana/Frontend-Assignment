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

  // For calendar grid view, show only title and conflict indicator
  if (!showTime) {
    return (
      <div
        className={`event-badge ${hasConflict ? "conflict" : ""}`}
        title={`${event.title} - ${formatTime(event.time)} to ${getEndTime(event.time, event.duration)}`}
      >
        <span className="event-title">
          {event.title}
          {hasConflict && <span className="conflict-indicator">⚠️</span>}
        </span>
      </div>
    );
  }

  // For day view, show full details
  return (
    <div className={`event-badge ${hasConflict ? "conflict" : ""}`}>
      <div className="event-title">{event.title}</div>
      <div className="event-time">
        {formatTime(event.time)} - {getEndTime(event.time, event.duration)}
        {hasConflict && (
          <span className="conflict-indicator">⚠️</span>
        )}
      </div>
    </div>
  );
}