const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const FrameRate = 30;
canvas.width = 1240;
canvas.height = 1024;
canvas.style.backgroundColor = 'grey';
const TimeInterval = 1000 / FrameRate;

class Pixel {
    constructor(Pos, size, color) {
        this.Pos = Pos;
        this.size = size;
        this.color = color;
    }

    drawObj(ctx) {
        if (this.color !== null) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.Pos.x, this.Pos.y, this.size.w, this.size.h);
            //ctx.strokeRect(this.Pos.x, this.Pos.y, this.size.w, this.size.h);
        }
    }
}

class gridData {
    constructor(Xpos, Ypos, PixelSize, row, column, bitmap) {
        this.Xpos = Xpos;
        this.Ypos = Ypos;
        this.PixelSize = PixelSize;
        this.row = row;
        this.column = column;
        this.bitmap = bitmap;
        this.Grid = this.createGrid();
        this.moveDirection = 'true'; // Initial movement direction
        this.moveRight = false;
        this.moveLeft = false;
        this.moveSpeed = 10;
        this.rotate = 0;
    }

    createGrid() {
        const Grid = [];
        let count = 0;
        let index = 0;
        for (let i = 1; i <= this.row; i++) {
            for (let j = 1; j <= this.column; j++) {
                const posX = this.Xpos + j * this.PixelSize;
                const posY = this.Ypos + i * this.PixelSize;
                Grid[index] = this.createPixel(posX, posY, this.bitmap[count]);
                count++;
                index++;
            }
        }
        return Grid;
    }

    drawGrid() {
        ctx.save(); // Save the current canvas state
        ctx.translate(this.Xpos + (this.column * this.PixelSize) / 2, this.Ypos + (this.row * this.PixelSize) / 2); // Translate to the center of the grid
        ctx.rotate(this.rotate); // Rotate the canvas
        ctx.translate(-(this.Xpos + (this.column * this.PixelSize) / 2), -(this.Ypos + (this.row * this.PixelSize) / 2)); // Translate back to the original position
        for (let i = 0; i < this.Grid.length; i++) {
            this.Grid[i].drawObj(ctx); // Draw each pixel of the grid
        }
        ctx.restore(); // Restore the canvas state
    }


    moveGrid() {
        if (this.moveDirection === 'true') {
            for (let i = 0; i < this.Grid.length; i++) {
                this.Grid[i].Pos.x++;
            }
        }
    }
    moveShip() {
        // Move the entire grid based on the current direction
        if (this.moveRight === true) {
            for (let i = 0; i < this.Grid.length; i++) {
                this.Grid[i].Pos.x += this.moveSpeed;
                this.Grid[i].rotation = 10;
            }
        }
        if (this.moveLeft === true) {
            for (let i = 0; i < this.Grid.length; i++) {
                this.Grid[i].Pos.x -= this.moveSpeed;
                this.Grid[i].rotation = -10;
            }
        }

        // Check if the ship has crossed the canvas boundaries
        let gridWidth = this.column * this.PixelSize;
        for (let i = 0; i < this.Grid.length; i++) {
            if (this.Grid[i].Pos.x > canvas.width) {
                // Move the entire grid to the left border
                for (let j = 0; j < this.Grid.length; j++) {
                    this.Grid[j].Pos.x -= (canvas.width + gridWidth);
                }
            } else if (this.Grid[i].Pos.x + this.PixelSize < 0) {
                // Move the entire grid to the right border
                for (let j = 0; j < this.Grid.length; j++) {
                    this.Grid[j].Pos.x += (canvas.width + gridWidth);
                }
            }
        }
    }




    createPixel(x, y, i) {
        let color = 'Black';
        if (i === 0) {
            color = null;
        } else if (i === 2) {
            color = 'white';
        } else if (i === 3) {
            color = 'Red';
        } else if (i === 4) {
            color = 'blue';
        }

        return new Pixel({ x: x, y: y }, { w: this.PixelSize, h: this.PixelSize }, color);
    }
}




// obj = new grid class (Xpos,Ypos,pixelSize,row = height, column = width,bitmap)
const Ship_1 = new gridData(620, 900, 2, 34, 30, Ship_1_BitMap);

const MotherShip = new gridData(200, 50, 11, 7, 18, MotherShip_BitMap);
const bunkerIntact = new gridData(450, 500, 4, 40, 60, bunkerIntact_BitMap);

document.addEventListener('keydown', function (event) {
    // Check if 'a' key is pressed for left movement
    if (event.keyCode === 68) {
        Ship_1.moveRight = true;
    }
    // Check if 'd' key is pressed for right movement
    else if (event.keyCode === 65) {
        Ship_1.moveLeft = true;
    }
    if (event.code === 'Space') {
       
    }

});

document.addEventListener('keyup', function (event) {
    // Check if 'a' key is pressed for left movement
    if (event.keyCode === 68) {
        Ship_1.moveRight = false;
    }
    // Check if 'd' key is pressed for right movement
    else if (event.keyCode === 65) {
        Ship_1.moveLeft = false;
    }
    if (event.code === 'Space') {
        // Create new bullets
        bulletPool.createBullets();
        bulletPool.updateBullet();
    }
});

const aliensGrid = [];

function initializeAliensGrid() {
    // Define the number of rows and columns for the alien grid
    const numRows = 5;
    const numCols = 10;

    // Create a 2D array to hold the aliens
    // Create a loop to generate the aliens and position them in a grid
    for (let row = 0; row < numRows; row++) {
        const rowArray = [];

        for (let col = 0; col < numCols; col++) {
            const posX = 50 + col * 65;
            const posY = 150 + row * 50;
            // Create a new instance of gridData for each alien and push it to the rowArray
            switch (row) {
                case 0:
                    rowArray.push(new gridData(posX, posY, 5, 7, 9, Invador_1_BitMap));
                    break;
                case 1:
                    rowArray.push(new gridData(posX, posY, 5, 7, 8, invader_2_BitMap));
                    break;
                case 2:
                    rowArray.push(new gridData(posX, posY, 5, 8, 11, invader_3_BitMap));
                    break;
                case 3:
                    rowArray.push(new gridData(posX, posY, 5, 8, 12, invader_4_BitMap));
                    break;
                case 4:
                    rowArray.push(new gridData(posX, posY, 5, 8, 12, invader_4_BitMap));
                    break;
            }
        }
        // Push the rowArray to the aliensGrid
        aliensGrid.push(rowArray);
    }
}

initializeAliensGrid();
