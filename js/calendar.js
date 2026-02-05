/**
 * Calendar Module - Calendar heatmap visualization
 */

const Calendar = {
    /**
     * Get intensity color based on completion count
     */
    getIntensityColor(count) {
        const isDark = document.body.classList.contains('dark-theme');
        
        if (count === 0) return isDark ? '#1e1e1e' : '#ebedf0';
        if (count === 1) return isDark ? '#0e4429' : '#c6e48b';
        if (count === 2) return isDark ? '#006d32' : '#7bc96f';
        if (count === 3) return isDark ? '#26a641' : '#239a3b';
        return isDark ? '#39d353' : '#196127';
    },

    /**
     * Generate array of dates for calendar
     */
    generateDateRange(days = 365) {
        const dates = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date);
        }
        
        return dates;
    },

    /**
     * Get completion count for a specific date across all or specific habit
     */
    getCompletionsForDate(date, habitId = null) {
        const dateString = date.toISOString().split('T')[0];
        const habits = habitId ? [Habits.getHabitById(habitId)] : Habits.getHabits();
        
        let count = 0;
        habits.forEach(habit => {
            if (habit && habit.completedDates.includes(dateString)) {
                count++;
            }
        });
        
        return count;
    },

    /**
     * Start the live clock
     */
    startLiveClock() {
        if (this.clockInterval) clearInterval(this.clockInterval);
        
        const updateClock = () => {
            const now = new Date();
            const timeElement = document.querySelector('#liveClock .clock-time');
            const dateElement = document.querySelector('#liveClock .clock-date');
            
            if (timeElement && dateElement) {
                // Time: 00:00:00
                timeElement.textContent = now.toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                });
                
                // Date: Weekday, Month Day, Year
                dateElement.textContent = now.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            }
        };
        
        updateClock(); // Initial call
        this.clockInterval = setInterval(updateClock, 1000);
    },

    /**
     * Render calendar heatmap
     */
    renderCalendar(habitId = null) {
        this.startLiveClock();
        const container = document.getElementById('calendarContainer');
        const dates = this.generateDateRange(365);
        
        // Group dates by week
        const weeks = [];
        let currentWeek = [];
        
        // Start from the first day and pad to align with Sunday
        const firstDay = dates[0].getDay();
        for (let i = 0; i < firstDay; i++) {
            currentWeek.push(null); // Empty cells
        }
        
        dates.forEach(date => {
            currentWeek.push(date);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });
        
        // Add remaining days
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        // Create calendar grid
        let calendarHTML = '<div class="calendar-grid">';
        
  // Transpose weeks into columns (each column is a week)
        const maxWeeks = weeks.length;
        for (let day = 0; day < 7; day++) {
            for (let week = 0; week < maxWeeks; week++) {
                const date = weeks[week][day];
                
                if (date) {
                    const count = this.getCompletionsForDate(date, habitId);
                    const color = this.getIntensityColor(count);
                    const dateString = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    });
                    
                    calendarHTML += `
                        <div class="calendar-day" 
                             style="background-color: ${color};"
                             data-date="${date.toISOString().split('T')[0]}"
                             data-count="${count}"
                             title="${dateString}: ${count} completion(s)">
                        </div>
                    `;
                } else {
                    calendarHTML += '<div class="calendar-day" style="opacity: 0;"></div>';
                }
            }
        }
        
        calendarHTML += '</div>';
        container.innerHTML = calendarHTML;
    },

    /**
     * Update habit selector for calendar
     */
    updateHabitSelector() {
        const select = document.getElementById('calendarHabitSelect');
        const habits = Habits.getHabits();
        
        let optionsHTML = '<option value="all">All Habits</option>';
        habits.forEach(habit => {
            optionsHTML += `<option value="${habit.id}">${habit.icon} ${habit.name}</option>`;
        });
        
        select.innerHTML = optionsHTML;
        
        // Add change listener
        select.addEventListener('change', (e) => {
            const habitId = e.target.value === 'all' ? null : e.target.value;
            this.renderCalendar(habitId);
        });
    }
};
