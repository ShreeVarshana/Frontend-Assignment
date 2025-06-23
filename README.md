# Calendar Application

A React-based calendar application with event management and conflict detection, built according to the Frontend Labs assignment requirements.

## Features

- **Monthly Calendar View**: Clean grid layout showing dates for the current month
- **Navigation**: Previous/Next month navigation with clickable month/year dropdowns
- **Event Display**: Events loaded from static JSON data with title, date, time, and duration
- **Conflict Detection**: Visual indication of overlapping events with color-coding and warning icons
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Current Date Highlighting**: Today's date is visually highlighted

## Conflict Detection

The calendar implements intelligent conflict detection:
- Events overlapping in time are marked with a red border and warning icon (⚠️)
- Conflicting events have a pulsing animation to draw attention
- Example conflicts are built into
