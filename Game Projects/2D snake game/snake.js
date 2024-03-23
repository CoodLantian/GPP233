const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const FrameRate = 30;
canvas.width = 900;
canvas.height = 700;
canvas.style.backgroundColor = 'grey';
const TimeInterval = 1000 / FrameRate;

class Box {
    constructor(x, y, size) {
        this.pos = { x: x, y: y };
        this.size = { w: size, h: size };
        this.color = 'green';
    }

    drawBox(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        ctx.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }
}

class Snake {
    constructor(startPos, snakeSize) {
        this.Body = [];
        this.startPos = startPos;
        this.snakeSize = snakeSize;
        this.storedLen = 60;
        this.activeLen = 5;

        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;

        this.moveSpeed = this.snakeSize.w;
        this.direction = { x: 0, y: 0 };
        this.createSnake();
    }

    drawBox(ctx) {
        for (let i = 0; i < this.activeLen; i++) {
            this.Body[i].drawBox(ctx);
        }
    }

    createSnake() {
        for (let i = 0; i < this.activeLen; i++) {
            this.Body[i] = new Box(this.startPos.x + i * this.snakeSize.w,
                this.startPos.y, this.snakeSize.w);
        }
    }

    snakeMovement() {
        if (this.moveLeft || this.moveRight || this.moveUp || this.moveDown) {
            for (let i = this.activeLen - 1; i > 0; i--) {
                this.Body[i].pos.x = this.Body[i - 1].pos.x;
                this.Body[i].pos.y = this.Body[i - 1].pos.y;
            }

            if (this.moveLeft) {
                this.moveSnake(-this.moveSpeed, 0);
            }
            if (this.moveRight) {
                this.moveSnake(this.moveSpeed, 0);
            }
            if (this.moveUp) {
                this.moveSnake(0, -this.moveSpeed);
            }
            if (this.moveDown) {
                this.moveSnake(0, this.moveSpeed);
            }
        }
    }

    moveSnake(deltaX, deltaY) {
        this.Body[0].pos.x += deltaX;
        this.Body[0].pos.y += deltaY;
    }

    checkCollision(otherSnake) {
        const head1 = this.Body[0];
        const head2 = otherSnake.Body[0];

        // Check collision between this snake and the other snake
        if (
            head1.pos.x <= head2.pos.x + otherSnake.snakeSize.w &&
            head1.pos.x + this.snakeSize.w >= head2.pos.x &&
            head1.pos.y <= head2.pos.y + otherSnake.snakeSize.w &&
            head1.pos.y + this.snakeSize.w >= head2.pos.y
        ) {
            // Reset this snake and the other snake
            this.reset();
            otherSnake.reset();
        }
    }

    update(ctx) {
        this.snakeMovement();
        this.checkCollision(Player_2); // Check collision with the other snake
        this.drawBox(ctx);
    }

    reset() {
        this.Body = [];
        this.activeLen = 5;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.moveSpeed = this.snakeSize.w;
        this.direction = { x: 0, y: 0 };
        this.createSnake();
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
}

class RedFood extends Ball {
    constructor(pos, rad, color, lifespan) {
        super(pos, rad, color);
        this.lifespan = lifespan;
    }

    updateRedFood() {
        this.pos.x = Math.random() * (canvas.width - 2 * this.rad) + this.rad;
        this.pos.y = Math.random() * (canvas.height - 2 * this.rad) + this.rad;

        // Decrease the lifespan of the red food
        this.lifespan--;

        // Check if the lifespan has reached 0
        if (this.lifespan === 0) {
            // Reset the position of the red food
            this.pos.x = Math.random() * (canvas.width - 2 * this.rad) + this.rad;
            this.pos.y = Math.random() * (canvas.height - 2 * this.rad) + this.rad;

            // Reset the lifespan of the red food
            this.lifespan = 4;
        }
    }
}

const redFood = new RedFood(
    {
        x: Math.random() * (canvas.width - 2 * 20) + 20,
        y: Math.random() * (canvas.height - 2 * 20) + 20,
    },
    10, 'red', 4);

function gameMechanics() {
    const head1 = Player_1.Body[0];
    const head2 = Player_2.Body[0];

    // Check collision between Player_1 and redFood
    if (
        head1.pos.x <= redFood.pos.x + redFood.rad &&
        head1.pos.x + Player_1.snakeSize.w >= redFood.pos.x - redFood.rad &&
        head1.pos.y <= redFood.pos.y + redFood.rad &&
        head1.pos.y + Player_1.snakeSize.w >= redFood.pos.y - redFood.rad
    ) {
        redFood.pos.x = Math.random() * (canvas.width - 2 * redFood.rad) + redFood.rad;
        redFood.pos.y = Math.random() * (canvas.height - 2 * redFood.rad) + redFood.rad;
        const functions = [Player_1.sizeIncrease, Player_1.sizeDecrease, Player_1.speedIncrease, Player_1.speedDecrease];
        const randomFunction = functions[Math.floor(Math.random() * functions.length)];
        randomFunction.call(Player_1); // Call the randomly selected function
    }

    // Check collision between Player_2 and redFood
    if (
        head2.pos.x <= redFood.pos.x + redFood.rad &&
        head2.pos.x + Player_2.snakeSize.w >= redFood.pos.x - redFood.rad &&
        head2.pos.y <= redFood.pos.y + redFood.rad &&
        head2.pos.y + Player_2.snakeSize.w >= redFood.pos.y - redFood.rad
    ) {
        redFood.pos.x = Math.random() * (canvas.width - 2 * redFood.rad) + redFood.rad;
        redFood.pos.y = Math.random() * (canvas.height - 2 * redFood.rad) + redFood.rad;
        const functions = [Player_2.sizeIncrease, Player_2.sizeDecrease, Player_2.speedIncrease, Player_2.speedDecrease];
        const randomFunction = functions[Math.floor(Math.random() * functions.length)];
        randomFunction.call(Player_2); // Call the randomly selected function
    }
}

function updateRedFood() {
    redFood.updateRedFood();
}

// Set the initial lifespan of the red food
redFood.lifespan = 4;

// Call the updateRedFood function every 4 seconds
setInterval(updateRedFood, 4000);
