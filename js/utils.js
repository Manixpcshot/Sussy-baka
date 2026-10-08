// =====================================
// توابع کمکی و ابزارهای عمومی
// Sussy Baka v4.0
// =====================================

const Utils = {
    // فرمت تاریخ فارسی
    formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(date).toLocaleDateString('fa-IR', options);
    },

    // فرمت اعداد با جداکننده
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // تولید ID یونیک
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // محاسبه درصد
    calculatePercentage(value, total) {
        return total === 0 ? 0 : Math.round((value / total) * 100);
    },

    // تاخیر (delay)
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // کپی به کلیپبورد
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('خطا در کپی:', err);
            return false;
        }
    },

    // نمایش نوتیفیکیشن
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: var(--primary-gradient);
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-family: Vazirmatn, sans-serif;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },

    // ذخیره در localStorage با فشرده‌سازی
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (err) {
            console.error('خطا در ذخیره:', err);
            return false;
        }
    },

    // بارگذاری از localStorage
    loadFromLocalStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (err) {
            console.error('خطا در بارگذاری:', err);
            return defaultValue;
        }
    },

    // حذف از localStorage
    removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (err) {
            console.error('خطا در حذف:', err);
            return false;
        }
    },

    // دانلود فایل JSON
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    // شافل آرایه
    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // تولید رنگ تصادفی
    randomColor() {
        return `hsl(${Math.random() * 360}, 70%, 60%)`;
    },

    // اعتبارسنجی ایمیل
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // محاسبه زمان گذشته
    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            'سال': 31536000,
            'ماه': 2592000,
            'روز': 86400,
            'ساعت': 3600,
            'دقیقه': 60,
            'ثانیه': 1
        };
        for (const [name, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `${interval} ${name} پیش`;
            }
        }
        return 'همین الان';
    }
};

// Export برای استفاده در سایر ماژول‌ها
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
