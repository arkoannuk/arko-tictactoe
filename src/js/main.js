import '../scss/styles.scss'
import * as bootstrap from 'bootstrap'


const gameBoard = (function () {
    const symbols = Array(9).fill(' ')


    function createBoard(symbolValue, index) {
        const symbolContainer = document.createElement('div');
        symbolContainer.className = 'symbolContainer border d-flex stretched';
        symbolContainer.onclick = function () {
            gameController.playTurn(index)
        };

        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbolDiv my-auto mx-auto fs-1';
        symbolDiv.textContent = symbolValue;
        symbolDiv.dataset.index = index;

        symbolContainer.appendChild(symbolDiv);
        const boxesContainer = document.querySelector('.boxes');
        boxesContainer.appendChild(symbolContainer);
    }


    symbols.forEach((symbolValue, index) => {
        createBoard(symbolValue, index)
    });
    return {
        symbols: symbols
    };
})();

const displayController = (function () {
    const statusText = document.querySelector("#statusText")


    function updateBoard(symbolValue, index) {
        gameBoard.symbols[index] = symbolValue
        const targetDiv = document.querySelector(`[data-index="${index}"]`);
        targetDiv.textContent = symbolValue
    }


    function declareWinner(currentPlayer) {
        statusText.textContent = `Player ${currentPlayer} has won!`
    }


    function declareTie() {
        statusText.textContent = `It's a Tie!`
    }


    function declarePlayer(currentPlayer) {
        statusText.textContent = `Player ${currentPlayer}'s turn`
    }


    return {
        updateBoard: updateBoard,
        declareWinner: declareWinner,
        declareTie: declareTie,
        declarePlayer: declarePlayer,
    };
})();


const gameController = (function () {
    let currentPlayer = 'X'
    let round = 0
    let gameEnded = false
    let boardUpdated = false


    function getCurrentPlayer() {
        return currentPlayer;
    }

    
    function updateTile(index) {
        if (!["X", "O"].includes(gameBoard.symbols[index]) && !gameEnded) {
            displayController.updateBoard(currentPlayer, index)
            round++
            boardUpdated = true
        }
    }


    function checkWinStatus() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]            // Diagonals
        ];
        for (const pattern of winPatterns) {
            if (pattern.every(index => gameBoard.symbols[index] === currentPlayer)) {
                displayController.declareWinner(currentPlayer)
                gameEnded = true
            }
        }
    }


    function checkTieStatus() {
        if (round === 9 && !gameEnded) {
            displayController.declareTie();
            gameEnded = true
        }
    }


    function changePlayer() {
        if (!gameEnded && boardUpdated) {
            currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
            displayController.declarePlayer(currentPlayer)
            boardUpdated = false
        }
    }


    function playTurn(index) {
        updateTile(index)
        checkWinStatus()
        checkTieStatus()
        changePlayer()
    }


    function restartGame() {
        const restartButton = document.querySelector('#restartButton');
        restartButton.addEventListener('click', function () {
            gameBoard.symbols = Array(9).fill(' ');
            gameBoard.symbols.forEach((symbolValue, index) => {
                const targetDiv = document.querySelector(`[data-index="${index}"]`);
                targetDiv.textContent = symbolValue;
            });
            currentPlayer = 'X';
            round = 0;
            gameEnded = false;
            displayController.declarePlayer(currentPlayer);
        });
    }


    restartGame();
    return {
        playTurn: playTurn,
        getCurrentPlayer: getCurrentPlayer,
    };
})()
