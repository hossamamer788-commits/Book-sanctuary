// ===================================
// الإحصائيات والرسوم البيانية
// ===================================
const StatisticsManager = {
    init() {
        this.updateStats();
        this.renderCharts();
    },
    
    updateStats() {
        const totalWords = AppState.projects.reduce((total, p) => {
            return total + (p.chapters?.reduce((cTotal, c) => cTotal + (c.wordCount || 0), 0) || 0);
        }, 0);
        
        const totalPages = Math.ceil(totalWords / 250);
        const totalProjects = AppState.projects.length;
        
        document.getElementById('stats-total-words').textContent = totalWords.toLocaleString();
        document.getElementById('stats-total-pages').textContent = totalPages.toLocaleString();
        document.getElementById('stats-total-projects').textContent = totalProjects;
        
        // إحصائيات أخرى
        document.getElementById('stats-total-characters').textContent = AppState.characters.length;
        document.getElementById('stats-total-places').textContent = AppState.places.length;
    },
    
    renderCharts() {
        this.renderDailyChart();
        this.renderWeeklyChart();
        this.renderDistributionChart();
    },
    
    renderDailyChart() {
        const canvas = document.getElementById('daily-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        
        // بيانات وهمية (يمكن ربطها ببيانات حقيقية)
        const data = [500, 800, 600, 1200, 900, 1500, 1000];
        const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
        
        this.drawBarChart(ctx, width, height, data, days, '#6F4E37');
    },
    
    renderWeeklyChart() {
        const canvas = document.getElementById('weekly-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        
        const data = [5000, 6500, 4800, 7200];
        const labels = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'];
        
        this.drawBarChart(ctx, width, height, data, labels, '#A67B5B');
    },
    
    renderDistributionChart() {
        const canvas = document.getElementById('distribution-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        
        const data = [
            { label: 'فصول', value: 40, color: '#6F4E37' },
            { label: 'ملاحظات', value: 25, color: '#A67B5B' },
            { label: 'شخصيات', value: 20, color: '#C4A484' },
            { label: 'أماكن', value: 15, color: '#E8D5C4' }
        ];
        
        this.drawPieChart(ctx, width, height, data);
    },
    
    drawBarChart(ctx, width, height, data, labels, color) {
        ctx.clearRect(0, 0, width, height);
        
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / data.length - 10;
        const maxValue = Math.max(...data);
        
        // رسم الأعمدة
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + 10) + 5;
            const y = height - padding - barHeight;
            
            // تدرج لوني
            const gradient = ctx.createLinearGradient(x, y, x, height - padding);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, this.lightenColor(color, 40));
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, [5, 5, 0, 0]);
            ctx.fill();
            
            // تسمية
            ctx.fillStyle = '#666';
            ctx.font = '12px Cairo';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index], x + barWidth / 2, height - padding + 15);
            
            // القيمة
            ctx.fillStyle = '#333';
            ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
        });
    },
    
    drawPieChart(ctx, width, height, data) {
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        
        let startAngle = 0;
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        data.forEach(item => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            
            startAngle += sliceAngle;
        });
        
        // легенда
        let legendY = 20;
        data.forEach(item => {
            ctx.fillStyle = item.color;
            ctx.fillRect(10, legendY - 10, 15, 15);
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Cairo';
            ctx.textAlign = 'right';
            ctx.fillText(`${item.label}: ${item.value}%`, width - 10, legendY);
            
            legendY += 25;
        });
    },
    
    lightenColor(color, percent) {
        // تحويل اللون إلى RGB ثم تفتيحه
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    // --- إضافة: حساب الكلمات اليومية ---
    calculateDailyWords() {
        const today = new Date().toDateString();
        let total = 0;
        AppState.projects.forEach(project => {
            if (project.chapters) {
                project.chapters.forEach(chapter => {
                    if (chapter.lastModified && new Date(chapter.lastModified).toDateString() === today) {
                        total += chapter.wordCount || 0;
                    }
                });
            }
        });
        return total;
    },

    // --- إضافة: حساب الكلمات الأسبوعية ---
    calculateWeeklyWords() {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0,0,0,0);
        let total = 0;
        AppState.projects.forEach(project => {
            if (project.chapters) {
                project.chapters.forEach(chapter => {
                    if (chapter.lastModified) {
                        const modDate = new Date(chapter.lastModified);
                        if (modDate >= startOfWeek) {
                            total += chapter.wordCount || 0;
                        }
                    }
                });
            }
        });
        return total;
    },

    // --- إضافة: حساب الكلمات الشهرية ---
    calculateMonthlyWords() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        let total = 0;
        AppState.projects.forEach(project => {
            if (project.chapters) {
                project.chapters.forEach(chapter => {
                    if (chapter.lastModified) {
                        const modDate = new Date(chapter.lastModified);
                        if (modDate >= startOfMonth) {
                            total += chapter.wordCount || 0;
                        }
                    }
                });
            }
        });
        return total;
    }
};