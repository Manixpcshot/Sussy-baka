// =====================================
// سیستم دیتابیس IndexedDB
// Sussy Baka v4.0
// =====================================

class GameDatabase {
    constructor() {
        this.dbName = 'SussyBakaDB';
        this.version = 1;
        this.db = null;
    }

    // باز کردن دیتابیس
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject('خطا در باز کردن دیتابیس');
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // ایجاد object stores
                if (!db.objectStoreNames.contains('games')) {
                    const gamesStore = db.createObjectStore('games', { keyPath: 'id', autoIncrement: true });
                    gamesStore.createIndex('date', 'date', { unique: false });
                    gamesStore.createIndex('result', 'result', { unique: false });
                }

                if (!db.objectStoreNames.contains('profile')) {
                    db.createObjectStore('profile', { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains('achievements')) {
                    db.createObjectStore('achievements', { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    // ذخیره بازی
    async saveGame(gameData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['games'], 'readwrite');
            const store = transaction.objectStore('games');
            const request = store.add({
                ...gameData,
                date: new Date().toISOString()
            });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('خطا در ذخیره بازی');
        });
    }

    // دریافت تمام بازی‌ها
    async getAllGames(limit = 50) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['games'], 'readonly');
            const store = transaction.objectStore('games');
            const request = store.getAll();

            request.onsuccess = () => {
                const games = request.result.sort((a, b) => new Date(b.date) - new Date(a.date));
                resolve(games.slice(0, limit));
            };
            request.onerror = () => reject('خطا در دریافت بازی‌ها');
        });
    }

    // حذف بازی
    async deleteGame(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['games'], 'readwrite');
            const store = transaction.objectStore('games');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject('خطا در حذف بازی');
        });
    }

    // پاک کردن تمام بازی‌ها
    async clearAllGames() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['games'], 'readwrite');
            const store = transaction.objectStore('games');
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject('خطا در پاک کردن بازی‌ها');
        });
    }

    // ذخیره پروفایل
    async saveProfile(profileData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['profile'], 'readwrite');
            const store = transaction.objectStore('profile');
            const request = store.put({ id: 1, ...profileData });

            request.onsuccess = () => resolve();
            request.onerror = () => reject('خطا در ذخیره پروفایل');
        });
    }

    // دریافت پروفایل
    async getProfile() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['profile'], 'readonly');
            const store = transaction.objectStore('profile');
            const request = store.get(1);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject('خطا در دریافت پروفایل');
        });
    }

    // ذخیره Achievement
    async saveAchievement(achievementData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['achievements'], 'readwrite');
            const store = transaction.objectStore('achievements');
            const request = store.put(achievementData);

            request.onsuccess = () => resolve();
            request.onerror = () => reject('خطا در ذخیره Achievement');
        });
    }

    // دریافت تمام Achievements
    async getAllAchievements() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['achievements'], 'readonly');
            const store = transaction.objectStore('achievements');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('خطا در دریافت Achievements');
        });
    }

    // ذخیره تنظیمات
    async saveSetting(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            const request = store.put({ key, value });

            request.onsuccess = () => resolve();
            request.onerror = () => reject('خطا در ذخیره تنظیمات');
        });
    }

    // دریافت تنظیمات
    async getSetting(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ? request.result.value : null);
            request.onerror = () => reject('خطا در دریافت تنظیمات');
        });
    }

    // صادرات تمام داده‌ها
    async exportData() {
        const [games, profile, achievements, settings] = await Promise.all([
            this.getAllGames(1000),
            this.getProfile(),
            this.getAllAchievements(),
            this.getAllSettings()
        ]);

        return {
            version: this.version,
            exportDate: new Date().toISOString(),
            data: { games, profile, achievements, settings }
        };
    }

    // وارد کردن داده‌ها
    async importData(data) {
        if (!data || !data.data) throw new Error('داده نامعتبر است');

        const { games, profile, achievements, settings } = data.data;

        // پاک کردن داده‌های قبلی
        await this.clearAllGames();

        // وارد کردن داده‌های جدید
        if (games) {
            for (const game of games) {
                await this.saveGame(game);
            }
        }
        if (profile) await this.saveProfile(profile);
        if (achievements) {
            for (const ach of achievements) {
                await this.saveAchievement(ach);
            }
        }
        if (settings) {
            for (const setting of settings) {
                await this.saveSetting(setting.key, setting.value);
            }
        }
    }

    // دریافت تمام تنظیمات
    async getAllSettings() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('خطا در دریافت تنظیمات');
        });
    }

    // آمار سریع
    async getQuickStats() {
        const games = await this.getAllGames(1000);
        const wins = games.filter(g => g.result === 'win').length;
        const losses = games.filter(g => g.result === 'loss').length;
        const draws = games.filter(g => g.result === 'draw').length;
        const total = games.length;
        const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

        return { wins, losses, draws, total, winRate, games };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameDatabase;
}
