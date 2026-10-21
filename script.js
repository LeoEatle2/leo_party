// 万圣节倒计时功能
class NeonCountdownTimer {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate);
        this.init();
    }

    init() {
        this.update();
        setInterval(() => this.update(), 1000);
        this.addNeonEffects();
    }

    update() {
        const now = new Date();
        const diff = this.targetDate - now;

        if (diff <= 0) {
            this.display(0, 0, 0, 0);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        this.display(days, hours, minutes, seconds);
    }

    display(days, hours, minutes, seconds) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        Object.entries(elements).forEach(([key, element]) => {
            const value = { days, hours, minutes, seconds }[key];
            const newValue = String(value).padStart(2, '0');

            if (element.textContent !== newValue) {
                element.textContent = newValue;
            }
        });
    }

    addNeonEffects() {
        // 已移除倒计时方框的发光特效
        // 此方法现在为空，不再添加任何发光效果
    }
}

// 万圣节浮动效果
class NeonFloatingEffect {
    constructor() {
        this.geoElements = document.querySelectorAll('.floating-geo');
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleMouseMove(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        this.geoElements.forEach((element, index) => {
            const speed = 0.5 + index * 0.2;
            const moveX = mouseX * speed * 30;
            const moveY = mouseY * speed * 30;

            element.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${Date.now() * 0.01}deg)`;
        });
    }
}

// 万圣节表单处理
class NeonRSVPForm {
    constructor() {
        this.form = document.getElementById('rsvp-form');
        this.successMessage = document.getElementById('success-message');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.addInputEffects();
    }

    addInputEffects() {
        const input = document.getElementById('name');
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value.length > 0) {
                e.target.style.textShadow = '0 0 10px #ff7518';
            } else {
                e.target.style.textShadow = 'none';
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();

        if (!name) {
            this.showError('请输入你的鬼怪代号');
            return;
        }

        // 提交动画
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        button.textContent = '召唤中...';
        button.style.animation = 'pulse 0.5s ease-in-out infinite';
        button.disabled = true;

        try {
            // 调用真实的webhook接口
            const response = await fetch('https://www.kdocs.cn/chatflow/api/v2/func/webhook/30i79TuVmCowEqq1iiwSN3Lhlff', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'raw',
                    'Origin': 'www.kdocs.cn'
                },
                body: JSON.stringify({
                    name: name,
                })
            });

            console.log('Webhook响应:', response);

            // 成功效果
            this.form.style.transform = 'scale(0.9)';
            this.form.style.opacity = '0';

            setTimeout(() => {
                this.form.style.display = 'none';
                this.successMessage.classList.remove('hidden');
                this.successMessage.style.animation = 'fadeInUp 0.5s ease-out';
            }, 300);

            // 保存到本地存储
            const attendees = JSON.parse(localStorage.getItem('leo-party-attendees') || '[]');
            attendees.push({
                name,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('leo-party-attendees', JSON.stringify(attendees));

            // 添加庆祝效果
            this.addCelebrationEffect();

        } catch (error) {
            console.error('Webhook调用失败:', error);
            this.showError('网络连接失败，请稍后重试');

            // 重置按钮状态
            button.textContent = originalText;
            button.style.animation = 'none';
            button.disabled = false;
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-purple-400 text-sm mt-2 text-center';
        errorDiv.textContent = message;

        this.form.appendChild(errorDiv);
        setTimeout(() => {
            errorDiv.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    addCelebrationEffect() {
        // 创建万圣节粒子效果
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = ['#ff7518', '#9d4edd', '#39ff14'][Math.floor(Math.random() * 3)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight / 2 + 'px';
            particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;

            document.body.appendChild(particle);

            const animation = particle.animate([
                { transform: 'translateY(0px) scale(1)', opacity: 1 },
                { transform: `translateY(-${Math.random() * 200 + 100}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'ease-out'
            });

            animation.onfinish = () => particle.remove();
        }
    }
}

// motto.js风格的标题动画
class MottoTextAnimation {
    constructor() {
        this.targetText = "LEO'S HALLOWEEN";
        this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        this.element = document.getElementById('main-title');
        this.init();
    }

    init() {
        this.animateTitle();
        this.addEnhancedGlitch();
    }

    animateTitle() {
        let iterations = 0;
        const interval = setInterval(() => {
            this.element.textContent = this.targetText
                .split("")
                .map((char, index) => {
                    if (index < iterations) {
                        return this.targetText[index];
                    }
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join("");

            iterations += 1/3;
            if (iterations >= this.targetText.length) {
                clearInterval(interval);
                this.element.textContent = this.targetText;
            }
        }, 50);
    }


    addEnhancedGlitch() {
        // 添加随机字符闪烁
        setInterval(() => {
            if (Math.random() > 0.7) {
                const originalText = this.element.textContent;
                const randomIndex = Math.floor(Math.random() * originalText.length);
                const randomChar = this.chars[Math.floor(Math.random() * this.chars.length)];

                const glitchedText = originalText.substring(0, randomIndex) +
                                   randomChar +
                                   originalText.substring(randomIndex + 1);

                this.element.textContent = glitchedText;

                setTimeout(() => {
                    this.element.textContent = originalText;
                }, 100);
            }
        }, 500);
    }
}

// 增强的glitch效果管理器
class EnhancedGlitchManager {
    constructor() {
        this.init();
    }

    init() {
        this.addTextGlitch();
    }

    addTextGlitch() {
        // 为所有文本添加随机故障
        const textElements = document.querySelectorAll('p, h2, h3, span:not(#main-title)');
        textElements.forEach(element => {
            setInterval(() => {
                if (Math.random() > 0.95) {
                    element.style.transform = `skew(${Math.random() * 10 - 5}deg)`;
                    element.style.opacity = Math.random() * 0.3 + 0.7;

                    setTimeout(() => {
                        element.style.transform = 'none';
                        element.style.opacity = '1';
                    }, 50);
                }
            }, 1000);
        });
    }
}

// 背景网格动画
class NeonGridAnimation {
    constructor() {
        this.init();
    }

    init() {
        const grid = document.querySelector('.grid-bg');
        if (grid) {
            setInterval(() => {
                grid.style.backgroundPosition = `${Math.sin(Date.now() * 0.001) * 10}px ${Math.cos(Date.now() * 0.001) * 10}px`;
            }, 50);
        }
    }
}

// 页面加载动画
class NeonLoadingAnimation {
    constructor() {
        this.init();
    }

    init() {
        const contentDOM = document.getElementById('content-container');
        const titleDOM = document.getElementById('title-container');

        if (!contentDOM || !titleDOM) {
            console.error('Required DOM elements not found');
            return;
        }

        contentDOM.style.opacity = '0';
        contentDOM.style.filter = 'blur(10px)';

        setTimeout(() => {
            contentDOM.style.transition = 'opacity 1.5s ease, filter 1.5s ease';
            contentDOM.style.opacity = '1';
            contentDOM.style.filter = 'blur(0px)';

            titleDOM.style.position = 'relative';
            titleDOM.style.marginBottom = '30px';

            const mainTitle = document.getElementById('main-title');
            if (mainTitle) {
                mainTitle.style.fontSize = 'smaller';
            }
        }, 3000);

        // 添加雾气扫描效果
        this.addScanlines();
    }

    addScanlines() {
        const scanlines = document.createElement('div');
        scanlines.style.position = 'fixed';
        scanlines.style.top = '0';
        scanlines.style.left = '0';
        scanlines.style.width = '100%';
        scanlines.style.height = '100%';
        scanlines.style.background = 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 117, 24, 0.03) 2px, rgba(255, 117, 24, 0.03) 4px)';
        scanlines.style.pointerEvents = 'none';
        scanlines.style.zIndex = '1000';
        scanlines.style.animation = 'scan 8s linear infinite';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes scan {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100vh); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(scanlines);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 万圣夜 2026年10月31日22:00
    const targetDate = '2026-10-31T22:00:00';

    new NeonLoadingAnimation();
    new NeonCountdownTimer(targetDate);
    new NeonFloatingEffect();
    new NeonRSVPForm();
    new NeonGridAnimation();
    new MottoTextAnimation();
    new EnhancedGlitchManager();
});

// 添加CSS动画
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(additionalStyles);
