const tankCanvas = document.querySelector('canvas');
const ctx = tankCanvas.getContext('2d');
const FrameRate = 30;
tankCanvas.width = 1024;
tankCanvas.height = 576;
tankCanvas.style.backgroundColor = 'white';
const TimeInterval = 1000 / FrameRate;

class Tank {
    constructor(T_size, T_position, B_size, T_color)
    {
        this.T_size = { width: 100, height: 100 };
        this.baseColor = T_color;
        this.T_position = T_position;
        this.BarrelColor = "blue";
        this.centerX = this.T_position.x + (this.T_size.width / 2);
        this.centerY = this.T_position.y + (this.T_size.height / 2);
        this.rotateSpeed = 0.5; // Decreased rotation speed for smoother animation
        this.rotateLeft = false;
        this.rotateRight = false;
        this.B_size = { B_width: 25,B_height: 100 };
        this.rotateAngle = 270;
    }

    drawTank(ctx)
    {
        // Tank Base
        ctx.fillStyle = this.baseColor;
        ctx.fillRect(this.T_position.x, this.centerY, this.T_size.width, this.T_size.height);

        // Circular base for barrel
        ctx.fillStyle = this.baseColor;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.T_size.width / 2, 0, 2 * Math.PI);
        ctx.closePath();
        //ctx.fillStyle = this.BarrelColor;
        ctx.fill();

        // Save and transform state
        ctx.save();
        ctx.translate(this.centerX, this.centerY); // Move the coordinate system to the tank's center
        ctx.rotate(Math.PI * this.rotateAngle / 180); // Rotate the turret
        ctx.fillStyle = this.BarrelColor;
        ctx.fillRect(-(this.B_size.B_width / 2),0,this.B_size.B_width, this.B_size.B_height);
        ctx.restore();

        // Draw circular top part of the turret
        ctx.fillStyle = this.BarrelColor;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.B_size.B_width / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    Update(ctx)
    {
        tank.drawTank(ctx);
        tank.turretRotation();
    }

    turretRotation()
    {
        if (this.rotateRight)
        {
            this.rotateAngle += this.rotateSpeed; // Rotate to the right/
            //console.log(this.rotateAngle);
        }
        if (this.rotateLeft)
        {
            this.rotateAngle -= this.rotateSpeed; // Rotate to the left
            //console.log(this.rotateAngle);
        }
    }

    getTurretAngle()
    {
        return this.rotateAngle;
    }
    
}

const CannonBalls = [];
class CannonBall
{
    constructor( angle,x,y)
    {
        this.radius = 10;
        this.mass = this.radius;
        this.angle = angle;
        this.X = x;
        this.Y = y;
        this.dx = Math.cos(angle)*10;
        this.dy = Math.sin(angle) * 10;
        this.gravity = 0.0855;
    }

    move()
    {
        if (this.Y + this.gravity < 600) {
            this.dy += this.gravity;
        }
        this.X += this.dx;
        this.Y += this.dy;
    }

    DrawBall()
    {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    
}
function BallUpdate()
    {
    CannonBalls.forEach(ball => {
        ball.move();
        ball.DrawBall();
    });
}



window.addEventListener("keydown", (event) => {
    if (event.keyCode === 37)
    {
        tank.rotateLeft = true;
    } else if (event.keyCode === 39)
    {
        tank.rotateRight = true;
    } else if (event.keyCode === 32)
    {
        console.log("Space key pressed");
        const angle = tank.getTurretAngle();
        console.log("Turret angle:", angle);
        if (angle < 171 || angle > 271) { console.log("Invalid angle for firing"); return; }

       
        
        CannonBalls.push(new CannonBall(angle, tank.centerX, tank.centerY));
        console.log("Cannonball fired");
    }
});


window.addEventListener("keyup", (event) => {
    if (event.keyCode === 37)
    {
        tank.rotateLeft = false;
    } else if (event.keyCode === 39)
    {
        tank.rotateRight = false;
    }
});