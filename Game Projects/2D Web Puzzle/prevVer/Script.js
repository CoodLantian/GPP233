const Canvas = document.querySelector('canvas');
const ctx = Canvas.getContext('2d');
const FrameRate = 30;
Canvas.width = 800;
Canvas.height = 600;
Canvas.style.backgroundColor = 'white';
const TimeInterval = 1000 / FrameRate;

class Puzzle {
    constructor(pos, size, color, label) {
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.label = label;
    }

    drawPuzzle(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        ctx.fillStyle = 'yellow';
        ctx.fillText(this.label, this.pos.x + 20, this.pos.y + 20);
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

const Grid = [
    new Puzzle ({ x: 100, y: 100 }, { w: 100, h: 100 }, 'red', 't1'),
    new Puzzle ({ x: 200, y: 100 }, { w: 100, h: 100 }, 'blue', 't2'),
    new Puzzle ( { x: 300, y: 100 }, { w: 100, h: 100 }, 'green', 't3'),
    new Puzzle ( { x: 100, y: 200 }, { w: 100, h: 100 }, 'orange', 't4'),
    new Puzzle ( { x: 200, y: 200 }, { w: 100, h: 100 }, 'cyan', 't5' ),
    new Puzzle ( { x: 300, y: 200 }, { w: 100, h: 100 }, 'pink', 't6' ),
    new Puzzle ( { x: 100, y: 300 }, { w: 100, h: 100 }, 'black', 't7' ),
    new Puzzle ( { x: 200, y: 300 }, { w: 100, h: 100 }, 'grey', 't8' ),
    new Puzzle ( { x: 300, y: 300 }, { w: 100, h: 100 }, 'white', 't9' )
];



function isAdjacent(puzzle1, puzzle2) {
    const dx = Math.abs(puzzle1.pos.x - puzzle2.pos.x);
    const dy = Math.abs(puzzle1.pos.y - puzzle2.pos.y);
    return (dx === puzzle1.size.w && dy === 0) || (dx === 0 && dy === puzzle1.size.h);
}


function handleMouseClick(event) {
    const mouseX = event.clientX - Canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - Canvas.getBoundingClientRect().top;

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

Canvas.addEventListener('click', handleMouseClick);