/**
 * Analytics Module - Statistics and chart generation
 */

const Analytics = {
    /**
     * Calculate weekly completion rate
     */
    calculateWeeklyProgress() {
        const habits = Habits.getHabits();
        if (habits.length === 0) return 0;

        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 6); // Last 7 days including today

        let totalPossible = 0;
        let totalCompleted = 0;

        for (let d = new Date(weekAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().split('T')[0];
            
            habits.forEach(habit => {
                totalPossible++;
                if (habit.completedDates.includes(dateString)) {
                    totalCompleted++;
                }
            });
        }

        return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    },

    /**
     * Calculate monthly completion rate
     */
    calculateMonthlyProgress() {
        const habits = Habits.getHabits();
        if (habits.length === 0) return 0;

        const today = new Date();
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 29); // Last 30 days

        let totalPossible = 0;
        let totalCompleted = 0;

        for (let d = new Date(monthAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().split('T')[0];
            
            habits.forEach(habit => {
                totalPossible++;
                if (habit.completedDates.includes(dateString)) {
                    totalCompleted++;
                }
            });
        }

        return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    },

    /**
     * Get weekly completion data for chart
     */
    getWeeklyData() {
        const habits = Habits.getHabits();
        const data = [];
        const labels = [];
        
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            labels.push(dayName);
            
            let completedCount = 0;
            habits.forEach(habit => {
                if (habit.completedDates.includes(dateString)) {
                    completedCount++;
                }
            });
            
            const percentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
            data.push(percentage);
        }
        
        return { labels, data };
    },

    /**
     * Draw bar chart on canvas
     */
    drawWeeklyChart() {
        const canvas = document.getElementById('weeklyChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { labels, data } = this.getWeeklyData();
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const barWidth = chartWidth / labels.length - 10;
        
        // Get colors
        const isDark = document.body.classList.contains('dark-theme');
        const barColor = isDark ? '#9d7ce8' : '#845EC2';
        const textColor = isDark ? '#e4e6eb' : '#2c3e50';
        const gridColor = isDark ? '#2a2d3a' : '#e0e6ed';
        
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillStyle = textColor;
        
        // Draw grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
            
            // Y-axis labels
            const value = 100 - (i * 25);
            ctx.fillText(value + '%', 5, y + 4);
        }
        
        // Draw bars
        data.forEach((value, index) => {
            const x = padding + (index * (chartWidth / labels.length)) + 5;
            const barHeight = (value / 100) * chartHeight;
            const y = padding + chartHeight - barHeight;
            
            // Draw bar
            ctx.fillStyle = barColor;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw label
            ctx.fillStyle = textColor;
            ctx.fillText(labels[index], x + barWidth / 2 - 10, canvas.height - padding + 20);
        });
    },

    /**
     * Render habit performance bars
     */
    renderHabitPerformance() {
        const container = document.getElementById('habitPerformance');
        const habits = Habits.getHabits();
        
        if (habits.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No habits to display</p>';
            return;
        }
        
        // Calculate completion rate for each habit (last 30 days)
        const habitStats = habits.map(habit => {
            const today = new Date();
            const monthAgo = new Date(today);
            monthAgo.setDate(monthAgo.getDate() - 29);
            
            let possibleDays = 0;
            let completedDays = 0;
            
            for (let d = new Date(monthAgo); d <= today; d.setDate(d.getDate() + 1)) {
                possibleDays++;
                const dateString = d.toISOString().split('T')[0];
                if (habit.completedDates.includes(dateString)) {
                    completedDays++;
                }
            }
            
            const percentage = possibleDays > 0 ? Math.round((completedDays / possibleDays) * 100) : 0;
            
            return {
                name: habit.name,
                icon: habit.icon,
                color: habit.color,
                percentage
            };
        });
        
        // Sort by percentage
        habitStats.sort((a, b) => b.percentage - a.percentage);
        
        container.innerHTML = habitStats.map(stat => `
            <div class="performance-bar">
                <div class="performance-label">${stat.icon} ${stat.name}</div>
                <div class="performance-track">
                    <div class="performance-fill" style="width: ${stat.percentage}%; background: ${stat.color};"></div>
                </div>
                <div class="performance-value">${stat.percentage}%</div>
            </div>
        `).join('');
    },

    /**
     * Get monthly trend data
     */
    getTrendData() {
        const habits = Habits.getHabits();
        const data = [];
        const labels = [];
        
        const today = new Date();
        
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            if (i % 5 === 0) { // Keep labels sparse
                const dayLabel = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                labels.push(dayLabel);
            } else {
                labels.push('');
            }
            
            let completedCount = 0;
            habits.forEach(habit => {
                if (habit.completedDates.includes(dateString)) {
                    completedCount++;
                }
            });
            
            const percentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
            data.push(percentage);
        }
        
        return { labels, data };
    },

    /**
     * Draw Pie Chart for Habit Distribution
     */
    drawPieChart() {
        const canvas = document.getElementById('distributionPieChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const habits = Habits.getHabits();
        const legendContainer = document.getElementById('pieChartLegend');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        legendContainer.innerHTML = ''; // Clear legend

        const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);

        if (totalCompletions === 0) {
            ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#8b949e' : '#90a4ae';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        let startAngle = 0;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        habits.forEach(habit => {
            const count = habit.completedDates.length;
            if (count === 0) return;

            const sliceAngle = (count / totalCompletions) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = habit.color;
            ctx.fill();
            
            // Draw border
            ctx.lineWidth = 2;
            ctx.strokeStyle = document.body.classList.contains('dark-theme') ? '#0f1629' : '#ffffff';
            ctx.stroke();

            startAngle += sliceAngle;

            // Add to legend
            const percentage = Math.round((count / totalCompletions) * 100);
            legendContainer.innerHTML += `
                <div class="legend-item" style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 0.9rem;">
                    <span style="display:block; width: 12px; height: 12px; border-radius: 2px; background-color: ${habit.color};"></span>
                    <span>${habit.icon} ${habit.name} (${percentage}%)</span>
                </div>
            `;
        });
    },

    /**
     * Draw Line Chart for Monthly Trend
     */
    drawTrendChart() {
        const canvas = document.getElementById('monthlyTrendChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { labels, data } = this.getTrendData();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        
        const isDark = document.body.classList.contains('dark-theme');
        const lineColor = '#4ECDC4'; // Teal/Cyan
        const pointColor = '#FF6B6B'; // Red/Orange accent
        const gridColor = isDark ? '#2a2d3a' : '#e0e6ed';
        const textColor = isDark ? '#8b949e' : '#90a4ae';

        // Draw Grid
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = '10px sans-serif';

        // Horizontal grid lines & Y-axis labels
        for(let i=0; i<=4; i++) {
            const y = padding + (i * (chartHeight / 4));
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
            
            // Label
            ctx.fillText(`${100 - (i*25)}%`, padding - 5, y);
        }

        // Draw Line
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 3;
        
        const stepX = chartWidth / (data.length - 1);
        
        data.forEach((value, index) => {
            const x = padding + (index * stepX);
            const y = padding + chartHeight - ((value / 100) * chartHeight);
            
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw Points & Labels
        ctx.fillStyle = pointColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        data.forEach((value, index) => {
            const x = padding + (index * stepX);
            const y = padding + chartHeight - ((value / 100) * chartHeight);
            
            // Draw point
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Draw X-axis label
            if (labels[index]) {
                ctx.fillStyle = textColor;
                ctx.fillText(labels[index], x, canvas.height - padding + 5);
                ctx.fillStyle = pointColor; // Reset for next point
            }
        });
    },

    /**
     * Render all analytics
     */
    renderAnalytics() {
        const habits = Habits.getHabits();
        const longestStreak = Streaks.getOverallLongestStreak();
        const weeklyProgress = this.calculateWeeklyProgress();
        const monthlyProgress = this.calculateMonthlyProgress();
        
        // Update stat cards
        document.getElementById('totalHabits').textContent = habits.length;
        document.getElementById('longestStreak').textContent = longestStreak + ' days';
        document.getElementById('weeklyProgress').textContent = weeklyProgress + '%';
        document.getElementById('monthlyProgress').textContent = monthlyProgress + '%';
        
        // Draw charts
        this.drawWeeklyChart();
        this.renderHabitPerformance();
        this.drawPieChart();
        this.drawTrendChart();
        
        // Render AI Insights
        if (typeof Insights !== 'undefined') {
            Insights.renderInsights();
        }
    }
};
