import { Minesweeper } from "./game";

document.addEventListener("DOMContentLoaded", () => {
    const gameBoardElement = document.getElementById("game-board") as HTMLElement;
    const minesweeper = new Minesweeper(gameBoardElement, 10, 10, 10);
    minesweeper.init();
});
