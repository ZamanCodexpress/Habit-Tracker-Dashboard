# Habit Tracker Dashboard

A modern **client-side Habit Tracker Dashboard** built using **HTML, CSS, and vanilla JavaScript**. The application helps users build consistency by tracking daily habits, visualizing performance with analytics, maintaining streaks, and generating smart insights — all without any backend or frameworks.

---

## Overview

This is a **single-page frontend application** designed to improve productivity and routine building. Users can create habits, mark them complete, and monitor progress through visual dashboards and statistical summaries.

All data is stored locally in the browser using **LocalStorage**, making the app fast, lightweight, and easy to run offline.

---

## Features

### Habit Management

* Create, edit, reorder, and delete habits
* Assign icons and colors
* Choose frequency (Daily / Weekly)
* View total completion history

### Daily Tracking

* Mark habits completed for the current day
* View completion percentage
* Automatic streak calculation
* Streak milestone detection

### Calendar Heatmap

* 365-day visual completion grid
* Filter by individual habit
* Intensity-based completion coloring
* Integrated live clock display

### Analytics & Insights

* Weekly completion rate chart
* Monthly performance tracking
* Habit performance comparison bars
* Completion distribution pie chart
* 30-day trend line chart
* Automated smart tips and risk detection

### Persistent Storage

* Uses browser **LocalStorage API**
* Habit data remains after refresh
* Theme preference saved

### Theme & UI

* Light and Dark mode support
* System theme detection
* Responsive layout for all devices
* Smooth transitions and animations

---

## Technologies Used

* HTML5
* CSS3 (Custom properties, responsive layout)
* JavaScript (ES6+, modular architecture)
* Canvas API (chart rendering)
* Web Storage API (LocalStorage)

---

## Project Structure

```text
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── habits.js
│   ├── tracker.js
│   ├── streaks.js
│   ├── calendar.js
│   ├── analytics.js
│   ├── insights.js
│   └── theme.js
```

---

## Setup & Usage

1. Clone the repository:

```bash
git clone https://github.com/ZamanCodexpress/Habit-Tracker-Dashboard.git
```

**OR** download the project as a `.zip` file and extract it.

2. Open `index.html` in any modern web browser.

No build tools, dependencies, or server setup required.

---

## Implementation Details

* Modular JavaScript architecture separating features by responsibility
* Central app controller managing navigation and rendering
* DOM-driven UI updates
* Canvas-based custom chart rendering (no libraries)
* LocalStorage synchronization for persistence
* Streak calculations using date comparison logic
* Behavior-based insight generation algorithms

---

## Limitations

* Data stored per browser/device only
* No cloud synchronization
* No authentication or user accounts
* No reminder notifications

---

## License

This project is **open-source** and intended for **educational and portfolio use**.

---

## Author

Built as a frontend practice project to demonstrate:

* UI architecture
* Modular JavaScript design
* Data visualization
* State persistence
* Analytical feature implementation
