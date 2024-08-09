export class Minesweeper {
    private board: number[][];
    private revealed: boolean[][];
    private flagged: boolean[][];
    private gameBoardElement: HTMLElement;
    private rows: number;
    private cols: number;
    private mines: number;
    private lives: number;
    private remainingMines: number; // 남은 폭탄 수

    constructor(gameBoardElement: HTMLElement, rows: number, cols: number, mines: number) {
        this.gameBoardElement = gameBoardElement;
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.lives = 5; // 초기 목숨 설정
        this.remainingMines = mines; // 남은 폭탄 수 초기화
    }

    init() {
        this.lives = 5; // 목숨 초기화
        this.remainingMines = this.mines; // 남은 폭탄 수 초기화
        this.createBoard();
        this.placeMines();
        this.updateNumbers();
        this.updateLivesUI(); // 목숨 UI 업데이트
        this.updateMinesUI(); // 남은 폭탄 수 UI 업데이트
        this.renderBoard();
    }

    createBoard() {
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            this.revealed[row] = [];
            this.flagged[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = 0;
                this.revealed[row][col] = false;
                this.flagged[row][col] = false;
            }
        }
    }

    placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < this.mines) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            if (this.board[row][col] === 0) {
                this.board[row][col] = -1; // -1 will represent a mine
                minesPlaced++;
            }
        }
    }

    updateNumbers() {
        const directions = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] === -1) continue;

                let minesCount = 0;
                for (const [dx, dy] of directions) {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (this.isInBounds(newRow, newCol) && this.board[newRow][newCol] === -1) {
                        minesCount++;
                    }
                }
                this.board[row][col] = minesCount;
            }
        }
    }

    isInBounds(row: number, col: number) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    renderBoard() {
        this.gameBoardElement.style.gridTemplateRows = `repeat(${this.rows}, 30px)`;
        this.gameBoardElement.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`;
        this.gameBoardElement.innerHTML = "";

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row.toString();
                cell.dataset.col = col.toString();
                cell.addEventListener("click", () => this.revealCell(row, col));

                // Context menu for flagging on desktop
                cell.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    this.toggleFlag(row, col);
                });

                // Long press for flagging on mobile
                let pressTimer: NodeJS.Timeout;
                cell.addEventListener("touchstart", (e) => {
                    pressTimer = setTimeout(() => this.toggleFlag(row, col), 500);
                });
                cell.addEventListener("touchend", () => {
                    clearTimeout(pressTimer);
                });

                this.gameBoardElement.appendChild(cell);
            }
        }
    }

    revealCell(row: number, col: number) {
        if (!this.isInBounds(row, col) || this.revealed[row][col] || this.flagged[row][col]) return;

        this.revealed[row][col] = true;
        const cell = this.gameBoardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;

        if (this.board[row][col] === -1) {
            this.lives--; // 목숨 감소
            cell.classList.add("mine");
            cell.classList.remove("flag");
            this.remainingMines--; // 폭탄이 터졌으므로 남은 폭탄 수 감소

            const livesElement = document.getElementById("lives");
            if (livesElement) {
                livesElement.textContent = `Lives: ${this.lives}`;
            }

            const minesElement = document.getElementById("mines");
            if (minesElement) {
                minesElement.textContent = `Mines: ${this.remainingMines}`;
            }

            if (this.lives <= 0) {
                this.gameOver(); // 목숨이 0이면 게임 종료 및 초기화
            } else {
                alert(`You hit a mine! Lives remaining: ${this.lives}`);
            }
        } else {
            cell.classList.add("revealed");
            cell.textContent = this.board[row][col] > 0 ? this.board[row][col].toString() : "";
            if (this.board[row][col] === 0) {
                // Reveal neighboring cells recursively
                const directions = [
                    [-1, -1],
                    [-1, 0],
                    [-1, 1],
                    [0, -1],
                    [0, 1],
                    [1, -1],
                    [1, 0],
                    [1, 1],
                ];
                for (const [dx, dy] of directions) {
                    this.revealCell(row + dx, col + dy);
                }
            }

            // Check if the game is won
            this.checkWin();
        }
    }

    toggleFlag(row: number, col: number) {
        if (!this.isInBounds(row, col) || this.revealed[row][col]) return;

        this.flagged[row][col] = !this.flagged[row][col];
        const cell = this.gameBoardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;

        if (this.flagged[row][col]) {
            cell.classList.add("flag");
            // Display a different image for flagged cells
            cell.style.backgroundImage = "url('../public/flag.png')";
        } else {
            cell.classList.remove("flag");
            // Reset to default background image
            cell.style.backgroundImage = "none";
        }

        // Check if the game is won
        this.checkWin();
    }

    checkWin() {
        let allMinesFlagged = true;
        let allCellsRevealed = true;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] === -1 && !this.flagged[row][col]) {
                    allMinesFlagged = false;
                }
                if (this.board[row][col] !== -1 && !this.revealed[row][col]) {
                    allCellsRevealed = false;
                }
            }
        }

        if (allMinesFlagged || allCellsRevealed) {
            alert("Congratulations! You've won the game!");
            this.resetGame();
        }
    }

    gameOver() {
        alert("Game Over! You have no more lives left.");
        this.revealAllMines();
        this.resetGame(); // 게임을 리셋하여 초기화
    }

    revealAllMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col] === -1) {
                    const cell = this.gameBoardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    if (cell) {
                        cell.classList.add("mine");
                        cell.classList.remove("flag");
                        cell.style.backgroundImage = "none";
                    }
                }
            }
        }
    }

    updateLivesUI() {
        let livesElement = document.getElementById("lives");
        if (!livesElement) {
            livesElement = document.createElement("div");
            livesElement.id = "lives";
            this.gameBoardElement.parentElement?.prepend(livesElement);
        }
        livesElement.textContent = `Lives: ${this.lives}`;
    }

    updateMinesUI() {
        let minesElement = document.getElementById("mines");
        if (!minesElement) {
            minesElement = document.createElement("div");
            minesElement.id = "mines";
            this.gameBoardElement.parentElement?.prepend(minesElement);
        }
        minesElement.textContent = `Mines: ${this.remainingMines}`;
    }

    resetGame() {
        if (confirm("Would you like to play again?")) {
            this.init(); // 목숨과 남은 폭탄 수를 포함하여 게임을 초기화
        } else {
            alert("Thanks for playing!");
        }
    }
}
