const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const FrameRate = 30;
canvas.width = 390;
canvas.height = 600;
canvas.style.backgroundColor = 'grey';
const TimeInterval = 1000 / FrameRate;

class OBJ {
    constructor(pos, size, color) {
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.MoveSpeed = 10;

        //calculating the centre of the OBJ
        this.CenX = (this.pos.x / 2);
        this.CenY = (this.pos.y / 2);

        this.Right = false;
        this.Down = false;
    }

    drawBox(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        ctx.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    flap_move() {
        if (this.Left) {
            this.dx = this.MoveSpeed;
            this.pos.x -= this.dx;
            
        }
        if (this.Right) {
            this.dx = this.MoveSpeed;
            this.pos.x += this.dx;   
           
        }
    }

    Update() {
        this.drawBox(ctx)
    }
}



const Flappy = new OBJ({ x: 155, y: 500 }, { w: 60, h: 60 }, "blue");

function PlayerData() {
    Flappy.Update();
    Flappy.flap_move();
    
   
}

document.addEventListener("keydown", function (event) {
    //console.log("Keydown event:", event.key);
    if (event.key === "ArrowLeft") {
        Flappy.Left = true;
        console.log("cenX = " + Flappy.CenX);
        console.log("cenY = " + Flappy.CenY);
    } 
    if (event.key === "ArrowRight") {
        Flappy.Right = true;
    }
    
    if (event.key === "ArrowUp") { // Check if the up arrow key is pressed
        createRedBall(); // Spawn a new red ball
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
        Flappy.Left = false;
    }
    if (event.key === "ArrowRight") {
        Flappy.Right = false;
    }
});