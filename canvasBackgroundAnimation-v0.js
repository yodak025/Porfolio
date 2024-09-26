class CanvasBackground {
    constructor(h, w, canvasId){
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = w;
        this.canvas.height = h;

        this.dimensions = {
            height: h,
            width: w
        }

        this.ctx = this.canvas.getContext('2d');
    }

    getRandomPosition(){ 
        const qFactor = 10;
        return {
            x: Math.floor(Math.random() * this.dimensions.width/qFactor)*qFactor,
            y: Math.floor(Math.random() * this.dimensions.height/qFactor)*qFactor
        }
    }
        

    draw(){
        let position = this.getRandomPosition();

        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.closePath();

        setTimeout(() => {
            this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.closePath();
        
        }, 15000);
        window.requestAnimationFrame(() => this.draw());
    }
}