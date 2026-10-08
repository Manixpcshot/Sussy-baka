// =====================================
// سیستم Achievement (دستاوردها)
// Sussy Baka v4.0
// =====================================

class AchievementSystem {
    constructor() {
        this.achievements = [
            // دستاوردهای اولیه
            { id: 'first_win', name: '🎉 اولین پیروزی', desc: 'اولین بازی خود را ببرید', unlocked: false, condition: (stats) => stats.wins >= 1 },
            { id: 'first_game', name: '🎮 شروع سفر', desc: 'اولین بازی خود را انجام دهید', unlocked: false, condition: (stats) => stats.total >= 1 },
            
            // دستاوردهای برد
            { id: 'win_5', name: '🏆 برنده', desc: '5 بازی ببرید', unlocked: false, condition: (stats) => stats.wins >= 5 },
            { id: 'win_10', name: '⭐ قهرمان', desc: '10 بازی ببرید', unlocked: false, condition: (stats) => stats.wins >= 10 },
            { id: 'win_25', name: '💎 استاد', desc: '25 بازی ببرید', unlocked: false, condition: (stats) => stats.wins >= 25 },
            { id: 'win_50', name: '👑 افسانه', desc: '50 بازی ببرید', unlocked: false, condition: (stats) => stats.wins >= 50 },
            { id: 'win_100', name: '🎭 اسطوره', desc: '100 بازی ببرید', unlocked: false, condition: (stats) => stats.wins >= 100 },
            
            // دستاوردهای استریک
            { id: 'streak_3', name: '🔥 سه‌تایی', desc: '3 بازی پشت سر هم ببرید', unlocked: false, condition: (stats) => stats.currentStreak >= 3 },
            { id: 'streak_5', name: '⚡ پنج‌تایی', desc: '5 بازی پشت سر هم ببرید', unlocked: false, condition: (stats) => stats.currentStreak >= 5 },
            { id: 'streak_10', name: '💥 ده‌تایی', desc: '10 بازی پشت سر هم ببرید', unlocked: false, condition: (stats) => stats.currentStreak >= 10 },
            
            // دستاوردهای سطح سختی
            { id: 'beat_hard', name: '😈 شکست سخت', desc: 'سطح سخت را شکست دهید', unlocked: false, condition: (stats) => stats.hardWins >= 1 },
            { id: 'beat_impossible', name: '👹 غیرممکن', desc: 'سطح غیرممکن را شکست دهید', unlocked: false, condition: (stats) => stats.impossibleWins >= 1 },
            
            // دستاوردهای لول
            { id: 'level_10', name: '📈 رشد', desc: 'به لول 10 برسید', unlocked: false, condition: (stats) => stats.level >= 10 },
            { id: 'level_25', name: '🌟 نخبه', desc: 'به لول 25 برسید', unlocked: false, condition: (stats) => stats.level >= 25 },
            { id: 'level_50', name: '🏅 حداکثر', desc: 'به لول 50 برسید', unlocked: false, condition: (stats) => stats.level >= 50 },
            
            // دستاوردهای ویژه
            { id: 'perfectionist', name: '💯 کامل‌گرا', desc: 'Win Rate بالای 90% داشته باشید', unlocked: false, condition: (stats) => stats.winRate >= 90 && stats.total >= 20 },
            { id: 'persistent', name: '🎯 پایدار', desc: '100 بازی انجام دهید', unlocked: false, condition: (stats) => stats.total >= 100 },
            { id: 'dedicated', name: '💪 متعهد', desc: '250 بازی انجام دهید', unlocked: false, condition: (stats) => stats.total >= 250 },
            { id: 'legend', name: '🌠 افسانه‌ای', desc: '500 بازی انجام دهید', unlocked: false, condition: (stats) => stats.total >= 500 },
            
            // دستاورد مخفی
            { id: 'secret', name: '🎭 راز', desc: '???', unlocked: false, condition: (stats) => stats.total >= 1000, hidden: true }
        ];
        
        this.unlockedAchievements = [];
    }

    // چک کردن و باز کردن دستاوردها
    checkAchievements(stats) {
        const newlyUnlocked = [];
        
        for (const achievement of this.achievements) {
            if (!achievement.unlocked && achievement.condition(stats)) {
                achievement.unlocked = true;
                achievement.unlockedAt = new Date().toISOString();
                this.unlockedAchievements.push(achievement);
                newlyUnlocked.push(achievement);
            }
        }
        
        return newlyUnlocked;
    }

    // دریافت تمام دستاوردها
    getAllAchievements(includeHidden = false) {
        if (includeHidden) {
            return this.achievements;
        }
        return this.achievements.filter(a => !a.hidden || a.unlocked);
    }

    // دریافت دستاوردهای باز شده
    getUnlockedAchievements() {
        return this.achievements.filter(a => a.unlocked);
    }

    // دریافت دستاوردهای قفل شده
    getLockedAchievements() {
        return this.achievements.filter(a => !a.unlocked && !a.hidden);
    }

    // محاسبه درصد پیشرفت
    getProgress() {
        const total = this.achievements.filter(a => !a.hidden).length;
        const unlocked = this.getUnlockedAchievements().length;
        return Math.round((unlocked / total) * 100);
    }

    // بارگذاری داده
    loadData(data) {
        if (data && Array.isArray(data)) {
            for (const savedAch of data) {
                const achievement = this.achievements.find(a => a.id === savedAch.id);
                if (achievement) {
                    achievement.unlocked = savedAch.unlocked;
                    achievement.unlockedAt = savedAch.unlockedAt;
                    if (achievement.unlocked) {
                        this.unlockedAchievements.push(achievement);
                    }
                }
            }
        }
    }

    // ذخیره داده
    saveData() {
        return this.achievements.map(a => ({
            id: a.id,
            unlocked: a.unlocked,
            unlockedAt: a.unlockedAt
        }));
    }

    // ریست کردن
    reset() {
        for (const achievement of this.achievements) {
            achievement.unlocked = false;
            delete achievement.unlockedAt;
        }
        this.unlockedAchievements = [];
    }

    // دریافت آخرین دستاورد باز شده
    getLatestUnlocked() {
        if (this.unlockedAchievements.length === 0) return null;
        return this.unlockedAchievements[this.unlockedAchievements.length - 1];
    }

    // آماری از دستاوردها
    getStats() {
        return {
            total: this.achievements.filter(a => !a.hidden).length,
            unlocked: this.getUnlockedAchievements().length,
            locked: this.getLockedAchievements().length,
            progress: this.getProgress()
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
}
