const Canvas = document.querySelector('canvas');
const ctx = Canvas.getContext('2d');
const FrameRate = 30;
Canvas.width = 800;
Canvas.height = 600;
Canvas.style.backgroundColor = 'white';
const TimeInterval = 1000 / FrameRate;

class Tile {
    constructor(pos, size, color, label) {
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.textSize = 30;
        this.Tval = label;
    }

    drawTile(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
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

function getRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    return `rgb(${red}, ${green}, ${blue})`;
}

const Grid = [];
const row = 3;
const column = row;
const tileCounter = ['D', 'A', 'C', ' ', 'B', 'F', 'G', 'E', 'H'];
const resultCounter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', ' '];
var count = 0;
var tempSwapVal = 0;
var tileVal = 1;

for (let i = 1; i <= row; i++) {
    for (let j = 1; j <= column; j++) {
        const posX = j * 120;
        const posY = i * 120;
        Grid.push(createTile(posX, posY));
    }
}

function createTile(x, y) {
    const randomColor = getRandomColor();
    const tile = new Tile({ x, y }, { w: 100, h: 100 }, randomColor, tileCounter[count]);
    count++;
    return tile;
}

function Tile_Update(ctx) {
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

            if (LEFT !== null && Grid[LEFT].Tval === " ") {
                swapVal(clickedTileIndex, LEFT);
                return;
            }
            if (RIGHT !== null && Grid[RIGHT].Tval === " ") {
                swapVal(clickedTileIndex, RIGHT);
                return;
            }
            if (UP !== null && Grid[UP].Tval === " ") {
                swapVal(clickedTileIndex, UP);
                return;
            }
            if (DOWN !== null && Grid[DOWN].Tval === " ") {
                swapVal(clickedTileIndex, DOWN);
                return;
            }
        }
    }
}
window.addEventListener('click', handleMouseClick);
