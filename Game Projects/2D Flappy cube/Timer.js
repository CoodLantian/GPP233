class Timer {
    constructor() {
        this.sec = 0;
        this.min = 0;
        this.hour = 0;
        this.fcounter = 0;
        this.isRunning = false;
    }

    drawTimer(ctx) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(
            this.formatTime(this.hour) + ":" + this.formatTime(this.min) + ":" + this.formatTime(this.sec),
            10,
            20
        );
    }

    formatTime(unit) {
        return unit < 10 ? "0" + unit : unit;
    }

    updateTimerDisplay() {
        document.getElementById('timerDisplay').innerHTML =
            this.formatTime(this.hour) +
            ":" +
            this.formatTime(this.min) +
            ":" +
            this.formatTime(this.sec);
    }

    timer() {
        if (this.isRunning) {
            this.fcounter++;

            if (this.fcounter === 30) {
                this.fcounter = 0;
                this.sec++;

                if (this.sec === 60) {
                    this.sec = 0;
                    this.min++;

                    if (this.min === 60) {
                        this.min = 0;
                        this.hour++;
                    }
                }
            }

            this.updateTimerDisplay();
        }
    }

    updateTimer() {
        this.updateTimerDisplay();
        this.drawTimer(ctx)
        this.timer();
    }
}