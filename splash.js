// ===================================
// شاشة البداية
// ===================================
const SplashScreen = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    
    init() {
        this.canvas = document.getElementById('splash-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        
        // إخفاء شاشة البداية بعد 3 ثواني
        setTimeout(() => this.hide(), 3000);
    },
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    createParticles() {
        const colors = ['#6F4E37', '#A67B5B', '#C4A484', '#E8D5C4', '#F5EBE0'];
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 1,
                speedX: (Math.random() - 0.5) * 2,
                speedY: -Math.random() * 2 - 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.y < -10) {
                particle.y = this.canvas.height + 10;
                particle.x = Math.random() * this.canvas.width;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    hide() {
        cancelAnimationFrame(this.animationId);
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        splash.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('app').classList.remove('hidden');
            App.init();
        }, 500);
    }
};