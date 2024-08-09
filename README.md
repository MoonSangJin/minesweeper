# Minesweeper Game

Welcome to the Minesweeper game! 🎮 💣

This is a classic Minesweeper game implemented in TypeScript and styled with CSS. The game features an intuitive UI and provides a fun experience for both desktop and mobile users.

## Features

-   **Playable Grid**: A dynamically generated grid where you can reveal cells and place flags.
-   **Lives System**: Start with 5 lives. Lose a life every time you hit a mine. Game ends when lives reach 0.
-   **Flagging Mines**: Mark suspected mines with flags. Incorrect flags or mines will reduce your lives.
-   **Win Condition**: Successfully mark all mines or reveal all non-mine cells to win the game.
-   **Responsive Design**: Works well on both desktop and mobile devices.

## Getting Started

### Prerequisites

-   A modern web browser (Chrome, Firefox, etc.)
-   Node.js and npm (for local development and testing)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/MoonSangJin/minesweeper.git
    cd minesweeper
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Start the development server**:

    ```bash
    npm start
    ```

4. Open `http://localhost:3000` in your web browser to play the game.

## Usage

-   **Click**: Reveal a cell.
-   **Right-Click** (or **Long Press** on mobile): Place or remove a flag on a cell.

### UI Elements

-   **Lives Counter**: Displays the number of remaining lives.
-   **Mines Counter**: Shows the number of remaining mines.

### Screenshots

![Gameplay Screenshot](/public/screenshot.png)

## Contributing

Feel free to fork the repository and submit pull requests for improvements or bug fixes. All contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments

-   Inspired by the classic Minesweeper game.
-   Special thanks to the open-source community for providing libraries and tools used in this project.

---

Happy sweeping! 🌟
