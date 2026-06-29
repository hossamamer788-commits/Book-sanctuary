// ===================================
// إدارة الحبكات
// ===================================
const PlotsManager = {
    init() {
        this.setupEventListeners();
        this.renderPlots();
    },
    
    setupEventListeners() {
        document.getElementById('add-plot-btn')?.addEventListener('click', () => this.addPlot());
    },
    
    addPlot() {
        const name = prompt('أدخل اسم الحبكة:');
        if (!name) return;
        
        const plot = {
            id: this.generateId(),
            name: name,
            type: 'main',
            elements: {
                exposition: '',
                risingAction: '',
                climax: '',
                fallingAction: '',
                resolution: ''
            },
            createdAt: new Date().toISOString()
        };
        
        AppState.plots.push(plot);
        Storage.saveAll();
        this.renderPlots();
        Notifications.show('تم إضافة الحبكة', 'success');
    },
    
    renderPlots() {
        const container = document.getElementById('plots-list');
        if (!container) return;
        
        container.innerHTML = AppState.plots.map(plot => `
            <div class="plot-card" data-id="${plot.id}">
                <h4>${plot.name}</h4>
                <span class="place-type">${plot.type === 'main' ? 'حبكة رئيسية' : 'حبكة فرعية'}</span>
                <div class="plot-elements">
                    <span class="plot-element">العقدة</span>
                    <span class="plot-element">الذروة</span>
                    <span class="plot-element">الحل</span>
                </div>
            </div>
        `).join('');
    },
    
    generateId() {
        return 'plot_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};