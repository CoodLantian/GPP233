const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const frameRate = 30;
canvas.style.backgroundColor = 'grey';
const TimeInterval = 1000 / frameRate;

class Car {
    constructor(pos, size, imageSrc) {
        this.pos = pos;
        this.size = size;
        this.image = new Image();
        this.image.src = imageSrc;

        this.MoveSpeed = 5;
        this.SqmidX = this.pos.x + (this.size.width / 2);
        this.SqmidY = this.pos.y + (this.size.height / 2);
        this.rotationAngle = 0;
        

        this.rotateRight = false;
        this.rotateLeft = false;
        this.moveUp = false;
    }

    drawCar(ctx) {
        ctx.save();
        ctx.translate(this.pos.x + this.size.width / 2, this.pos.y + this.size.height / 2);
        ctx.rotate(this.rotationAngle);
        ctx.drawImage(this.image, - this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
        ctx.restore();
    }

    rotation() {
        if (this.rotateRight) {
            this.rotationAngle += Math.PI / 180;
        }
        if (this.rotateLeft) {
            this.rotationAngle -= Math.PI / 180;
        }
    }

    movement() {
        if (this.moveUp) {
            this.dy = Math.sin(this.rotationAngle) * this.MoveSpeed;
            this.dx = Math.cos(this.rotationAngle) * this.MoveSpeed;
            this.pos.x += this.dx;
            this.pos.y += this.dy;

            //boundary collition
            if (this.pos.x < 0) {
                this.pos.x = 0;
            }
            if (this.pos.x + this.size.width > canvas.width) {
                this.pos.x = canvas.width - this.size.width;
            }
            if (this.pos.y < 0) {
                this.pos.y = 0;
            }
            if (this.pos.y + this.size.height > canvas.height) {
                this.pos.y = canvas.height - this.size.height;
            }
        }
    }


    updateImage() {
        this.rotation();
        this.movement();
        this.drawCar(ctx);
    }
}

class Ball {
    constructor(pos, rad, color) {
        this.pos = pos;
        this.rad = rad;
        this.color = color;
        this.dy = color === 'red' ? 0 : 5;
    }

    drawBall(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    updateFallingBall() {
        if (this.color === 'black') {
            this.pos.y += this.dy;

            // Reset the position if it goes off the canvas
            if (this.pos.y - this.rad > canvas.height) {
                this.pos.y = -this.rad;
                this.pos.x = Math.random() * (canvas.width - 2 * this.rad) + this.rad;
            }
        }
    }

    updateBall() {
        this.updateFallingBall();
        this.drawBall(ctx);
    }
}

class Timer {
    constructor() {
        this.sec = 0;
        this.min = 0;
        this.hour = 0;
        this.fcounter = 0;
        this.isRunning = false;
    }

    drawTimer(ctx) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(
            this.formatTime(this.hour) + ":" + this.formatTime(this.min) + ":" + this.formatTime(this.sec),
            10,
            20
        );
    }

    formatTime(unit) {
        return unit < 10 ? "0" + unit : unit;
    }

    updateTimerDisplay() {
        document.getElementById('timerDisplay').innerHTML =
            this.formatTime(this.hour) +
            ":" +
            this.formatTime(this.min) +
            ":" +
            this.formatTime(this.sec);
    }

    timer() {
        if (this.isRunning) {
            this.fcounter++;

            if (this.fcounter === 30) {
                this.fcounter = 0;
                this.sec++;

                if (this.sec === 60) {
                    this.sec = 0;
                    this.min++;

                    if (this.min === 60) {
                        this.min = 0;
                        this.hour++;
                    }
                }
            }

            this.updateTimerDisplay();
        }
    }

    updateTimer() {
        this.updateTimerDisplay();
        this.drawTimer(ctx)
        this.timer();
    }
}

class Score {
    constructor() {
        this.value = 1;
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
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + this.value, canvas.width - 100, 20);
    }
}


let gameStarted = false;

function UpdateGame() {
    if (!gameStarted) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";

        const textX = canvas.width / 2 - ctx.measureText("Press Space Bar to Start").width / 2;
        const textY = canvas.height / 2 - 20;

        ctx.fillText("Press Space Bar to Start", textX, textY);
        ctx.font = "20px Arial";

        const instructionsX = canvas.width / 2 - ctx.measureText("Use Arrow Keys to Play").width / 2;

        ctx.fillText("Use Arrow Keys to Play", instructionsX, textY + 40);
        ctx.fillText("↑: Move Up, →: Rotate Right, ←: Rotate Left", instructionsX - 120, textY + 80);
    } else {
        // Game logic when the game has started
        car.updateImage();
        redBall.updateBall();
        fallingBlackBall.updateBall();
        gameTimer.updateTimer();
        score.drawScore(ctx);
        gameMechanics();
    }
}

const car = new Car({ x: 50, y: 50 }, { width: 80, height: 40 }, "img/pngwing.com.png");

const redBall = new Ball(
    {
    x: Math.random() * (canvas.width - 2 * 20) + 20,
    y: Math.random() * (canvas.height - 2 * 20) + 20,
    },
    10, 'red');

const fallingBlackBall = new Ball(
    {
        x: Math.random() * (canvas.width - 2 * 10) + 10,
        y: -10
    },
    10,
    'black'
);

const gameTimer = new Timer();
const score = new Score();

function gameMechanics() {
    // Check collision with red ball
    if (
        car.pos.x <= redBall.pos.x + redBall.rad &&
        car.pos.x + car.size.width >= redBall.pos.x - redBall.rad &&
        car.pos.y <= redBall.pos.y + redBall.rad &&
        car.pos.y + car.size.height >= redBall.pos.y - redBall.rad
    ) {
        score.increaseScore(1); // Increase the score by 1
        redBall.rad += 5
        redBall.pos.x = Math.random() * (canvas.width - 2 * redBall.rad) + redBall.rad;
        redBall.pos.y = Math.random() * (canvas.height - 2 * redBall.rad) + redBall.rad;
    }

    // Check collision with falling black ball
    if (
        car.pos.x <= fallingBlackBall.pos.x + fallingBlackBall.rad &&
        car.pos.x + car.size.width >= fallingBlackBall.pos.x - fallingBlackBall.rad &&
        car.pos.y <= fallingBlackBall.pos.y + fallingBlackBall.rad &&
        car.pos.y + car.size.height >= fallingBlackBall.pos.y - fallingBlackBall.rad
    ) {
        score.decreaseScore(-1); // Decrease the score by 1
        //fallingBlackBall.dy++;
        fallingBlackBall.pos.y = -fallingBlackBall.rad; // Reset the position of the falling black ball
        fallingBlackBall.pos.x = Math.random() * (canvas.width - 2 * fallingBlackBall.rad) + fallingBlackBall.rad;
    }
}
document.addEventListener("keydown", function (event) {
    console.log("Keydown event:", event.key);
    if (event.key === " " || event.key === "32") {
        gameStarted = true;
        gameTimer.isRunning = !gameTimer.isRunning;
    }
    if (event.key === "ArrowRight") {
        car.rotateRight = true;
    }
    if (event.key === "ArrowLeft") {
        car.rotateLeft = true;
    }
    if (event.key === "ArrowUp") {
        car.moveUp = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowRight") {
        car.rotateRight = false;
    }
    if (event.key === "ArrowLeft") {
        car.rotateLeft = false;
    }
    if (event.key === "ArrowUp") {
        car.moveUp = false;
    }
});