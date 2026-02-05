/**
 * Insights Module - AI-powered data analysis and smart suggestions
 */

const Insights = {
    /**
     * Analyze habit patterns to find best/worst days
     */
    getDayCorrelation() {
        const habits = Habits.getHabits();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts = new Array(7).fill(0);
        const dayPossible = new Array(7).fill(0);

        habits.forEach(habit => {
            // Count total possible days since creation
            const created = new Date(habit.createdDate);
            const today = new Date();
            
            // Iterate through completed dates
            habit.completedDates.forEach(dateStr => {
                const date = new Date(dateStr);
                dayCounts[date.getDay()]++;
            });

            // Estimate total possible days (simplified)
            // Ideally we'd iterate every day since creation, but for "patterns" 
            // relative frequency is enough.
        });

        // Find best and worst days based on raw completion volume
        const max = Math.max(...dayCounts);
        const min = Math.min(...dayCounts);
        
        const bestDay = days[dayCounts.indexOf(max)];
        const worstDay = days[dayCounts.indexOf(min)];

        return { bestDay, worstDay, dayCounts };
    },

    /**
     * Calculate success probability for a habit
     * Based on: Consistency (overall %) + Momentum (current streak)
     */
    getSuccessProbability(habit) {
        if (!habit.completedDates.length) return 0;

        const today = new Date();
        const created = new Date(habit.createdDate);
        const totalDays = Math.ceil((today - created) / (1000 * 60 * 60 * 24)) || 1;
        
        const consistency = habit.completedDates.length / totalDays;
        const currentStreak = Streaks.calculateCurrentStreak(habit.completedDates);
        
        // Algorithm: 60% consistency, 40% streak momentum
        // Cap streak bonus at 100% (e.g. 21 days is generally considered habit formation)
        const streakScore = Math.min(currentStreak / 21, 1);
        
        const probability = (consistency * 0.6) + (streakScore * 0.4);
        return Math.round(probability * 100);
    },

    /**
     * Generate smart tips based on data
     */
    generateTips() {
        const habits = Habits.getHabits();
        const tips = [];
        const { bestDay, worstDay } = this.getDayCorrelation();
        
        if (habits.length === 0) return ['Start by adding your first habit!'];

        // 1. Day Correlation Tip
        tips.push(`🔥 You are most active on **${bestDay}s**. Keep it up!`);
        if (bestDay !== worstDay) {
            tips.push(`💡 You tend to miss habits on **${worstDay}s**. Try setting a reminder?`);
        }

        // 2. Struggle Detection (Completion < 40%)
        const struggles = habits.filter(h => this.getSuccessProbability(h) < 40);
        if (struggles.length > 0) {
            const name = struggles[0].name;
            tips.push(`📉 **${name}** seems tough lately. Maybe try reducing the frequency or target?`);
        }

        // 3. High Consistency (Promotion)
        const stars = habits.filter(h => this.getSuccessProbability(h) > 85);
        if (stars.length > 0) {
            tips.push(`⭐ You're crushing **${stars[0].name}**! Have you considered increasing the difficulty?`);
        }

        // 4. Weekend Warrior Check
        // (If sat/sun are high but mon-fri low - complex logic omitted for MVP)

        return tips;
    },

    /**
     * Render Insights Widget
     */
    renderInsights() {
        const container = document.getElementById('insightsWidget');
        if (!container) return;

        const tips = this.generateTips();
        const habits = Habits.getHabits();
        
        let riskHtml = '';
        if (habits.length > 0) {
             const atRisk = habits
                .map(h => ({ ...h, score: this.getSuccessProbability(h) }))
                .sort((a, b) => a.score - b.score)
                .slice(0, 3); // Bottom 3

            riskHtml = `
                <div class="insight-section">
                    <h4 class="insight-subtitle">Needs Attention ⚠️</h4>
                    <div class="risk-list">
                        ${atRisk.map(h => `
                            <div class="risk-item">
                                <span class="risk-name">${h.icon} ${h.name}</span>
                                <div class="risk-bar-container">
                                    <div class="risk-bar" style="width: ${h.score}%; background: ${h.score < 30 ? 'var(--danger)' : 'var(--warning)'}"></div>
                                </div>
                                <span class="risk-score">${h.score}% Success Probability</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="insight-card">
                <div class="insight-header">
                    <h3 class="insight-title">🤖 AI Smart Insights</h3>
                    <span class="insight-badge">BETA</span>
                </div>
                
                <div class="insight-content">
                    <div class="insight-section">
                        <h4 class="insight-subtitle">Smart Tips 💡</h4>
                        <ul class="tips-list">
                            ${tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                    ${riskHtml}
                </div>
            </div>
        `;
    }
};
