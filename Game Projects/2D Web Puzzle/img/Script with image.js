const tankCanvas = document.querySelector('canvas');
const ctx = tankCanvas.getContext('2d');
const FrameRate = 30;
tankCanvas.width = 800;
tankCanvas.height = 600;
tankCanvas.style.backgroundColor = 'white';
const TimeInterval = 1000 / FrameRate;

class puzzle {
    constructor(pos, size, imageSrc) {
        this.pos = pos;
        this.size = size;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    drawPuzzle(ctx) {
        ctx.drawImage( this.pos.x, this.pos.y, this.size.w, this.size.h, this.image);
    }

    updatePuzzle() {
        this.drawPuzzle(ctx);

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
const p1 = new puzzle({ x: 100, y: 100 }, { w: 100, h: 100 }, 'Puzzle\a1.png');
const p2 = new puzzle({ x: 200, y: 100 }, { w: 100, h: 100 }, 'Puzzle\a2.png');
const p3 = new puzzle({ x: 300, y: 100 }, { w: 100, h: 100 }, 'Puzzle\a3.png');
const p4 = new puzzle({ x: 100, y: 200 }, { w: 100, h: 100 }, 'Puzzle\a4.png');
const p5 = new puzzle({ x: 200, y: 200 }, { w: 100, h: 100 }, 'Puzzle\a5.png');
const p6 = new puzzle({ x: 300, y: 200 }, { w: 100, h: 100 }, 'Puzzle\a6.png');
const p7 = new puzzle({ x: 100, y: 300 }, { w: 100, h: 100 }, 'Puzzle\a7.png');
const p8 = new puzzle({ x: 200, y: 300 }, { w: 100, h: 100 }, 'Puzzle\a8.png');
const empty = new puzzle({ x: 300, y: 300 }, { w: 100, h: 100 }, 'Puzzle\a9.png');
Grid.push(p1, p2, p3, p4, p5, p6, p7, p8, empty);

function isAdjacent(puzzle1, puzzle2) {
    const dx = Math.abs(puzzle1.pos.x - puzzle2.pos.x);
    const dy = Math.abs(puzzle1.pos.y - puzzle2.pos.y);
    return (dx === puzzle1.size.w && dy === 0) || (dx === 0 && dy === puzzle1.size.h);
}


function handleMouseClick(event) {
    const mouseX = event.clientX - tankCanvas.getBoundingClientRect().left;
    const mouseY = event.clientY - tankCanvas.getBoundingClientRect().top;

    for (const clickedPuzzle of Grid) {
        if (clickedPuzzle.isClicked(mouseX, mouseY)) {
            console.log(`Clicked on puzzle at (${clickedPuzzle.pos.x}, ${clickedPuzzle.pos.y})`);

            // Check adjacent puzzles
            const adjacentPuzzles = Grid.filter(puzzle => isAdjacent(clickedPuzzle, puzzle));

            console.log('Adjacent puzzles:', adjacentPuzzles);

            // Check if there's an empty puzzle adjacent
            const emptyPuzzle = adjacentPuzzles.find(puzzle => puzzle.color === 'white');

            if (emptyPuzzle) {
                console.log('Empty puzzle adjacent:', emptyPuzzle);

                // Swap positions with the empty puzzle
                const tempPos = { x: clickedPuzzle.pos.x, y: clickedPuzzle.pos.y };
                clickedPuzzle.pos = { x: emptyPuzzle.pos.x, y: emptyPuzzle.pos.y };
                emptyPuzzle.pos = tempPos;

            }
        }
    }
}

tankCanvas.addEventListener('click', handleMouseClick);