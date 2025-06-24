// App.jsx
import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import DayView from "./components/DayView";
import dayjs from "dayjs";
import eventsData from "./data/events.json";
import "./App.css";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const yearRangeOptions = [
  "1990-1999", "2000-2009", "2010-2019",
  "2020-2029", "2030-2039", "2040-2049"
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs()); // today by default
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showYearRangePicker, setShowYearRangePicker] = useState(false);
  const [selectedYearRange, setSelectedYearRange] = useState("2020-2029");
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const [start, end] = selectedYearRange.split("-").map(Number);
    const years = [];
    for (let y = start; y <= end; y++) years.push(y);
    setYearOptions(years);
  }, [selectedYearRange]);

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

  const handleYearRangeSelect = (range) => {
    setSelectedYearRange(range);
    setShowYearRangePicker(false);
    setShowYearPicker(true);
  };

  const handleOverlayClick = () => {
    setShowMonthPicker(false);
    setShowYearPicker(false);
    setShowYearRangePicker(false);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <div className="app-container" onClick={handleOverlayClick}>
      <div className="calendar-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header">
          <button onClick={handlePrevMonth} className="nav-button">‹</button>

          <div className="date-controls">
            <span className="month-year clickable" onClick={(e) => {
              e.stopPropagation();
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
              setShowYearRangePicker(false);
            }}>
              {currentDate.format("MMMM")}
            </span>

            <span className="month-year clickable" onClick={(e) => {
              e.stopPropagation();
              setShowYearRangePicker(!showYearRangePicker);
              setShowYearPicker(false);
              setShowMonthPicker(false);
            }}>
              {currentDate.format("YYYY")}
            </span>

            {showMonthPicker && (
              <div className="dropdown">
                {monthNames.map((m, i) => (
                  <div key={m} className="dropdown-item" onClick={() => handleMonthSelect(i)}>{m}</div>
                ))}
              </div>
            )}

            {showYearRangePicker && (
              <div className="dropdown">
                {yearRangeOptions.map((range) => (
                  <div key={range} className="dropdown-item" onClick={() => handleYearRangeSelect(range)}>{range}</div>
                ))}
              </div>
            )}

            {showYearPicker && (
              <div className="dropdown">
                {yearOptions.map((y) => (
                  <div key={y} className="dropdown-item" onClick={() => handleYearSelect(y)}>{y}</div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleToday} className="today-button">Today</button>
          <button onClick={handleNextMonth} className="nav-button">›</button>
        </div>

        <div className="calendar-body">
          <div className="calendar-panel">
            <Calendar
              currentDate={currentDate}
              events={eventsData}
              onDateClick={handleDateClick}
            />
          </div>
          <div className="dayview-panel">
            <DayView
              selectedDate={selectedDate}
              events={eventsData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
