class NumberGuessingGame {
    constructor() {
        this.secretNumber = null;
        this.attempts = 0;
        this.bestScore = localStorage.getItem('guessBestScore') || null;
        this.gameActive = false;
        this.history = [];

        this.init();
    }

    init() {
        // Update best score display
        this.updateBestDisplay();

        // Allow pressing Enter to guess
        const input = document.getElementById('guess-input');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.makeGuess();
            });
        }

        // Start a game automatically on load
        this.startGame();
    }

    startGame() {
        this.secretNumber = Math.floor(Math.random() * 100) + 1;
        this.attempts = 0;
        this.gameActive = true;
        this.history = [];

        document.getElementById('guess-attempts').textContent = '0';
        document.getElementById('guess-mascot').textContent = '🤔';
        document.getElementById('guess-hint-text').innerHTML =
            "I'm thinking of a number between <strong>1</strong> and <strong>100</strong>!";
        document.getElementById('guess-history').innerHTML = '';
        document.getElementById('guess-input').value = '';
        document.getElementById('guess-input').disabled = false;
        document.getElementById('guess-btn').disabled = false;

        const msg = document.getElementById('guess-message');
        msg.style.display = 'none';
        msg.textContent = '';
    }

    makeGuess() {
        if (!this.gameActive) {
            this.startGame();
            return;
        }

        const input = document.getElementById('guess-input');
        const guess = parseInt(input.value);

        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.showMessage('⚠️ Please enter a number between 1 and 100!', 'info');
            return;
        }

        this.attempts++;
        document.getElementById('guess-attempts').textContent = this.attempts;
        input.value = '';

        // Add to history
        this.history.push(guess);
        this.renderHistory();

        if (guess === this.secretNumber) {
            this.win();
        } else if (guess < this.secretNumber) {
            document.getElementById('guess-mascot').textContent = '🔻';
            document.getElementById('guess-hint-text').innerHTML =
                `<strong>${guess}</strong> is too low! Try higher 🔺`;
            this.showMessage(`🔻 Too Low! Go higher.`, 'info');
        } else {
            document.getElementById('guess-mascot').textContent = '🔺';
            document.getElementById('guess-hint-text').innerHTML =
                `<strong>${guess}</strong> is too high! Try lower 🔻`;
            this.showMessage(`🔺 Too High! Go lower.`, 'info');
        }
    }

    win() {
        this.gameActive = false;
        document.getElementById('guess-mascot').textContent = '🎉';
        document.getElementById('guess-hint-text').innerHTML =
            `🎊 Correct! The number was <strong>${this.secretNumber}</strong>!`;
        document.getElementById('guess-input').disabled = true;
        document.getElementById('guess-btn').disabled = true;

        // Save best score
        if (!this.bestScore || this.attempts < parseInt(this.bestScore)) {
            this.bestScore = this.attempts;
            localStorage.setItem('guessBestScore', this.bestScore);
            this.updateBestDisplay();
            this.showMessage(`🏆 You got it in ${this.attempts} attempt${this.attempts > 1 ? 's' : ''}! NEW BEST!`, 'success');
        } else {
            this.showMessage(`🎉 You got it in ${this.attempts} attempt${this.attempts > 1 ? 's' : ''}! Well done!`, 'success');
        }
    }

    renderHistory() {
        const container = document.getElementById('guess-history');
        container.innerHTML = this.history.map((g, i) => {
            let icon = g < this.secretNumber ? '🔻' : g > this.secretNumber ? '🔺' : '✅';
            return `<span class="guess-tag">#${i + 1}: ${g} ${icon}</span>`;
        }).join('');
    }

    updateBestDisplay() {
        const best = localStorage.getItem('guessBestScore');
        document.getElementById('guess-best').textContent = best ? best + ' attempts' : '-';
    }

    showMessage(text, type) {
        const msg = document.getElementById('guess-message');
        msg.textContent = text;
        msg.className = `game-message ${type}`;
        msg.style.display = 'block';
    }
}

const guessGame = new NumberGuessingGame();
