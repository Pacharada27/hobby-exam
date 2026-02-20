class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = false;
        this.scores = { X: 0, O: 0, draw: 0 };

        this.winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]              // diagonals
        ];

        this.cells = document.querySelectorAll('.ttt-cell');
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleClick(parseInt(cell.dataset.index)));
        });

        this.newGame();
    }

    newGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
            cell.disabled = false;
        });

        this.setStatus(`Player ❌ X's turn`);
    }

    handleClick(index) {
        if (!this.gameActive || this.board[index]) return;

        this.board[index] = this.currentPlayer;
        const cell = this.cells[index];
        cell.textContent = this.currentPlayer === 'X' ? '❌' : '⭕';
        cell.classList.add(this.currentPlayer.toLowerCase());
        cell.disabled = true;

        const winner = this.checkWinner();
        if (winner) {
            this.highlightWinner(winner.pattern);
            this.scores[this.currentPlayer]++;
            this.updateScoreDisplay();
            this.setStatus(`🎉 Player ${this.currentPlayer === 'X' ? '❌ X' : '⭕ O'} wins!`);
            this.gameActive = false;
            this.disableAll();
        } else if (this.board.every(cell => cell !== null)) {
            this.scores.draw++;
            this.updateScoreDisplay();
            this.setStatus(`🤝 It's a draw!`);
            this.gameActive = false;
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.setStatus(`Player ${this.currentPlayer === 'X' ? '❌ X' : '⭕ O'}'s turn`);
        }
    }

    checkWinner() {
        for (const pattern of this.winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return { player: this.board[a], pattern };
            }
        }
        return null;
    }

    highlightWinner(pattern) {
        pattern.forEach(i => this.cells[i].classList.add('winner'));
    }

    disableAll() {
        this.cells.forEach(cell => cell.disabled = true);
    }

    setStatus(msg) {
        document.getElementById('ttt-status').textContent = msg;
    }

    updateScoreDisplay() {
        document.getElementById('ttt-x-wins').textContent = this.scores.X;
        document.getElementById('ttt-o-wins').textContent = this.scores.O;
        document.getElementById('ttt-draws').textContent = this.scores.draw;
    }

    resetScore() {
        this.scores = { X: 0, O: 0, draw: 0 };
        this.updateScoreDisplay();
        this.newGame();
    }
}

const tttGame = new TicTacToe();
