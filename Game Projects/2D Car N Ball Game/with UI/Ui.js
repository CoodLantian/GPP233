const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const FrameRate = 30;
canvas.width = 800;
canvas.height = 600;
canvas.style.backgroundColor = 'grey';
const TimeInterval = 1000 / FrameRate;

class Keys {
    constructor(Pos, Size, color, text) {
        this.Pos = Pos;
        this.Size = Size;
        this.color = color;
        this.text = text;
    }

    CreateButton() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.Pos.x, this.Pos.y, this.Size.w, this.Size.h);
        ctx.strokeRect(this.Pos.x, this.Pos.y, this.Size.w, this.Size.h);

        // Add text to the button
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.Pos.x + this.Size.w / 2, this.Pos.y + this.Size.h / 2);
    }

    displayTextInCenter(text) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, centerX, centerY);
    }
}

let gameStarted = false;
let infoScreen = false;
let gameScreen = false;
let gameOver = false;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Calculate the position of the key based on the center coordinates
const keyWidth = 100;
const keyHeight = 50;
const keyX = centerX - keyWidth / 2;
const keyY = centerY - keyHeight / 2;

const startKey = new Keys({ x: keyX, y: keyY }, { w: keyWidth, h: keyHeight }, 'red', 'Start');
const infoKey = new Keys({ x: 600, y: 500 }, { w: 30, h: 30 }, 'red', 'i');
const Info = new Keys({ x: keyX, y: keyY }, { w: keyWidth, h: keyHeight }, 'red', 'Start');
const X = new Keys({ x: 100, y: 100 }, { w: 30, h: 30 }, 'red', 'x');
const Restart = new Keys({ x: 200, y: 300 }, { w: keyWidth, h: keyHeight }, 'red', 'Restart');

function startPage() {
    if (!gameStarted && !infoScreen && !gameScreen && !gameOver) {
        startKey.CreateButton();
        infoKey.CreateButton();
    } else if (gameScreen === true) {
        car.updateImage();
        redBall.updateBall();
        fallingBlackBall.updateBall();
        gameTimer.updateTimer();
        score.drawScore(ctx);
        gameMechanics();
    }
}


function infoPage() {
    if (infoScreen === true) {
        Info.displayTextInCenter('Hello, World!');
        X.CreateButton();
    } 
}

function EndScreen() {
    if (score.value === 2) {
        gameScreen = false;
        Restart.CreateButton();
    } else if (!gameOver) {
        //gameStarted = true;
    }
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if the click is within the bounds of the startKey
    if (x >= startKey.Pos.x && x <= startKey.Pos.x + startKey.Size.w && y >= startKey.Pos.y && y <= startKey.Pos.y + startKey.Size.h) {
        console.log('Clicked on the start key!');
        gameStarted = true;
        gameScreen = true;
        gameTimer.isRunning = !gameTimer.isRunning;
    }
    if (x >= Restart.Pos.x && x <= Restart.Pos.x + Restart.Size.w && y >= Restart.Pos.y && y <= Restart.Pos.y + Restart.Size.h) {
        console.log('Clicked on the restart key!');

        gameStarted = false;
    }

    // Check if the click is within the bounds of the X key
    if (x >= X.Pos.x && x <= X.Pos.x + X.Size.w && y >= X.Pos.y && y <= X.Pos.y + X.Size.h) {
        console.log('Clicked on the X key!');
        //gameStarted = false;
        infoScreen = false;
    }

    // Check if the click is within the bounds of the infoKey
    if (x >= infoKey.Pos.x && x <= infoKey.Pos.x + infoKey.Size.w && y >= infoKey.Pos.y && y <= infoKey.Pos.y + infoKey.Size.h) {
        console.log('Clicked on the info key!');
        infoScreen = true;

    }
}


canvas.addEventListener('click', handleClick);

