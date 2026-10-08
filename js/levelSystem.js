// =====================================
// سیستم Level و XP
// Sussy Baka v4.0
// =====================================

class LevelSystem {
    constructor() {
        this.currentLevel = 1;
        this.currentXP = 0;
        this.totalXP = 0;
        this.maxLevel = 50;
        
        // تعریف عناوین برای هر لول
        this.levelTitles = {
            1: '🌱 مبتدی',
            5: '🎯 بازیکن',
            10: '⚡ ماهر',
            15: '🔥 حرفه‌ای',
            20: '💎 خبره',
            25: '👑 استاد',
            30: '🌟 افسانه',
            35: '⚔️ قهرمان',
            40: '🏆 نابغه',
            45: '👹 غیرقابل شکست',
            50: '🎭 اسطوره'
        };
        
        // XP مورد نیاز برای هر لول
        this.xpPerLevel = {};
        for (let i = 1; i <= this.maxLevel; i++) {
            this.xpPerLevel[i] = 100 + (i - 1) * 20; // فرمول پویا
        }
    }

    // محاسبه XP مورد نیاز برای لول فعلی
    getXPForCurrentLevel() {
        return this.xpPerLevel[this.currentLevel] || 100;
    }

    // محاسبه XP مورد نیاز برای لول بعدی
    getXPForNextLevel() {
        if (this.currentLevel >= this.maxLevel) return 0;
        return this.xpPerLevel[this.currentLevel + 1] || 100;
    }

    // افزودن XP
    addXP(amount) {
        if (this.currentLevel >= this.maxLevel) {
            return { leveledUp: false, newLevel: this.currentLevel };
        }

        this.currentXP += amount;
        this.totalXP += amount;
        
        const xpNeeded = this.getXPForCurrentLevel();
        
        if (this.currentXP >= xpNeeded) {
            return this.levelUp();
        }
        
        return { leveledUp: false, newLevel: this.currentLevel, xpAdded: amount };
    }

    // افزایش لول
    levelUp() {
        if (this.currentLevel >= this.maxLevel) {
            return { leveledUp: false, newLevel: this.currentLevel };
        }

        const xpNeeded = this.getXPForCurrentLevel();
        this.currentXP -= xpNeeded;
        this.currentLevel++;
        
        // چک کردن لول آپ چندگانه
        if (this.currentXP >= this.getXPForCurrentLevel() && this.currentLevel < this.maxLevel) {
            return this.levelUp();
        }
        
        return {
            leveledUp: true,
            newLevel: this.currentLevel,
            title: this.getCurrentTitle(),
            rewards: this.getLevelRewards(this.currentLevel)
        };
    }

    // دریافت عنوان فعلی
    getCurrentTitle() {
        let title = this.levelTitles[1];
        for (const [level, levelTitle] of Object.entries(this.levelTitles)) {
            if (this.currentLevel >= parseInt(level)) {
                title = levelTitle;
            }
        }
        return title;
    }

    // دریافت پاداش‌های لول
    getLevelRewards(level) {
        const rewards = [];
        
        if (level % 5 === 0) {
            rewards.push('🎨 تم جدید باز شد!');
        }
        if (level % 10 === 0) {
            rewards.push('🏆 مدال ویژه دریافت کردید!');
        }
        if (level === 25) {
            rewards.push('👑 حالت حرفه‌ای فعال شد!');
        }
        if (level === 50) {
            rewards.push('🎭 تمام محتوای بازی باز شد!');
        }
        
        return rewards;
    }

    // محاسبه درصد پیشرفت
    getProgress() {
        const xpNeeded = this.getXPForCurrentLevel();
        return Math.min(100, Math.round((this.currentXP / xpNeeded) * 100));
    }

    // دریافت اطلاعات کامل
    getInfo() {
        return {
            level: this.currentLevel,
            xp: this.currentXP,
            totalXP: this.totalXP,
            xpNeeded: this.getXPForCurrentLevel(),
            progress: this.getProgress(),
            title: this.getCurrentTitle(),
            isMaxLevel: this.currentLevel >= this.maxLevel
        };
    }

    // بارگذاری داده
    loadData(data) {
        if (data) {
            this.currentLevel = data.level || 1;
            this.currentXP = data.xp || 0;
            this.totalXP = data.totalXP || 0;
        }
    }

    // ذخیره داده
    saveData() {
        return {
            level: this.currentLevel,
            xp: this.currentXP,
            totalXP: this.totalXP
        };
    }

    // ریست کردن
    reset() {
        this.currentLevel = 1;
        this.currentXP = 0;
        this.totalXP = 0;
    }

    // محاسبه XP برای برد/باخت/مساوی
    calculateXPReward(result, difficulty = 'medium') {
        const baseXP = {
            win: 50,
            draw: 20,
            loss: 5
        };

        const difficultyMultiplier = {
            easy: 1,
            medium: 1.5,
            hard: 2,
            impossible: 3
        };

        const xp = baseXP[result] || 0;
        const multiplier = difficultyMultiplier[difficulty] || 1;
        
        return Math.round(xp * multiplier);
    }

    // دریافت تمام عناوین قابل دسترس
    getAvailableTitles() {
        const available = [];
        for (const [level, title] of Object.entries(this.levelTitles)) {
            if (this.currentLevel >= parseInt(level)) {
                available.push({ level: parseInt(level), title });
            }
        }
        return available;
    }

    // محاسبه رتبه بر اساس XP کل
    getRank() {
        if (this.totalXP < 500) return { name: 'برنزی', color: '#CD7F32' };
        if (this.totalXP < 2000) return { name: 'نقره‌ای', color: '#C0C0C0' };
        if (this.totalXP < 5000) return { name: 'طلایی', color: '#FFD700' };
        if (this.totalXP < 10000) return { name: 'پلاتینیوم', color: '#E5E4E2' };
        if (this.totalXP < 20000) return { name: 'الماس', color: '#B9F2FF' };
        return { name: 'افسانه', color: '#FF6B6B' };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelSystem;
}
