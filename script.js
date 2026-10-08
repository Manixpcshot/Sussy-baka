// Game State
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = {
    X: 0,
    O: 0,
    draw: 0
};

// Winning Combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// DOM Elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('current-player');
const resetBtn = document.getElementById('resetBtn');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreDraw = document.getElementById('scoreDraw');

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);

// Initialize
updateScoreDisplay();

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();
}

function updateCell(cell, index) {
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');
    cell.classList.add(currentPlayer.toLowerCase());
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = currentPlayer;
}

function checkResult() {
    let roundWon = false;
    let winningCombination = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const condition = winningConditions[i];
        const a = gameBoard[condition[0]];
        const b = gameBoard[condition[1]];
        const c = gameBoard[condition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            winningCombination = condition;
            break;
        }
    }

    if (roundWon) {
        announceWinner(currentPlayer, winningCombination);
        scores[currentPlayer]++;
        updateScoreDisplay();
        gameActive = false;
        return;
    }

    const roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        announceDraw();
        scores.draw++;
        updateScoreDisplay();
        gameActive = false;
        return;
    }

    changePlayer();
}

function announceWinner(winner, combination) {
    statusDisplay.textContent = `${winner} برنده شد! 🎉`;
    statusDisplay.style.color = '#ffd700';
    
    // Highlight winning cells
    combination.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function announceDraw() {
    statusDisplay.textContent = 'مساوی! 🤝';
    statusDisplay.style.color = '#ff6b6b';
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    statusDisplay.textContent = currentPlayer;
    statusDisplay.style.color = '#667eea';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o', 'winner');
    });
}

function updateScoreDisplay() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreDraw.textContent = scores.draw;
}

// Easter egg
console.log('🎮 Sussy Baka Game - Made with ❤️');
console.log('وقت بازی خوش بگذره! 😊');