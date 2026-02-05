/**
 * Tracker Module - Daily tracking logic
 */

const Tracker = {
    /**
     * Toggle habit completion for a specific date
     */
    toggleCompletion(habitId, date = null) {
        const targetDate = date || Habits.getCurrentDate();
        const habit = Habits.getHabitById(habitId);
        
        if (!habit) return false;

        const dateIndex = habit.completedDates.indexOf(targetDate);
        
        if (dateIndex === -1) {
            // Mark as completed
            habit.completedDates.push(targetDate);
        } else {
            // Mark as incomplete
            habit.completedDates.splice(dateIndex, 1);
        }

        Habits.save();
        return dateIndex === -1; // Return true if now completed
    },

    /**
     * Check if habit is completed for a specific date
     */
    isCompleted(habitId, date = null) {
        const targetDate = date || Habits.getCurrentDate();
        const habit = Habits.getHabitById(habitId);
        
        if (!habit) return false;
        return habit.completedDates.includes(targetDate);
    },

    /**
     * Get completion count for today
     */
    getTodayCompletionCount() {
        const today = Habits.getCurrentDate();
        const habits = Habits.getHabits();
        return habits.filter(habit => habit.completedDates.includes(today)).length;
    },

    /**
     * Get today's completion percentage
     */
    getTodayCompletionPercentage() {
        const habits = Habits.getHabits();
        if (habits.length === 0) return 0;
        
        const completed = this.getTodayCompletionCount();
        return Math.round((completed / habits.length) * 100);
    },

    /**
     * Render daily tracker UI
     */
    renderDailyTracker() {
        const container = document.getElementById('dailyHabitList');
        const habits = Habits.getHabits();
        
        if (habits.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🎯</div>
                    <div class="empty-state-text">No habits yet!</div>
                    <p style="color: var(--text-secondary);">Click "Add New Habit" to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = habits.map(habit => {
            const isCompleted = this.isCompleted(habit.id);
            const streak = Streaks.calculateCurrentStreak(habit.completedDates);
            const isMilestone = [7, 14, 30, 50, 100, 365].includes(streak);
            
            return `
                <div class="habit-item ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}">
                    <div class="habit-checkbox"></div>
                    <div class="habit-icon" style="background-color: ${habit.color}20; color: ${habit.color};">
                        ${habit.icon}
                    </div>
                    <div class="habit-details">
                        <div class="habit-name">${habit.name}</div>
                        <div class="habit-meta">
                            <span class="streak-badge ${isMilestone ? 'milestone' : ''}">
                                🔥 ${streak} day streak
                            </span>
                            <span>${habit.frequency}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Update summary
        this.updateTodaySummary();

        // Attach click handlers
        container.querySelectorAll('.habit-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const habitId = item.dataset.habitId;
                this.toggleCompletion(habitId);
                this.renderDailyTracker();
                
                // Update analytics if that view is visible
                if (document.getElementById('analyticsView').classList.contains('active')) {
                    Analytics.renderAnalytics();
                }
            });
        });
    },

    /**
     * Update today's summary stats
     */
    updateTodaySummary() {
        const habits = Habits.getHabits();
        const completed = this.getTodayCompletionCount();
        const percentage = this.getTodayCompletionPercentage();

        document.getElementById('todaySummary').innerHTML = `
            <div class="summary-stat">
                <span class="stat-value">${completed}/${habits.length}</span>
                <span class="stat-label">Completed</span>
            </div>
            <div class="summary-stat">
                <span class="stat-value">${percentage}%</span>
                <span class="stat-label">Progress</span>
            </div>
        `;
    },

    /**
     * Update current date display
     */
    updateDateDisplay() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);
        
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = dateString;
        }
    }
};
