class Score {
    constructor() {
        this.value = 1;
    }

    increaseScore() {
        this.value++;
    }
    decreaseScore() {
        this.value--;
    }

    resetScore() {
        this.value = 1;
    }

    getScore() {
        return this.value;
    }

    drawScore(ctx) {
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + this.value, canvas.width - 100, 20);
    }
}