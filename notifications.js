// ===================================
// وحدة الإشعارات
// ===================================
const Notifications = {
    show(message, type = 'info') {
        const container = document.getElementById('notifications-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        // إزالة الإشعار بعد 4 ثواني
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    },
    
    getIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
};