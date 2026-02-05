/**
 * Habits Module - Habit CRUD operations and state management
 */

const Habits = {
    habits: [],

    /**
     * Initialize habits from storage
     */
    init() {
        this.habits = Storage.load(Storage.KEYS.HABITS, []);
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Get current date in YYYY-MM-DD format
     */
    getCurrentDate() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    },

    /**
     * Create a new habit
     */
    createHabit(name, color, icon, frequency = 'daily') {
        const habit = {
            id: this.generateId(),
            name: name.trim(),
            color: color,
            icon: icon || '📌',
            frequency: frequency,
            createdDate: this.getCurrentDate(),
            completedDates: [],
            order: this.habits.length
        };

        this.habits.push(habit);
        this.save();
        return habit;
    },

    /**
     * Update an existing habit
     */
    updateHabit(id, updates) {
        const index = this.habits.findIndex(h => h.id === id);
        if (index === -1) return false;

        this.habits[index] = { ...this.habits[index], ...updates };
        this.save();
        return this.habits[index];
    },

    /**
     * Delete a habit
     */
    deleteHabit(id) {
        const index = this.habits.findIndex(h => h.id === id);
        if (index === -1) return false;

        this.habits.splice(index, 1);
        // Reorder remaining habits
        this.habits.forEach((habit, idx) => {
            habit.order = idx;
        });
        this.save();
        return true;
    },

    /**
     * Get all habits sorted by order
     */
    getHabits() {
        return [...this.habits].sort((a, b) => a.order - b.order);
    },

    /**
     * Get habit by ID
     */
    getHabitById(id) {
        return this.habits.find(h => h.id === id);
    },

    /**
     * Reorder habits
     */
    reorderHabits(habitId, direction) {
        const index = this.habits.findIndex(h => h.id === habitId);
        if (index === -1) return false;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= this.habits.length) return false;

        // Swap orders
        const temp = this.habits[index].order;
        this.habits[index].order = this.habits[newIndex].order;
        this.habits[newIndex].order = temp;

        // Re-sort
        this.habits.sort((a, b) => a.order - b.order);
        this.save();
        return true;
    },

    /**
     * Save habits to storage
     */
    save() {
        Storage.save(Storage.KEYS.HABITS, this.habits);
    },


};
