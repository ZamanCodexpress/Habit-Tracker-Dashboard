/**
 * Streaks Module - Streak calculation logic
 */

const Streaks = {
    /**
     * Calculate current streak for a habit
     * Counts consecutive days from today backward
     */
    calculateCurrentStreak(completedDates) {
        if (!completedDates || completedDates.length === 0) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Sort dates in descending order
        const sortedDates = completedDates
            .map(d => new Date(d))
            .sort((a, b) => b - a);

        let streak = 0;
        let currentDate = new Date(today);

        for (let i = 0; i < sortedDates.length; i++) {
            const completedDate = new Date(sortedDates[i]);
            completedDate.setHours(0, 0, 0, 0);
            
            // Check if this date matches our expected date
            if (completedDate.getTime() === currentDate.getTime()) {
                streak++;
                // Move to previous day
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (completedDate.getTime() < currentDate.getTime()) {
                // Gap found, streak is broken
                break;
            }
        }

        return streak;
    },

    /**
     * Calculate longest streak ever for a habit
     */
    calculateLongestStreak(completedDates) {
        if (!completedDates || completedDates.length === 0) return 0;

        // Sort dates in ascending order
        const sortedDates = completedDates
            .map(d => new Date(d))
            .sort((a, b) => a - b);

        let longestStreak = 0;
        let currentStreak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            
            // Calculate difference in days
            const diffTime = currDate - prevDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays === 1) {
                // Consecutive day
                currentStreak++;
            } else {
                // Streak broken
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }

        // Check final streak
        longestStreak = Math.max(longestStreak, currentStreak);
        return longestStreak;
    },

    /**
     * Get total completions for a habit
     */
    getTotalCompletions(completedDates) {
        return completedDates ? completedDates.length : 0;
    },

    /**
     * Get best performing habit
     */
    getBestHabit() {
        const habits = Habits.getHabits();
        if (habits.length === 0) return null;

        let bestHabit = habits[0];
        let bestStreak = this.calculateCurrentStreak(habits[0].completedDates);

        habits.forEach(habit => {
            const streak = this.calculateCurrentStreak(habit.completedDates);
            if (streak > bestStreak) {
                bestStreak = streak;
                bestHabit = habit;
            }
        });

        return { habit: bestHabit, streak: bestStreak };
    },

    /**
     * Get overall longest streak across all habits
     */
    getOverallLongestStreak() {
        const habits = Habits.getHabits();
        if (habits.length === 0) return 0;

        let longestStreak = 0;

        habits.forEach(habit => {
            const streak = this.calculateLongestStreak(habit.completedDates);
            longestStreak = Math.max(longestStreak, streak);
        });

        return longestStreak;
    }
};
