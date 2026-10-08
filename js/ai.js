// =====================================
// هوش مصنوعی Minimax
// Sussy Baka v4.0
// =====================================

class TicTacToeAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.playerSymbol = 'X';
        this.aiSymbol = 'O';
    }

    // تعیین سطح سختی
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    // دریافت بهترین حرکت
    getBestMove(board) {
        // بر اساس سطح سختی تصمیم‌گیری می‌کنیم
        switch (this.difficulty) {
            case 'easy':
                return this.getRandomMove(board);
            case 'medium':
                return Math.random() < 0.5 ? this.getRandomMove(board) : this.minimaxMove(board);
            case 'hard':
                return Math.random() < 0.2 ? this.getRandomMove(board) : this.minimaxMove(board);
            case 'impossible':
                return this.minimaxMove(board);
            default:
                return this.minimaxMove(board);
        }
    }

    // حرکت تصادفی
    getRandomMove(board) {
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                availableMoves.push(i);
            }
        }
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // الگوریتم Minimax
    minimaxMove(board) {
        let bestScore = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = this.aiSymbol;
                const score = this.minimax(board, 0, false);
                board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    // الگوریتم Minimax بازگشتی
    minimax(board, depth, isMaximizing) {
        const result = this.checkWinner(board);
        
        if (result === this.aiSymbol) return 10 - depth;
        if (result === this.playerSymbol) return depth - 10;
        if (this.isBoardFull(board)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.aiSymbol;
                    const score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.playerSymbol;
                    const score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    // چک کردن برنده
    checkWinner(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // سطرها
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // ستون‌ها
            [0, 4, 8], [2, 4, 6]             // قطرها
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return null;
    }

    // چک کردن پر بودن صفحه
    isBoardFull(board) {
        return board.every(cell => cell !== '');
    }

    // پیشنهاد بهترین حرکت برای بازیکن (Hint)
    getHint(board) {
        // همیشه بهترین حرکت رو پیشنهاد می‌ده
        const tempDifficulty = this.difficulty;
        this.difficulty = 'impossible';
        const tempSymbol = this.aiSymbol;
        this.aiSymbol = this.playerSymbol;
        
        const bestMove = this.minimaxMove(board);
        
        this.difficulty = tempDifficulty;
        this.aiSymbol = tempSymbol;
        
        return bestMove;
    }

    // ارزیابی وضعیت بازی
    evaluatePosition(board) {
        const winner = this.checkWinner(board);
        if (winner === this.aiSymbol) return 'AI برنده می‌شود';
        if (winner === this.playerSymbol) return 'شما برنده می‌شوید';
        if (this.isBoardFull(board)) return 'مساوی';
        
        // شمارش امتیاز موقعیت
        let aiScore = 0;
        let playerScore = 0;
        
        const patterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (const pattern of patterns) {
            const [a, b, c] = pattern;
            const line = [board[a], board[b], board[c]];
            
            const aiCount = line.filter(x => x === this.aiSymbol).length;
            const playerCount = line.filter(x => x === this.playerSymbol).length;
            const emptyCount = line.filter(x => x === '').length;
            
            if (aiCount > 0 && playerCount === 0) aiScore += aiCount;
            if (playerCount > 0 && aiCount === 0) playerScore += playerCount;
        }
        
        if (aiScore > playerScore) return 'AI در موقعیت بهتری است';
        if (playerScore > aiScore) return 'شما در موقعیت بهتری هستید';
        return 'موقعیت مساوی است';
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TicTacToeAI;
}
