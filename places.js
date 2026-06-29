// ===================================
// إدارة الأماكن
// ===================================
const PlacesManager = {
    init() {
        this.setupEventListeners();
        this.renderPlaces();
    },
    
    setupEventListeners() {
        document.getElementById('add-place-btn')?.addEventListener('click', () => this.addPlace());
        
        document.querySelectorAll('.world-building-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.world-building-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },
    
    addPlace() {
        const name = prompt('أدخل اسم المكان:');
        if (!name) return;
        
        const place = {
            id: this.generateId(),
            name: name,
            type: 'city',
            description: '',
            createdAt: new Date().toISOString()
        };
        
        AppState.places.push(place);
        Storage.saveAll();
        this.renderPlaces();
        Notifications.show('تم إضافة المكان', 'success');
    },
    
    renderPlaces() {
        const container = document.getElementById('places-list');
        if (!container) return;
        
        container.innerHTML = AppState.places.map(place => `
            <div class="place-card" data-id="${place.id}">
                <span class="place-type">${this.getTypeName(place.type)}</span>
                <h4>${place.name}</h4>
                <p>${place.description?.substring(0, 80) || 'لا يوجد وصف'}</p>
            </div>
        `).join('');
    },
    
    getTypeName(type) {
        const names = {
            'continent': 'قارة',
            'country': 'دولة',
            'city': 'مدينة',
            'village': 'قرية',
            'building': 'مبنى'
        };
        return names[type] || type;
    },
    
    generateId() {
        return 'place_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};