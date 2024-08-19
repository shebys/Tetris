const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const BOARD_WIDTH = COLS * BLOCK_SIZE;
const BOARD_HEIGHT = ROWS * BLOCK_SIZE;

const colors = [
    'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

const shapes = [
    // T shape
    [[1, 1, 1], [0, 1, 0]],
    // O shape
    [[1, 1], [1, 1]],
    // I shape
    [[1, 1, 1, 1]],
    // S shape
    [[0, 1, 1], [1, 1, 0]],
    // Z shape
    [[1, 1, 0], [0, 1, 1]],
    // J shape
    [[1, 0, 0], [1, 1, 1]],
    // L shape
    [[0, 0, 1], [1, 1, 1]]
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentShape;
let currentPosition = { x: 0, y: 0 };
let gameInterval;

function drawBoard() {
    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillStyle = colors[cell - 1];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#000';
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function drawShape(shape, offsetX, offsetY) {
    shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillStyle = colors[cell - 1];
                ctx.fillRect((offsetX + x) * BLOCK_SIZE, (offsetY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#000';
                ctx.strokeRect((offsetX + x) * BLOCK_SIZE, (offsetY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function moveShape(dx, dy) {
    currentPosition.x += dx;
    currentPosition.y += dy;
    if (checkCollision()) {
        currentPosition.x -= dx;
        currentPosition.y -= dy;
        return false;
    }
    return true;
}

function rotateShape() {
    const shape = currentShape.shape;
    const rotated = shape[0].map((_, i) => shape.map(row => row[i])).reverse();
    currentShape.shape = rotated;
    if (checkCollision()) {
        currentShape.shape = shape;
    }
}

function checkCollision() {
    const shape = currentShape.shape;
    return shape.some((row, y) => {
        return row.some((cell, x) => {
            if (cell) {
                const boardX = currentPosition.x + x;
                const boardY = currentPosition.y + y;
                return (
                    boardX < 0 || boardX >= COLS || boardY >= ROWS ||
                    (boardY >= 0 && board[boardY][boardX])
                );
            }
            return false;
        });
    });
}

function placeShape() {
    currentShape.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                board[currentPosition.y + y][currentPosition.x + x] = cell;
            }
        });
    });
    clearLines();
    newShape();
}

function clearLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

function newShape() {
    const shapeIndex = Math.floor(Math.random() * shapes.length);
    currentShape = {
        shape: shapes[shapeIndex].map(row => row.map(cell => (cell ? shapeIndex + 1 : 0))),
        color: colors[shapeIndex]
    };
    currentPosition = { x: Math.floor(COLS / 2) - 1, y: 0 };
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('Game Over');
    }
}

function gameLoop() {
    if (!moveShape(0, 1)) {
        placeShape();
    }
    drawBoard();
    drawShape(currentShape.shape, currentPosition.x, currentPosition.y);
}

function handleKey(e) {
    switch (e.key) {
        case 'ArrowLeft':
            moveShape(-1, 0);
            break;
        case 'ArrowRight':
            moveShape(1, 0);
            break;
        case 'ArrowDown':
            moveShape(0, 1);
            break;
        case 'ArrowUp':
            rotateShape();
            break;
    }
    drawBoard();
    drawShape(currentShape.shape, currentPosition.x, currentPosition.y);
}

document.addEventListener('keydown', handleKey);

newShape();
gameInterval = setInterval(gameLoop, 500);
