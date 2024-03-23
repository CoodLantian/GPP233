const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const FrameRate = 30;
canvas.width = 800;
canvas.height = 600;
canvas.style.backgroundColor = 'grey';
const TimeInterval = 1000 / FrameRate;

class Box {
    constructor(x, y, size, color) {
        this.pos = { x: x, y: y };
        this.size = { w: size, h: size };
        this.color = color;
        
       
    }

    drawBox(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        ctx.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }
}

class Snake {
    constructor(startPos, snakeSize, color) {
        this.snakeBody = [];
        this.startPos = startPos;
        this.snakeSize = snakeSize;
        this.length = 7; // length of the snake
        this.color = color;

        this.X = [];
        this.Y = [];

        this.leftArrow = 0;
        this.rightArrow = 0;
        this.upArrow = 0;
        this.downArrow = 0;
        this.moveSpeed = this.snakeSize.w;

        this.calculateXValues();
        this.createSnake();
    }

    createSnake() {
        for (let i = 0; i < this.length; i++) {
           
            this.snakeBody.push(new Box(
                this.startPos.x + i * this.snakeSize.w,
                this.startPos.y,
                this.snakeSize.w, this.color
            ));
        }
    }

    drawSnake(ctx) {
        this.snakeBody.forEach(box => {
            box.drawBox(ctx);
        });
    }

    calculateXValues() {
        // Initialize X and Y values for each box
        for (let i = 0; i < this.length; i++) {
            this.X.push(this.startPos.x + i * this.snakeSize.w);
            this.Y.push(this.startPos.y);
        }
    }

    snakeMovement() {
        if (this.leftArrow === 1) {
            this.moveSnake(-this.moveSpeed, 0);
        }
        if (this.rightArrow === 1) {
            this.moveSnake(this.moveSpeed, 0);
        }
        if (this.upArrow === 1) {
            this.moveSnake(0, -this.moveSpeed);
        }
        if (this.downArrow === 1) {
            this.moveSnake(0, this.moveSpeed);
        }
    }

    checkCollision() {
        const head = this.snakeBody[0];

        // Check collision with walls
        if (head.pos.x < 0 || head.pos.x >= canvas.width - this.snakeSize.w ||
            head.pos.y < 0 || head.pos.y >= canvas.height - this.snakeSize.w) {
            this.resetSnake();
            return;
        }

        // Check collision with self
        for (let i = 1; i < this.snakeBody.length; i++) {
            if (head.pos.x === this.snakeBody[i].pos.x && head.pos.y === this.snakeBody[i].pos.y) {
                this.resetSnake();
                return;
            }
        }
    }

    moveSnake(deltaX, deltaY) {
        // Move the head of the snake
        const head = this.snakeBody[0];
        const newPos = {
            x: head.pos.x + deltaX,
            y: head.pos.y + deltaY
        };
        this.snakeBody.unshift(new Box(newPos.x, newPos.y, this.snakeSize.w,this.color));
        this.snakeBody.pop(); // Remove the tail
    }

    updateSnake() {
        this.checkCollision();
        this.snakeMovement();
        this.drawSnake(ctx);
    }

    resetSnake() {
        // Reset snake to initial position and clear direction
        this.snakeBody = [];
        this.createSnake();
        this.leftArrow = 0;
        this.rightArrow = 0;
        this.upArrow = 0;
        this.downArrow = 0;
    }
}

class Score {
    constructor(x, color, name) {
        this.name = name;
        this.x = x;
        this.color = color; // Store the color
        this.value = 1
    }

    increaseScore() {
        this.value++;
    }
    decreaseScore() {
        this.value--;
    }

    resetScore() {
        this.value = 1;
    }

    getScore() {
        return this.value;
    }

    drawScore(ctx) {
        ctx.font = "20px Arial";
        ctx.fillStyle = this.color; // Use the color parameter here
        ctx.fillText(this.name + ": " + this.value, canvas.width - this.x, 20);
    }
}
class Ball {
    constructor(pos, rad, color) {
        this.pos = pos;
        this.rad = rad;
        this.color = color;
    }

    drawBall(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }


    updateBall() {
        this.drawBall(ctx);
    }
}

var Player_1 = new Snake({ x: 100, y: 100 }, { w: 15 },'green');
var Player_2 = new Snake({ x: 500, y: 100 }, { w: 15 }, 'blue');
const score_P1 = new Score(100, 'green', 'P1'); // Create Score for Player 1 with green color
const score_P2 = new Score(775, 'blue', 'P2');

function drawScores() {
    score_P1.drawScore(ctx);
    score_P2.drawScore(ctx);
}

const redFood = new Ball(
    {
        x: Math.random() * (canvas.width - 2 * 20) + 20,
        y: Math.random() * (canvas.height - 2 * 20) + 20,
    },
    10, 'red');

function gameMechanics() {
    // Check collision between Player 1's head and the red food
    const headP1 = Player_1.snakeBody[0];
    if (
        headP1.pos.x < redFood.pos.x + redFood.rad &&
        headP1.pos.x + Player_1.snakeSize.w > redFood.pos.x - redFood.rad &&
        headP1.pos.y < redFood.pos.y + redFood.rad &&
        headP1.pos.y + Player_1.snakeSize.w > redFood.pos.y - redFood.rad
    ) {
        console.log("Player 1 ate the food!");

        // Increase Player 1's score by 1
        score_P1.increaseScore();
        console.log("Player 1 Score:", score_P1.getScore());

        // Respawn red food at a new random location
        redFood.pos.x = Math.random() * (canvas.width - 2 * redFood.rad) + redFood.rad;
        redFood.pos.y = Math.random() * (canvas.height - 2 * redFood.rad) + redFood.rad;
        console.log("Red food respawned at:", redFood.pos);
    }

    // Check collision between Player 2's head and the red food
    const headP2 = Player_2.snakeBody[0];
    if (
        headP2.pos.x < redFood.pos.x + redFood.rad &&
        headP2.pos.x + Player_2.snakeSize.w > redFood.pos.x - redFood.rad &&
        headP2.pos.y < redFood.pos.y + redFood.rad &&
        headP2.pos.y + Player_2.snakeSize.w > redFood.pos.y - redFood.rad
    ) {
        console.log("Player 2 ate the food!");

        // Increase Player 2's score by 1
        score_P2.increaseScore();
        console.log("Player 2 Score:", score_P2.getScore());

        // Respawn red food at a new random location
        redFood.pos.x = Math.random() * (canvas.width - 2 * redFood.rad) + redFood.rad;
        redFood.pos.y = Math.random() * (canvas.height - 2 * redFood.rad) + redFood.rad;
        console.log("Red food respawned at:", redFood.pos);
    }
}







function onKeyPress(press) {
    switch (press.keyCode) {
        case 37:
            Player_2.leftArrow = 1;
            break;
        case 39:
            Player_2.rightArrow = 1;
            break;
        case 38:
            Player_2.upArrow = 1;
            break;
        case 40:
            Player_2.downArrow = 1;
            break;
        case 65:
            Player_1.leftArrow = 1;
            break;
        case 68:
            Player_1.rightArrow = 1;
            break;
        case 87:
            Player_1.upArrow = 1;
            break;
        case 83:
            Player_1.downArrow = 1;
            break;
    }
}

function onKeyRelease(release) {
    switch (release.keyCode) {
        case 37:
            Player_2.leftArrow = 0;
            break;
        case 39:
            Player_2.rightArrow = 0;
            break;
        case 38:
            Player_2.upArrow = 0;
            break;
        case 40:
            Player_2.downArrow = 0;
            break;
        case 65:
            Player_1.leftArrow = 0;
            break;
        case 68:
            Player_1.rightArrow = 0;
            break;
        case 87:
            Player_1.upArrow = 0;
            break;
        case 83:
            Player_1.downArrow = 0;
            break;
    }
}

window.addEventListener("keydown", onKeyPress);
window.addEventListener("keyup", onKeyRelease);


