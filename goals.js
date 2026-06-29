// ===================================
// إدارة الأهداف
// ===================================
const GoalsManager = {
    currentPeriod: 'daily',
    
    init() {
        this.setupEventListeners();
        this.renderGoals();
    },
    
    setupEventListeners() {
        document.getElementById('add-goal-btn')?.addEventListener('click', () => this.addGoal());
        
        document.querySelectorAll('.goals-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.goals-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPeriod = btn.dataset.period;
                this.renderGoals();
            });
        });
    },
    
    addGoal() {
        const target = prompt('أدخل هدف عدد الكلمات:', '1000');
        if (!target) return;
        
        const goal = {
            id: this.generateId(),
            period: this.currentPeriod,
            target: parseInt(target),
            completed: 0,
            targetDate: this.getTargetDate(this.currentPeriod),
            createdAt: new Date().toISOString()
        };
        
        AppState.goals.push(goal);
        Storage.saveAll();
        this.renderGoals();
        Notifications.show('تم إضافة الهدف', 'success');
    },
    
    getTargetDate(period) {
        const date = new Date();
        if (period === 'daily') {
            return date.toDateString();
        } else if (period === 'weekly') {
            // بداية الأسبوع
            const day = date.getDay();
            date.setDate(date.getDate() - day);
            return date.toDateString();
        } else {
            // بداية الشهر
            return new Date(date.getFullYear(), date.getMonth(), 1).toDateString();
        }
    },
    
    renderGoals() {
        const container = document.getElementById('goals-list');
        if (!container) return;
        
        const goals = AppState.goals.filter(g => g.period === this.currentPeriod);
        
        container.innerHTML = goals.map(goal => {
            const percentage = Math.min((goal.completed / goal.target) * 100, 100);
            return `
                <div class="goal-item">
                    <div class="goal-info">
                        <h4>هدف ${this.getPeriodName(goal.period)}</h4>
                        <p>${goal.completed} / ${goal.target} كلمة</p>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    getPeriodName(period) {
        const names = {
            'daily': 'يومي',
            'weekly': 'أسبوعي',
            'monthly': 'شهري'
        };
        return names[period] || period;
    },
    
    generateId() {
        return 'goal_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // --- إضافة: تحديث تقدم الأهداف بناءً على الكلمات المكتوبة اليوم ---
    updateProgress() {
        const today = new Date().toDateString();
        const dailyGoals = AppState.goals.filter(g => g.period === 'daily' && g.targetDate === today);
        if (dailyGoals.length === 0) return;
        const totalWordsToday = StatisticsManager.calculateDailyWords();
        dailyGoals.forEach(goal => {
            goal.completed = Math.min(totalWordsToday, goal.target);
        });
        Storage.saveAll();
        this.renderGoals();
        // تحديث لوحة التحكم
        ProjectManager.updateDailyGoals();
    }
};