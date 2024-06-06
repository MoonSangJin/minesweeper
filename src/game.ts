export class Minesweeper {
    private board: number[][];
    private revealed: boolean[][];
    private flagged: boolean[][];
    private gameBoardElement: HTMLElement;
    private rows: number;
    private cols: number;
    private mines: number;

    constructor(gameBoardElement: HTMLElement, rows: number, cols: number, mines: number) {
        this.gameBoardElement = gameBoardElement;
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        this.board = [];
        this.revealed = [];
        this.flagged = [];
    }

    init() {
        this.createBoard();
        this.placeMines();
        this.updateNumbers();
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
                cell.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    this.toggleFlag(row, col);
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
            cell.classList.add("mine");
            // Game over logic here
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
        }
    }

    toggleFlag(row: number, col: number) {
        if (!this.isInBounds(row, col) || this.revealed[row][col]) return;

        this.flagged[row][col] = !this.flagged[row][col];
        const cell = this.gameBoardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;

        if (this.flagged[row][col]) {
            cell.classList.add("flag");
        } else {
            cell.classList.remove("flag");
        }
    }
}
