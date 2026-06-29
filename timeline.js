// ===================================
// إدارة الخط الزمني
// ===================================
const TimelineManager = {
    init() {
        this.setupEventListeners();
        this.renderTimeline();
    },
    
    setupEventListeners() {
        document.getElementById('add-timeline-event-btn')?.addEventListener('click', () => this.addEvent());
    },
    
    addEvent() {
        const title = prompt('أدخل عنوان الحدث:');
        if (!title) return;
        
        const event = {
            id: this.generateId(),
            title: title,
            date: new Date().toISOString(),
            description: '',
            createdAt: new Date().toISOString()
        };
        
        AppState.timelines.push(event);
        Storage.saveAll();
        this.renderTimeline();
        Notifications.show('تم إضافة الحدث', 'success');
    },
    
    renderTimeline() {
        const container = document.getElementById('timeline-events');
        if (!container) return;
        
        const sortedEvents = [...AppState.timelines].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        container.innerHTML = sortedEvents.map(event => `
            <div class="timeline-event">
                <div class="timeline-event-date">${new Date(event.date).toLocaleDateString('ar-EG')}</div>
                <div class="timeline-event-content">
                    <h4>${event.title}</h4>
                    <p>${event.description || 'لا يوجد وصف'}</p>
                </div>
            </div>
        `).join('');
        
        // رسم الخط الزمني
        this.drawTimeline();
    },
    
    drawTimeline() {
        const canvas = document.getElementById('timeline-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        
        ctx.clearRect(0, 0, width, height);
        
        // رسم الخط الرئيسي
        ctx.strokeStyle = '#6F4E37';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, height / 2);
        ctx.lineTo(width - 50, height / 2);
        ctx.stroke();
        
        // رسم الأحداث
        const events = AppState.timelines;
        const stepX = (width - 100) / (events.length + 1);
        
        events.forEach((event, index) => {
            const x = 50 + (index + 1) * stepX;
            const y = height / 2;
            
            // دائرة الحدث
            ctx.fillStyle = '#6F4E37';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // تسمية
            ctx.fillStyle = '#333';
            ctx.font = '12px Cairo';
            ctx.textAlign = 'center';
            ctx.fillText(event.title.substring(0, 10), x, y - 15);
        });
    },
    
    generateId() {
        return 'event_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};