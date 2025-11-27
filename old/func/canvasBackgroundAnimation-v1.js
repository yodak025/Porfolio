// COLORS

const WHITE = "white";
const BLACK = "black";



class CanvasBackground {
    constructor(h, w, canvasId){
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = w;
        this.canvas.height = h;

        this.dimensions = {
            height: h,
            width: w
        }

        this.particles = new Set();

        this.ctx = this.canvas.getContext('2d');
    }

    getRandomPosition(){ 
        const qFactor = 10;
        return {
            x: Math.floor(Math.random() * this.dimensions.width/qFactor)*qFactor,
            y: Math.floor(Math.random() * this.dimensions.height/qFactor)*qFactor
        }
    }
        

    generate(time = 0){
        if (time === 0){
            console.log("Starting star generation");
        }
        if (time <= 10000){
            let position = this.getRandomPosition();

            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = WHITE;
            this.ctx.fill();
            this.ctx.closePath();

            this.particles.add(position);

            requestAnimationFrame((t) => this.generate(t));
            
        } else{
            console.log("Generation completed");
        }
    }
    
    disapear(position){
        this.ctx.beginPath();
        this.ctx.arc(position.x, position.y, 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = BLACK;
        this.ctx.fill();
        this.ctx.closePath();
        this.particles.delete(position);
    }
    
    
    
    animate(){

        if (Math.random()<0.25){
            let particlesArray = Array.from(this.particles); // Convertir Set a array
            let position = particlesArray[
                Math.floor(Math.random() * particlesArray.length)
            ];
            this.disapear(position);
            
        }
        requestAnimationFrame(() => this.animate());
    }
}