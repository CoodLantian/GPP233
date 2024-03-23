const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const FrameRate = 30;
canvas.width = 800;
canvas.height = 600;
canvas.style.backgroundColor = '#403F3F';
const TimeInterval = 1000 / FrameRate;

let lastKey = ''; // Move it outside the class
const collisionMap = [];
// Assuming collision is defined elsewhere
for (let i = 0; i < collision.length; i += 50) {
    collisionMap.push(collision.slice(i, 50 + i));
}

class Boundary {
    static width = 51;
    static height = 51;
    constructor(Pos) {
        this.Position = Pos;
        this.width = 51;
        this.height = 51;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.Position.x, this.Position.y, this.width, this.height);
        
    }
}

const offset = {
    x: -50,
    y: -1420
};

const boundaries = [];


// Initialize boundaries
collisionMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 28681)
            boundaries.push(new Boundary({ x: j * Boundary.width + offset.x, y: i * Boundary.height + offset.y }));
    });
});

// Create a container object to hold both background and boundaries
const container = {
    background: background,
    boundaries: boundaries
};
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
};

class BG {
    constructor(Pos, imagePath, frames = {max: 1}) {
        this.Pos = Pos;
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
        };
        this.image.src = imagePath;
        this.loaded = false;
        this.frames = frames;
    }

    Draw() {
        if (this.loaded) {
            ctx.drawImage(this.image, 0, 0, this.image.width / this.frames.max, this.image.height, this.Position.x, this.Position.y, this.image.width / this.frames.max, this.image.height);
        } else {
            console.error("Image not yet loaded.");
        }
    }
}

const background = new BG({ x: -50, y: -1420 }, "img/Bg.png", keys);

const playerImage = new Image();
playerImage.src = 'img/playerRight.png';

function updatePosition() {
    
    if (keys.w.pressed && lastKey === 'w') {
        container.background.Pos.y -= 3; // Move container up
        container.boundaries.forEach(boundary => {
            boundary.Position.y -= 3; // Move boundary up
        });
    }
    if (keys.s.pressed && lastKey === 's') {
        container.background.Pos.y += 3; // Move container down
        container.boundaries.forEach(boundary => {
            boundary.Position.y += 3; // Move boundary down
        });
    }
    if (keys.a.pressed && lastKey === 'a') {
        container.background.Pos.x -= 3; // Move container left
        container.boundaries.forEach(boundary => {
            boundary.Position.x -= 3; // Move boundary left
        });
    }
    if (keys.d.pressed && lastKey === 'd') {
        container.background.Pos.x += 3; // Move container right
        container.boundaries.forEach(boundary => {
            boundary.Position.x += 3; // Move boundary right
        });
    }
}

window.addEventListener('keydown', (e) => keyDownHandler(e));
window.addEventListener('keyup', (e) => keyUpHandler(e));

function keyDownHandler(e) {
    switch (e.key) {
        case 'w':
        case 'a':
        case 's':
        case 'd':
            keys[e.key].pressed = true;
            lastKey = e.key;
            break;
    }
}

function keyUpHandler(e) {
    switch (e.key) {
        case 'w':
        case 'a':
        case 's':
        case 'd':
            keys[e.key].pressed = false;
            break;
    }
}

function gameLoop() {
    clearcanvas();
    container.background.Draw();
    updatePosition();
    container.boundaries.forEach(boundary => {
        boundary.draw();
    });
    ctx.drawImage(playerImage, 0, 0, playerImage.width / 4, playerImage.height, 120, 300, playerImage.width / 4, playerImage.height);
}

setInterval(gameLoop, TimeInterval);
