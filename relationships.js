// ===================================
// شبكة العلاقات بين الشخصيات
// ===================================
const RelationshipsGraph = {
    canvas: null,
    ctx: null,
    nodes: [],
    edges: [],
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    
    init() {
        this.canvas = document.getElementById('relationships-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.render();
    },
    
    setupEventListeners() {
        document.getElementById('add-relationship-btn')?.addEventListener('click', () => this.addRelationship());
        document.getElementById('zoom-in-relationships')?.addEventListener('click', () => {
            this.zoom = Math.min(this.zoom * 1.2, 3);
            this.render();
        });
        document.getElementById('zoom-out-relationships')?.addEventListener('click', () => {
            this.zoom = Math.max(this.zoom / 1.2, 0.5);
            this.render();
        });
        
        // السحب والتحريك
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStart = { x: e.clientX - this.offsetX, y: e.clientY - this.offsetY };
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.offsetX = e.clientX - this.dragStart.x;
                this.offsetY = e.clientY - this.dragStart.y;
                this.render();
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    },
    
    addRelationship() {
        if (AppState.characters.length < 2) {
            Notifications.show('يجب وجود شخصيتين على الأقل', 'warning');
            return;
        }
        
        // إضافة عقد للشخصيات
        this.nodes = AppState.characters.map((char, index) => ({
            id: char.id,
            label: char.name,
            x: 200 + (index % 5) * 150,
            y: 150 + Math.floor(index / 5) * 120
        }));
        
        // إضافة علاقات عشوائية للتوضيح
        this.edges = [];
        for (let i = 0; i < this.nodes.length - 1; i++) {
            if (Math.random() > 0.5) {
                this.edges.push({
                    from: this.nodes[i].id,
                    to: this.nodes[i + 1].id,
                    type: ['صديق', 'عدو', 'عائلة'][Math.floor(Math.random() * 3)]
                });
            }
        }
        
        this.render();
        Notifications.show('تم تحديث شبكة العلاقات', 'success');
    },
    
    render() {
        if (!this.canvas || !this.ctx) return;
        
        const width = this.canvas.width = this.canvas.offsetWidth;
        const height = this.canvas.height = this.canvas.offsetHeight;
        
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.zoom, this.zoom);
        
        // رسم العلاقات
        this.edges.forEach(edge => {
            const fromNode = this.nodes.find(n => n.id === edge.from);
            const toNode = this.nodes.find(n => n.id === edge.to);
            
            if (fromNode && toNode) {
                this.ctx.strokeStyle = this.getRelationshipColor(edge.type);
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(fromNode.x, fromNode.y);
                this.ctx.lineTo(toNode.x, toNode.y);
                this.ctx.stroke();
                
                // تسمية العلاقة
                this.ctx.fillStyle = '#666';
                this.ctx.font = '12px Cairo';
                this.ctx.fillText(edge.type, (fromNode.x + toNode.x) / 2, (fromNode.y + toNode.y) / 2 - 5);
            }
        });
        
        // رسم العقد
        this.nodes.forEach(node => {
            // دائرة
            this.ctx.fillStyle = '#6F4E37';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
            this.ctx.fill();
            
            // تسمية
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '12px Cairo';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(node.label.substring(0, 6), node.x, node.y + 4);
        });
        
        this.ctx.restore();
    },
    
    getRelationshipColor(type) {
        const colors = {
            'صديق': '#4CAF50',
            'عدو': '#F44336',
            'عائلة': '#2196F3',
            'حبيب': '#E91E63',
            'قائد': '#FF9800'
        };
        return colors[type] || '#999';
    }
};