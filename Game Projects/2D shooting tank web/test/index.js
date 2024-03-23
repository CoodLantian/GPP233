const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const FrameRate = 30;
canvas.width = 1024;
canvas.height = 576;
const TimeInterval = 1000 / FrameRate;
class Tank {
    constructor(position, width, height, color)
    {
        this.position = position;
        this.color = color;
        this.width = width;
        this.height = height;
        this.rotationAngle = 0;
        this.moveSpeed = 5;

        this.rotateright = false;
        this.rotateleft = false;
    }

    Draw()
    {
        ctx.save();
        ctx.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
        ctx.rotate(this.rotationAngle);
        ctx.fillStyle = this.color; // You may want to set a color

        ctx.beginPath();
        ctx.arc(-this.width / 4, 0, this.width / 2, 0, Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(-this.width / 4, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    Update()
    {
        this.Draw();
        this.turret_rotation();
    }

    turret_rotation()
    {
        if (this.rotateright)
        {
            this.rotationAngle += (Math.PI / 180) * 2; // Rotate by 2 degrees to the right
        }
        if (this.rotateleft)
        {
            this.rotationAngle -= (Math.PI / 180) * 2; // Rotate by 2 degrees to the left
        }
    }
}

window.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) {
        turret.rotateleft = true;
    } else if (event.keyCode === 39) {
        turret.rotateright = true;
    }
});

window.addEventListener("keyup", (event) => {
    if (event.keyCode === 37) {
        turret.rotateleft = false;
    } else if (event.keyCode === 39) {
        turret.rotateright = false;
    }
});