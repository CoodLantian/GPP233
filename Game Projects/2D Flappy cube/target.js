class Target {
    constructor(pos, rad, color) {
        this.pos = pos;
        this.rad = rad;
        this.color = color;
        this.dy = 5;
    }

    drawTarget(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    updateBomb() {
        if (this.color) {
            this.pos.y += this.dy;

            // Reset the position if it goes off the canvas
            if (this.pos.y - this.rad > canvas.height) {
                this.pos.y = -this.rad;
                this.pos.x = Math.random() * (canvas.width - 2 * this.rad) + this.rad;
            }
        }
    }

    updateTarget() {
        this.updateBomb();
        this.drawTarget(ctx);
    }
}

let bomb = null; // Single bomb object

function createBomb() {
    // Randomize position
    let posX = Math.random() * (canvas.width - 2 * 15) + 15; // Random x within canvas
    let posY = -15; // Start from above the canvas
    let rad = Math.random() * (35 - 20) + 20; // Random radius between 20 and 35
    let color = 'black'; // Bomb color

    // Create new bomb object
    return new Target({ x: posX, y: posY }, rad, color);
}


function checkBombCreation() {
    if (!bomb) { // Create a bomb if no bomb exists
        bomb = createBomb();
    }
}

function BombUpdate() {
    // Update and draw the bomb
    if (bomb) {
        bomb.updateTarget();
    }

    // Check if it's time to create a new bomb
    checkBombCreation();

    // Remove the bomb if it has gone off the canvas
    if (bomb && bomb.pos.y - bomb.rad > canvas.height) {
        bomb = null;
    }
}

class Bullet {
    constructor(pos, rad, color, dy) {
        this.pos = pos;
        this.rad = rad;
        this.color = color;
        this.dy = dy; // Change the direction to move upwards
    }

    drawBullet(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    updateBullet() {
        this.pos.y += this.dy;

        // Remove the bullet if it goes off the canvas
        return this.pos.y + this.rad >= 0;
    }
}

let redBalls = []; // Array to store red ball objects

function createRedBall() {
    // Randomize position
    let posX = Flappy.pos.x + Flappy.size.w / 2;
    let posY = Flappy.pos.y + Flappy.size.h / 2;
    let rad = 5;
    let color = 'red'; // Red ball color
    let dy = -5; // Change the direction to move upwards

    // Create new red ball object and push it into the array
    redBalls.push(new Bullet({ x: posX, y: posY }, rad, color, dy));
}

function redBallsUpdate() {
    // Update and draw each red ball
    for (let i = redBalls.length - 1; i >= 0; i--) {
        if (!redBalls[i].updateBullet()) {
            // Remove the bullet from the array if it goes off the canvas
            redBalls.splice(i, 1);
        } else {
            redBalls[i].drawBullet(ctx);
        }
    }
}

function gameMechanics() {
    // Check if there's a bomb
    if (bomb) {
        // Check collision with Flappy
        if (
            Flappy.pos.x <= bomb.pos.x + bomb.rad &&
            Flappy.pos.x + Flappy.size.w >= bomb.pos.x - bomb.rad &&
            Flappy.pos.y <= bomb.pos.y + bomb.rad &&
            Flappy.pos.y + Flappy.size.h >= bomb.pos.y - bomb.rad
        ) {
            score.decreaseScore(1); // Decrease the score by 1
            resetBomb();
        }

        // Check collision with red balls
        for (let i = 0; i < redBalls.length; i++) {
            if (
                redBalls[i].pos.x <= bomb.pos.x + bomb.rad &&
                redBalls[i].pos.x >= bomb.pos.x - bomb.rad &&
                redBalls[i].pos.y <= bomb.pos.y + bomb.rad &&
                redBalls[i].pos.y >= bomb.pos.y - bomb.rad
            ) {
                score.increaseScore(1); // Increase the score by 1
                redBalls.splice(i, 1); // Remove the red ball from the array
                resetBomb();
                break; // Break out of the loop since the bomb can hit only one red ball at a time
            }
        }
    }
}

function resetBomb() {
    bomb.pos.y = -bomb.rad; // Reset the position of the bomb
    bomb.pos.x = Math.random() * (canvas.width - 2 * bomb.rad) + bomb.rad;
}
