// =====================================
// منطق اصلی بازی دوز (Tic Tac Toe)
// Sussy Baka v4.0
// =====================================

class TicTacToeGame {
    constructor() {
        // وضعیت بازی
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = false;
        this.gameMode = 'ai'; // 'ai' or '2player'
        this.difficulty = 'medium';
        
        // سیستم‌ها
        this.db = new GameDatabase();
        this.levelSystem = new LevelSystem();
        this.achievementSystem = new AchievementSystem();
        this.ai = new TicTacToeAI(this.difficulty);
        this.soundManager = new SoundManager();
        
        // آمار
        this.stats = {
            wins: 0,
            losses: 0,
            draws: 0,
            total: 0,
            currentStreak: 0,
            bestStreak: 0,
            hardWins: 0,
            impossibleWins: 0,
            level: 1,
            winRate: 0
        };
        
        this.init();
    }

    // راه‌اندازی
    async init() {
        try {
            await this.db.init();
            await this.loadGameData();
            this.setupEventListeners();
            this.updateUI();
        } catch (error) {
            console.error('خطا در راه‌اندازی:', error);
        }
    }

    // بارگذاری داده‌ها
    async loadGameData() {
        try {
            const profile = await this.db.getProfile();
            if (profile) {
                this.stats = { ...this.stats, ...profile.stats };
                this.levelSystem.loadData(profile.level);
                this.achievementSystem.loadData(profile.achievements);
                this.difficulty = profile.difficulty || 'medium';
                this.soundManager.setEnabled(profile.soundEnabled !== false);
            }
        } catch (error) {
            console.error('خطا در بارگذاری:', error);
        }
    }

    // ذخیره داده‌ها
    async saveGameData() {
        try {
            await this.db.saveProfile({
                stats: this.stats,
                level: this.levelSystem.saveData(),
                achievements: this.achievementSystem.saveData(),
                difficulty: this.difficulty,
                soundEnabled: this.soundManager.isEnabled(),
                lastSaved: new Date().toISOString()
            });
        } catch (error) {
            console.error('خطا در ذخیره:', error);
        }
    }

    // تنظیم Event Listeners
    setupEventListeners() {
        // کلیک روی خانه‌های بازی
        document.querySelectorAll('.cell').forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        // دکمه‌های کنترل
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) newGameBtn.addEventListener('click', () => this.newGame());

        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetGame());

        // تنظیمات
        const difficultySelect = document.getElementById('difficulty');
        if (difficultySelect) {
            difficultySelect.value = this.difficulty;
            difficultySelect.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
                this.ai.setDifficulty(this.difficulty);
                this.saveGameData();
            });
        }

        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.checked = this.soundManager.isEnabled();
            soundToggle.addEventListener('change', (e) => {
                this.soundManager.setEnabled(e.target.checked);
                this.saveGameData();
            });
        }

        // صادرات/وارد کردن
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());

        const importBtn = document.getElementById('importData');
        if (importBtn) importBtn.addEventListener('click', () => this.importData());
    }

    // شروع بازی جدید
    newGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.updateBoard();
        this.updateStatus('نوبت شما');
    }

    // کلیک روی خانه
    async handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '' || this.currentPlayer !== 'X') return;

        this.board[index] = 'X';
        this.soundManager.playSound('click');
        this.updateBoard();

        const result = this.checkGameEnd();
        if (result) {
            await this.endGame(result);
            return;
        }

        // نوبت AI
        this.currentPlayer = 'O';
        this.updateStatus('نوبت AI...');
        
        setTimeout(async () => {
            const aiMove = this.ai.getBestMove([...this.board]);
            this.board[aiMove] = 'O';
            this.soundManager.playSound('click');
            this.updateBoard();

            const aiResult = this.checkGameEnd();
            if (aiResult) {
                await this.endGame(aiResult);
                return;
            }

            this.currentPlayer = 'X';
            this.updateStatus('نوبت شما');
        }, 500);
    }

    // چک کردن پایان بازی
    checkGameEnd() {
        const winner = this.ai.checkWinner(this.board);
        if (winner) return winner;
        if (this.ai.isBoardFull(this.board)) return 'draw';
        return null;
    }

    // پایان بازی
    async endGame(result) {
        this.gameActive = false;
        let gameResult = '';

        if (result === 'X') {
            gameResult = 'win';
            this.stats.wins++;
            this.stats.currentStreak++;
            this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.currentStreak);
            if (this.difficulty === 'hard') this.stats.hardWins++;
            if (this.difficulty === 'impossible') this.stats.impossibleWins++;
            this.soundManager.playSound('win');
            this.updateStatus('🎉 شما بردید!');
        } else if (result === 'O') {
            gameResult = 'loss';
            this.stats.losses++;
            this.stats.currentStreak = 0;
            this.soundManager.playSound('lose');
            this.updateStatus('😢 شما باختید!');
        } else {
            gameResult = 'draw';
            this.stats.draws++;
            this.stats.currentStreak = 0;
            this.soundManager.playSound('draw');
            this.updateStatus('🤝 مساوی!');
        }

        this.stats.total++;
        this.stats.winRate = Math.round((this.stats.wins / this.stats.total) * 100);

        // افزودن XP
        const xpReward = this.levelSystem.calculateXPReward(gameResult, this.difficulty);
        const levelResult = this.levelSystem.addXP(xpReward);
        
        if (levelResult.leveledUp) {
            this.soundManager.playSound('levelup');
            this.showLevelUpNotification(levelResult);
        }

        // چک Achievements
        this.stats.level = this.levelSystem.currentLevel;
        const newAchievements = this.achievementSystem.checkAchievements(this.stats);
        
        for (const achievement of newAchievements) {
            this.soundManager.playSound('achievement');
            this.showAchievementNotification(achievement);
        }

        // ذخیره بازی
        await this.db.saveGame({
            result: gameResult,
            difficulty: this.difficulty,
            board: this.board,
            xpGained: xpReward
        });

        await this.saveGameData();
        this.updateUI();
    }

    // آپدیت صفحه بازی
    updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = this.board[index];
            cell.className = 'cell';
            if (this.board[index]) {
                cell.classList.add(this.board[index] === 'X' ? 'x' : 'o');
            }
        });
    }

    // آپدیت وضعیت
    updateStatus(message) {
        const statusEl = document.getElementById('gameStatus');
        if (statusEl) statusEl.textContent = message;
    }

    // آپدیت UI
    updateUI() {
        // آپدیت آمار
        const elements = {
            wins: document.getElementById('wins'),
            losses: document.getElementById('losses'),
            draws: document.getElementById('draws'),
            total: document.getElementById('totalGames'),
            winRate: document.getElementById('winRate'),
            streak: document.getElementById('currentStreak'),
            level: document.getElementById('playerLevel'),
            xp: document.getElementById('currentXP'),
            title: document.getElementById('playerTitle')
        };

        if (elements.wins) elements.wins.textContent = this.stats.wins;
        if (elements.losses) elements.losses.textContent = this.stats.losses;
        if (elements.draws) elements.draws.textContent = this.stats.draws;
        if (elements.total) elements.total.textContent = this.stats.total;
        if (elements.winRate) elements.winRate.textContent = this.stats.winRate + '%';
        if (elements.streak) elements.streak.textContent = this.stats.currentStreak;

        const levelInfo = this.levelSystem.getInfo();
        if (elements.level) elements.level.textContent = levelInfo.level;
        if (elements.xp) elements.xp.textContent = `${levelInfo.xp}/${levelInfo.xpNeeded}`;
        if (elements.title) elements.title.textContent = levelInfo.title;

        // آپدیت نوار XP
        const xpBar = document.getElementById('xpProgress');
        if (xpBar) xpBar.style.width = levelInfo.progress + '%';
    }

    // نوتیفیکیشن Level Up
    showLevelUpNotification(data) {
        Utils.showNotification(`🎉 Level Up! شما به ${data.title} رسیدید!`, 'success', 4000);
    }

    // نوتیفیکیشن Achievement
    showAchievementNotification(achievement) {
        Utils.showNotification(`🏆 ${achievement.name}\n${achievement.desc}`, 'achievement', 5000);
    }

    // صادرات داده
    async exportData() {
        try {
            const data = await this.db.exportData();
            Utils.downloadJSON(data, 'sussy-baka-backup.json');
            Utils.showNotification('✅ داده‌ها با موفقیت صادر شدند', 'success');
        } catch (error) {
            Utils.showNotification('❌ خطا در صادرات داده‌ها', 'error');
        }
    }

    // وارد کردن داده
    async importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            try {
                const file = e.target.files[0];
                const text = await file.text();
                const data = JSON.parse(text);
                await this.db.importData(data);
                await this.loadGameData();
                this.updateUI();
                Utils.showNotification('✅ داده‌ها با موفقیت وارد شدند', 'success');
            } catch (error) {
                Utils.showNotification('❌ خطا در وارد کردن داده‌ها', 'error');
            }
        };
        input.click();
    }

    // ریست بازی
    async resetGame() {
        if (!confirm('آیا مطمئن هستید که می‌خواهید تمام داده‌ها را پاک کنید?')) return;
        
        this.stats = {
            wins: 0, losses: 0, draws: 0, total: 0,
            currentStreak: 0, bestStreak: 0,
            hardWins: 0, impossibleWins: 0,
            level: 1, winRate: 0
        };
        
        this.levelSystem.reset();
        this.achievementSystem.reset();
        await this.db.clearAllGames();
        await this.saveGameData();
        this.updateUI();
        this.newGame();
        
        Utils.showNotification('✅ تمام داده‌ها پاک شدند', 'success');
    }
}

// راه‌اندازی بازی
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new TicTacToeGame();
});
