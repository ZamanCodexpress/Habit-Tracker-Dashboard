/**
 * Theme Module - Dark/Light mode management
 */

const Theme = {
    currentTheme: 'light',

    /**
     * Initialize theme from storage or system preference
     */
    init() {
        const savedTheme = Storage.load(Storage.KEYS.THEME);
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Detect system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            }
        }
        
        this.applyTheme(this.currentTheme);
        this.updateToggleIcon();
    },

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        this.currentTheme = theme;
        Storage.save(Storage.KEYS.THEME, theme);
    },

    /**
     * Toggle between light and dark theme
     */
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateToggleIcon();
        
        // Re-render calendar and charts with new colors
        if (document.getElementById('calendarView').classList.contains('active')) {
            const habitId = document.getElementById('calendarHabitSelect').value;
            Calendar.renderCalendar(habitId === 'all' ? null : habitId);
        }
        
        if (document.getElementById('analyticsView').classList.contains('active')) {
            Analytics.drawWeeklyChart();
        }
    },

    /**
     * Update toggle button icon
     */
    updateToggleIcon() {
        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }
};
