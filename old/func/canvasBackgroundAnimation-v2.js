// COLORS

const WHITE = "white";
const BLACK = "black";



class CanvasBackground {
    constructor(h, w, canvasId) {
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

    _generateParticle() {
        const qFactor = 10;
        let particle = {
            x: Math.floor(Math.random() * this.dimensions.width / qFactor) * qFactor,
            y: Math.floor(Math.random() * this.dimensions.height / qFactor) * qFactor,
            color: WHITE,
            alpha: 0.0,
            state: "growing"

        }
        this._appear(particle);

        return particle
    }

    _appear(particle) {
        if (particle.alpha < 0.95) {
            particle.alpha += 0.01;
            requestAnimationFrame(() => this._appear(particle));
        }

        else {
            particle.state = "stable";
        }

    }

    _disappear(particle) {
        if (particle.alpha > 0.1) {
            particle.alpha -= 0.01;
            requestAnimationFrame(() => this._disappear(particle));
        }
        else {
            this.particles.delete(particle);
        }


    }

    _blink(particle, counter = 0, max = 3, speed = 0.0025, phase = 0) {
        if (phase === 0) {
            if (particle.alpha > 0.05) {
                particle.alpha -= speed;
                console.log(particle.alpha);

            }
            else if (particle.alpha <= 0.05) {
                phase = 1;
            }
            requestAnimationFrame(() => this._blink(particle, counter, max, speed, phase));

        }
        else if (phase === 1) {

            if (phase === 1 && particle.alpha < 0.9) {
                particle.alpha += speed;
                requestAnimationFrame(() => this._blink(particle, counter, max, speed, phase));
            }

            else if (phase === 1 && particle.alpha >= 0.9) {
                phase = 0;
                counter++;
                if (counter < max) {
                    requestAnimationFrame(() => this._blink(particle, counter, max, speed, phase));
                }
                else {
                    particle.state = "stable";
                }
            }
        }
    }


    generate(counter = 0, max = 1000) {
        if (counter === 0) {
            console.log("Starting star generation");
        }
        if (counter <= max) {
            let particle = this._generateParticle();

            this.particles.add(particle);

            console.log(`Generated ${counter} particles, ${max - counter} remaining`);

            requestAnimationFrame(() => this.generate(counter + 1, max));

        } else {
            console.log("Generation completed");
        }
    }


    animate() {
        this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);

        for (const particle of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fill();
            this.ctx.closePath();
        }
        this.ctx.globalAlpha = 1.0;

        if (Math.random() < 0.1) {
            let particlesArray = Array.from(this.particles); // turn set into array
            let particle = particlesArray[
                Math.floor(Math.random() * particlesArray.length)
            ];

            if (particle.state === "stable") {
                particle.state = "disappearing";
                this._disappear(particle);
            }


        }
        else if (Math.random() < 0.15) {     //dry
            let particlesArray = Array.from(this.particles); // turn set into array
            let particle = particlesArray[
                Math.floor(Math.random() * particlesArray.length)
            ];

            if (particle.state === "stable") {
                particle.state = "blinking";
                this._blink(particle);
            }
        }
        requestAnimationFrame(() => this.animate());
    }
}