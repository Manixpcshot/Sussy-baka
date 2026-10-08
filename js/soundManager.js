// =====================================
// مدیریت صدا با Web Audio API
// Sussy Baka v4.0
// =====================================

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.5;
        this.init();
    }

    // راه‌اندازی
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API پشتیبانی نمی‌شود');
        }
    }

    // تولید صدا
    playSound(type) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        gainNode.gain.value = this.volume;

        switch (type) {
            case 'click':
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;

            case 'win':
                this.playMelody([523, 659, 784, 1047], [0.1, 0.2, 0.3, 0.5]);
                break;

            case 'lose':
                this.playMelody([392, 330, 294, 247], [0.1, 0.2, 0.3, 0.5]);
                break;

            case 'draw':
                oscillator.frequency.value = 440;
                oscillator.type = 'triangle';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;

            case 'levelup':
                this.playMelody([523, 659, 784, 1047, 1319], [0, 0.1, 0.2, 0.3, 0.5]);
                break;

            case 'achievement':
                this.playMelody([1047, 1319, 1568], [0, 0.1, 0.3]);
                break;

            case 'error':
                oscillator.frequency.value = 200;
                oscillator.type = 'sawtooth';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;

            default:
                oscillator.frequency.value = 440;
                oscillator.type = 'sine';
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
        }
    }

    // پخش ملودی
    playMelody(frequencies, timings) {
        if (!this.enabled || !this.audioContext) return;

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                gainNode.gain.value = this.volume;
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
            }, timings[index] * 1000);
        });
    }

    // تنظیم حجم صدا
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    // فعال/غیرفعال کردن صدا
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // تنظیم وضعیت صدا
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    // دریافت وضعیت
    isEnabled() {
        return this.enabled;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}
