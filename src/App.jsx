// App.jsx
import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import DayView from "./components/DayView";
import dayjs from "dayjs";
import eventsData from "./data/events.json"; // ✅ Import directly from src/data
import "./App.css";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearOptions, setYearOptions] = useState([]);

  // Load events once from imported JSON
  useEffect(() => {
    setEvents(eventsData); // ✅ Set events from imported file
  }, []);

  useEffect(() => {
    const years = [];
    for (let y = 1990; y <= 2049; y++) years.push(y);
    setYearOptions(years);
  }, []);

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(currentDate.month(monthIndex));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    setCurrentDate(currentDate.year(year));
    setShowYearPicker(false);
  };

  const handleOverlayClick = () => {
    setShowMonthPicker(false);
    setShowYearPicker(false);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const toggleMonthPicker = (e) => {
    e.stopPropagation();
    setShowMonthPicker(!showMonthPicker);
    setShowYearPicker(false);
  };

  const toggleYearPicker = (e) => {
    e.stopPropagation();
    setShowYearPicker(!showYearPicker);
    setShowMonthPicker(false);
  };

  return (
    <div className="app-container" onClick={handleOverlayClick}>
      <div className="calendar-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="planify-title">Planify</div>
        <div className="calendar-header">
          <div className="header-left">
            <button onClick={handlePrevMonth} className="nav-button">‹</button>
            <div className="date-display">
              <span className="month-year">{currentDate.format("MMMM YYYY")}</span>
              <div className="picker-buttons">
                <button onClick={toggleMonthPicker} className="picker-button">Month</button>
                <button onClick={toggleYearPicker} className="picker-button">Year</button>
              </div>
            </div>
            <button onClick={handleNextMonth} className="nav-button">›</button>
          </div>

          {showMonthPicker && (
            <div className="dropdown month-dropdown">
              {monthNames.map((month, index) => (
                <div key={month} className="dropdown-item" onClick={() => handleMonthSelect(index)}>
                  {month}
                </div>
              ))}
            </div>
          )}

          {showYearPicker && (
            <div className="dropdown year-dropdown">
              {yearOptions.map((year) => (
                <div key={year} className="dropdown-item" onClick={() => handleYearSelect(year)}>
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="calendar-body">
          <div className="calendar-panel">
            <Calendar currentDate={currentDate} events={events} onDateClick={handleDateClick} />
          </div>
          <div className="dayview-panel">
            <DayView selectedDate={selectedDate} events={events} onToday={handleToday} />
          </div>
        </div>
      </div>
    </div>
  );
}
