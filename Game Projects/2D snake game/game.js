const Canvas = document.getElementById('gameCanvas');
const ctx = Canvas.getContext('2d');
const FrameRate = 30;
Canvas.width = 800;
Canvas.height = 600;
Canvas.style.backgroundColor = 'grey';
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

class snake(){
    constructor(SnakePos, SnakeSize, SnakeLen, activeLen){
         this.SnakeArray = new Array((SnakeLen) * SnakeSize);
         this.TempXPosArray = new Array((SnakeLen) * SnakeSize);
         this.TempYPosArray = new Array((SnakeLen) * SnakeSize);

         this.TempXPosValue = 0;
         this.TempYPosValue = 0;
         this.sum = 0;

         this.SnakePos = SnakePos;

         this.SnakeSize = SnakeSize;
         this.snakeLen = SnakeLen;
         this.activeLen = activeLen;
         this.MoveSpeed = 30;

         this.leftArrow = 0;
         this.rightArrow = 0;
         this.upArrow = 0;
         this.downArrow = 0;
         
         this.SizeUp = 0;
         this.SizeDown = 0;
         this.Start = 0;
         this.Stop = 0;
         this.Stop1 = 0;
    }

    CreateSNake(){
        for (var i = 0; i < SnakeLen; i++){
            this.SnakeArray[i] = new Box (this.SnakePos.x, this.SnakePos.y, this.SnakeSize.w, this.SnakeSize.h);
            this.SnakePos.x -= this.SnakeSize;
        }
        this.TempXPosArray
    }

}