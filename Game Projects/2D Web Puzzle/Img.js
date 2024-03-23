const Canvas = document.querySelector('canvas');
const ctx = Canvas.getContext('2d');
const FrameRate = 30;
Canvas.width = 400; // Adjust canvas width to accommodate tiles
Canvas.height = 400; // Adjust canvas height to accommodate tiles
Canvas.style.backgroundColor = 'white';
const TimeInterval = 1000 / FrameRate;

class Tile {
    constructor(pos, size, imgSrc, label) {
        this.pos = pos;
        this.size = size;
        this.img = new Image();
        this.img.src = imgSrc;
        this.textSize = 30;
        this.Tval = label;
    }

    drawTile(ctx) {
        ctx.drawImage(this.img, this.pos.x, this.pos.y, this.size.w, this.size.h);
        ctx.fillStyle = 'yellow';
        ctx.font = `${this.textSize}px Arial`;
        ctx.fillText(this.Tval, this.pos.x + 20, this.pos.y + 30 + this.textSize);
    }

    updateTile() {
        this.drawTile(ctx);
    }

    isClicked(mouseX, mouseY) {
        return (
            mouseX >= this.pos.x &&
            mouseX <= this.pos.x + this.size.w &&
            mouseY >= this.pos.y &&
            mouseY <= this.pos.y + this.size.h
        );
    }
}

const Grid = [];
const row = 3;
const column = row;
const tileCounter = ['D', 'A', 'C', 'I', 'B', 'F', 'G', 'E', 'H'];
const resultCounter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
var count = 0;
var tempSwapVal = 0;
var tileVal = 1;

for (let i = 0; i < row; i++) { // Start from 0
    for (let j = 0; j < column; j++) { // Start from 0
        const posX = j * 100; // Adjust tile size
        const posY = i * 100; // Adjust tile size
        Grid.push(createTile(posX, posY));
    }
}

function createTile(x, y) {
    const imgSrc = `img/${tileCounter[count]}.png`; // Assuming your images are named like 1.png, 2.png, etc.
    const tile = new Tile({ x, y }, { w: 100, h: 100 }, imgSrc, tileCounter[count]);
    count++;
    return tile;
}

function Tile_Update(ctx) {
    ctx.clearRect(0, 0, Canvas.width, Canvas.height); // Clear canvas before drawing
    for (const tile of Grid) {
        tile.updateTile(ctx);
    }
    if (Check()) {
        console.log("Game Over!");
    }
}

function Check() {
    for (var i = 0; i < arrLen; i++) {
        if (Grid[i].Tval !== resultCounter[i]) {
            return false;
        }
    }
    return true;
}

function swapVal(tile1, tile2) {
    console.log(tile1 + "_" + tile2);
    tempSwapVal = Grid[tile1].Tval;
    Grid[tile1].Tval = Grid[tile2].Tval;
    Grid[tile2].Tval = tempSwapVal;
}

var arrLen = Grid.length;

function handleMouseClick(event) {
    const mouseX = event.clientX - Canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - Canvas.getBoundingClientRect().top;

    for (let i = 0; i < arrLen; i++) {
        const tile = Grid[i];
        if (
            mouseX >= tile.pos.x &&
            mouseX <= tile.pos.x + tile.size.w &&
            mouseY >= tile.pos.y &&
            mouseY <= tile.pos.y + tile.size.h
        ) {
            const clickedTileIndex = i;
            let UP = i - column;
            let DOWN = i + column;
            let RIGHT = i + 1;
            let LEFT = i - 1;

            if (UP < 0) {
                UP = null;
            }
            if (DOWN >= arrLen || (i + 1) % column === 0) {
                DOWN = null;
            }
            if (i % column === 0) {
                LEFT = null;
            }
            if ((i + 1) % column === 0) {
                RIGHT = null;
            }

            console.log("LEFT = " + LEFT + " RIGHT = " + RIGHT + " DOWN = " + DOWN + " UP = " + UP);

            if (LEFT !== null && Grid[LEFT].Tval === "I") {
                swapVal(clickedTileIndex, LEFT);
                return;
            }
            if (RIGHT !== null && Grid[RIGHT].Tval === "I") {
                swapVal(clickedTileIndex, RIGHT);
                return;
            }
            if (UP !== null && Grid[UP].Tval === "I") {
                swapVal(clickedTileIndex, UP);
                return;
            }
            if (DOWN !== null && Grid[DOWN].Tval === "I") {
                swapVal(clickedTileIndex, DOWN);
                return;
            }
        }
    }
}
window.addEventListener('click', handleMouseClick);

// Initial update
Tile_Update(ctx);
