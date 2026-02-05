/**
 * App Module - Main application orchestrator
 * Initializes all modules and coordinates UI interactions
 */

const App = {
    currentView: 'tracker',

    /**
     * Initialize the application
     */
    init() {
        // Check storage availability
        if (!Storage.isAvailable()) {
            alert('localStorage is not available. The app may not function properly.');
        }

        // Initialize modules
        Theme.init();
        Habits.init();
        
        // Set up UI
        this.setupEventListeners();
        this.setupNavigation();
        this.setupModals();
        
        // Initial render
        this.switchView('tracker');
        Tracker.updateDateDisplay();
        
        console.log('✅ Habit Tracker Dashboard initialized');
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            Theme.toggle();
        });

        // Mobile menu toggle
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('active');
        });

        // Add habit button
        document.getElementById('addHabitBtn')?.addEventListener('click', () => {
            this.openHabitModal();
        });

        // Modal close handlers
        document.getElementById('modalClose')?.addEventListener('click', () => {
            this.closeHabitModal();
        });

        document.getElementById('cancelBtn')?.addEventListener('click', () => {
            this.closeHabitModal();
        });

        document.querySelector('#habitModal .modal-overlay')?.addEventListener('click', () => {
            this.closeHabitModal();
        });

        // Habit form submission
        document.getElementById('habitForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveHabit();
        });

        // Color picker
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Frequency selector
        document.querySelectorAll('.frequency-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.frequency-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Delete modal handlers
        document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
            this.confirmDelete();
        });

        document.querySelector('#deleteModal .modal-overlay')?.addEventListener('click', () => {
            this.closeDeleteModal();
        });
    },

    /**
     * Set up navigation
     */
    setupNavigation() {
        // Sidebar navigation
        document.querySelectorAll('.sidebar .nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view);
                
                // Close mobile menu
                document.getElementById('sidebar')?.classList.remove('active');
            });
        });

        // Bottom navigation (mobile)
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view);
            });
        });
    },

    /**
     * Switch between views
     */
    switchView(viewName) {
        this.currentView = viewName;

        // Update active states
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });

        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });

        // Show/hide views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(viewName + 'View');
        if (targetView) {
            targetView.classList.add('active');
        }

        // Render appropriate content
        switch(viewName) {
            case 'tracker':
                Tracker.renderDailyTracker();
                break;
            case 'calendar':
                Calendar.updateHabitSelector();
                Calendar.renderCalendar();
                break;
            case 'analytics':
                Analytics.renderAnalytics();
                break;
            case 'habits':
                this.renderManageHabits();
                break;
        }
    },

    /**
     * Set up modal configurations
     */
    setupModals() {
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeHabitModal();
                this.closeDeleteModal();
            }
        });
    },

    /**
     * Open habit modal for adding/editing
     */
    openHabitModal(habitId = null) {
        const modal = document.getElementById('habitModal');
        const form = document.getElementById('habitForm');
        const title = document.getElementById('modalTitle');
        
        form.reset();
        
        if (habitId) {
            // Edit mode
            const habit = Habits.getHabitById(habitId);
            if (!habit) return;
            
            title.textContent = 'Edit Habit';
            document.getElementById('habitId').value = habit.id;
            document.getElementById('habitName').value = habit.name;
            document.getElementById('habitIcon').value = habit.icon;
            
            // Select color
            document.querySelectorAll('.color-option').forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.color === habit.color);
            });
            
            // Select frequency
            document.querySelectorAll('.frequency-option').forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.frequency === habit.frequency);
            });
        } else {
            // Add mode
            title.textContent = 'Add New Habit';
            document.getElementById('habitId').value = '';
            
            // Set defaults
            document.querySelector('.color-option[data-color="#845EC2"]')?.classList.add('selected');
            document.querySelector('.frequency-option[data-frequency="daily"]')?.classList.add('selected');
        }
        
        modal.classList.add('active');
        document.getElementById('habitName').focus();
    },

    /**
     * Close habit modal
     */
    closeHabitModal() {
        document.getElementById('habitModal')?.classList.remove('active');
    },

    /**
     * Save habit from modal form
     */
    saveHabit() {
        const habitId = document.getElementById('habitId').value;
        const name = document.getElementById('habitName').value.trim();
        const icon = document.getElementById('habitIcon').value || '📌';
        const color = document.querySelector('.color-option.selected')?.dataset.color || '#845EC2';
        const frequency = document.querySelector('.frequency-option.selected')?.dataset.frequency || 'daily';

        if (!name) {
            alert('Please enter a habit name');
            return;
        }

        if (habitId) {
            // Update existing habit
            Habits.updateHabit(habitId, { name, icon, color, frequency });
        } else {
            // Create new habit
            Habits.createHabit(name, color, icon, frequency);
        }

        this.closeHabitModal();
        
        // Refresh current view
        this.switchView(this.currentView);
    },

    /**
     * Render manage habits view
     */
    renderManageHabits() {
        const container = document.getElementById('manageHabitsList');
        const habits = Habits.getHabits();

        if (habits.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚙️</div>
                    <div class="empty-state-text">No habits to manage</div>
                    <p style="text-align: center; margin-top: 1rem;"><button id="btnDeleteAllEmpty" class="btn btn-secondary" style="font-size: 0.8rem;">Reset All Data</button></p>
                </div>
            `;
            // Add listener for empty state button
            setTimeout(() => {
                document.getElementById('btnDeleteAllEmpty')?.addEventListener('click', () => this.confirmDeleteAll());
            }, 0);
            return;
        }

        container.innerHTML = habits.map((habit, index) => `
            <div class="manage-habit-item" data-habit-id="${habit.id}">
                <div class="habit-icon" style="background-color: ${habit.color}20; color: ${habit.color};">
                    ${habit.icon}
                </div>
                <div class="habit-details">
                    <div class="habit-name">${habit.name}</div>
                    <div class="habit-meta">
                        <span>${habit.frequency}</span>
                        <span>Created ${new Date(habit.createdDate).toLocaleDateString()}</span>
                        <span>${habit.completedDates.length} completions</span>
                    </div>
                </div>
                <div class="habit-actions">
                    ${index > 0 ? '<button class="btn-icon-only btn-move-up" title="Move up">⬆️</button>' : ''}
                    ${index < habits.length - 1 ? '<button class="btn-icon-only btn-move-down" title="Move down">⬇️</button>' : ''}
                    <button class="btn-icon-only btn-edit" title="Edit">✏️</button>
                    <button class="btn-icon-only btn-delete danger" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('') + `
            <div style="margin-top: 2rem; text-align: center; border-top: 1px solid var(--border-color); padding-top: 2rem;">
                <button id="btnDeleteAll" class="btn btn-danger">Delete All Habits</button>
            </div>
        `;

        // Attach event handlers
        container.querySelectorAll('.btn-edit').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.manage-habit-item');
                const habitId = item.dataset.habitId;
                this.openHabitModal(habitId);
            });
        });

        container.querySelectorAll('.btn-delete').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.manage-habit-item');
                const habitId = item.dataset.habitId;
                this.openDeleteModal(habitId);
            });
        });

        container.querySelectorAll('.btn-move-up').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.manage-habit-item');
                const habitId = item.dataset.habitId;
                Habits.reorderHabits(habitId, 'up');
                this.renderManageHabits();
            });
        });

        container.querySelectorAll('.btn-move-down').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.manage-habit-item');
                const habitId = item.dataset.habitId;
                Habits.reorderHabits(habitId, 'down');
                this.renderManageHabits();
            });
        });

        // Delete All handler
        document.getElementById('btnDeleteAll')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete ALL habits? This cannot be undone.')) {
                this.confirmDeleteAll();
            }
        });
    },

    /**
     * Delete ALL habits
     */
    confirmDeleteAll() {
        const habits = Habits.getHabits();
        habits.forEach(h => Habits.deleteHabit(h.id));
        this.switchView('habits');
        alert('All habits deleted.');
    },

    /**
     * Open delete confirmation modal
     */
    openDeleteModal(habitId) {
        const habit = Habits.getHabitById(habitId);
        if (!habit) return;

        document.getElementById('deleteHabitId').value = habitId;
        document.getElementById('deleteHabitName').textContent = habit.name;
        document.getElementById('deleteModal').classList.add('active');
    },

    /**
     * Close delete modal
     */
    closeDeleteModal() {
        document.getElementById('deleteModal')?.classList.remove('active');
    },

    /**
     * Confirm and execute delete
     */
    confirmDelete() {
        const habitId = document.getElementById('deleteHabitId').value;
        Habits.deleteHabit(habitId);
        this.closeDeleteModal();
        this.switchView(this.currentView);
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
