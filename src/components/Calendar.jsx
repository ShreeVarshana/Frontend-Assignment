import React, { useState } from "react";
import dayjs from "dayjs";
import EventBadge from "./EventBadge";
import "./Calendar.css";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper function to check if two events overlap
const eventsOverlap = (event1, event2) => {
  if (event1.date !== event2.date) return false;

  const start1 = dayjs(`${event1.date} ${event1.time}`);
  const end1 = start1.add(event1.duration, 'minute');
  const start2 = dayjs(`${event2.date} ${event2.time}`);
  const end2 = start2.add(event2.duration, 'minute');

  return start1.isBefore(end2) && start2.isBefore(end1);
};

// Helper function to detect conflicts in events
const detectConflicts = (events) => {
  const conflictMap = new Map();

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      if (eventsOverlap(events[i], events[j])) {
        conflictMap.set(events[i].id, true);
        conflictMap.set(events[j].id, true);
      }
    }
  }

  return conflictMap;
};

export default function Calendar({ currentDate, events, onDateClick }) {
  const [expandedDay, setExpandedDay] = useState(null);

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startOfCalendar = startOfMonth.startOf("week");
  const endOfCalendar = endOfMonth.endOf("week");

  const today = dayjs();
  const conflictMap = detectConflicts(events);

  // Generate calendar days
  const calendarDays = [];
  let day = startOfCalendar;

  while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, "day")) {
    calendarDays.push(day);
    day = day.add(1, "day");
  }

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateString = date.format("YYYY-MM-DD");
    return events
      .filter(event => event.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Maximum events to show before "more" indicator
  const MAX_VISIBLE_EVENTS = 3;

  const handleMoreClick = (dayKey, e) => {
    e.stopPropagation();
    setExpandedDay(expandedDay === dayKey ? null : dayKey);
  };

  return (
    <div className="calendar">
      {/* Weekday headers */}
      <div className="calendar-weekdays">
        {weekdays.map(weekday => (
          <div key={weekday} className="weekday">
            {weekday}
          </div>
        ))}
      </div>
      {/* Calendar days */}
      <div className="calendar-days">
        {calendarDays.map(day => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = day.month() === currentDate.month();
          const isToday = day.isSame(today, "day");
          const dayKey = day.format("YYYY-MM-DD");
          const isExpanded = expandedDay === dayKey;

          const visibleEvents = isExpanded ? dayEvents : dayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const hasMoreEvents = dayEvents.length > MAX_VISIBLE_EVENTS;
          const moreCount = dayEvents.length - MAX_VISIBLE_EVENTS;

          return (
            <div
              key={dayKey}
              className={`day ${isCurrentMonth ? "current-month" : "other-month"} ${isToday ? "today" : ""}`}
              onClick={() => onDateClick(day)}
              tabIndex={0}
              aria-label={`Day ${day.format("D MMMM YYYY")}${isToday ? ', today' : ''}${isCurrentMonth ? '' : ', not in current month'}`}
              role="button"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onDateClick(day);
                }
              }}
            >
              <div className="date-number">{day.format("D")}</div>
              <div className="events">
                {visibleEvents.map(event => (
                  <EventBadge
                    key={event.id}
                    event={event}
                    hasConflict={conflictMap.has(event.id)}
                    showTime={false}
                  />
                ))}
                {hasMoreEvents && !isExpanded && (
                  <div
                    className="more-indicator"
                    onClick={(e) => handleMoreClick(dayKey, e)}
                  >
                    +{moreCount} more
                  </div>
                )}
                {hasMoreEvents && isExpanded && (
                  <div
                    className="more-indicator"
                    onClick={(e) => handleMoreClick(dayKey, e)}
                  >
                    Show less
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}