/*
Constants:
  Universal Gravitational Constant: 6.67430 * 10^-11 m^3 kg^-1 s^-2
  Standard Maximum Mass: Sun's mass (1.989 * 10^30 kg)
  Standard Initial Mass: Pluton's mass (1.309 * 10^22 kg)
  Standard Explosion Mass: 1.0 * 10^22 kg
  Standard Explosion Particles Maximum: 20
  Standard Initial Particles Number: 50
  Standard Delta Time Normalization: 0.000001
  Standard Distance NOrmalization: 0.000001
  Standard Density: 4.0

  Colors:
    Black: #000000
    White: #FFFFFF
    Black: #000000
    White: #ffffff
    Blue 0: #0b132b
    Blue 1: #1c2541
    Blue 2: #3a506b
    Green: #439a86
    Orange: #ee6352

*/ 
const G = 6.67430 * Math.pow(10, -11);
const GALACTIC_SCALE_FACTOR = 50 * 1.989e30;
const EXPLOSION_PARTICLES_MAX = 20;
const INITIAL_PARTICLES = 100;

const DELTA_TIME_NORMALIZATION = 10000000000;
const DISTANCE_NORMALIZATION = 10e2;

const DENSITY = 10.0;
const FRICTION_COEFFICIENT = 0.0005;


const BLACK = "#000000";
const WHITE = "#FFFFFF";
const BLUE0 = "#0b132b";
const BLUE1 = "#1c2541";
const BLUE2 = "#3a506b";
const GREEN = "#439a86";
const ORANGE = "#ee6352";


// Function to generate mass using a power-law distribution
function generateMass(min, max, alpha) {
  let r = Math.random();
  return Math.pow((Math.pow(max, alpha + 1) - Math.pow(min, alpha + 1)) * r + Math.pow(min, alpha + 1), 1 / (alpha + 1));
}

// Function to create a random mass distribution of celestial objects
function generateCelestialObjects() {

  // Proportions for each category
  const proportions = {
    asteroids: 0.35,   // 40% asteroids
    satellites: 0.5,  // 10% satellites
    planets: 0.75,     // 30% planets
    stars: 0.95,      // 15% stars
    blackHoles: 1  // 5% black holes
  };

  const massRanges = {
  asteroids: { min: 1e10, max: 1e21, alpha: -2.5 },  // Mass in grams
  satellites: { min: 1e16, max: 1e25, alpha: -1.5 }, // Mass in grams
  planets: { min: 5.97e24, max: 1.898e27, alpha: -1.2 },  // Earth to Jupiter mass
  stars: { min: 0.1 * 1.989e30, max: 50 * 1.989e30, alpha: -2.35 },  // 0.1 to 50 solar masses
  blackHoles: { min: 3 * 1.989e30, max: 10e9 * 1.989e30, alpha: -2.0 }  // Stellar to supermassive
  };

  let astroRandom = Math.random();
  if (astroRandom < proportions.asteroids) {
    return generateMass(massRanges['asteroids'].min, massRanges['asteroids'].max, massRanges['asteroids'].alpha);
  } else if (astroRandom < proportions.satellites) {
    return generateMass(massRanges['satellites'].min, massRanges['satellites'].max, massRanges['satellites'].alpha);
  } else if (astroRandom < proportions.planets) {
    return generateMass(massRanges['planets'].min, massRanges['planets'].max, massRanges['asteroids'].alpha);
  } else if (astroRandom < proportions.stars) {
    return generateMass(massRanges['stars'].min, massRanges['stars'].max, massRanges['stars'].alpha);
  } else {
    return generateMass(massRanges['blackHoles'].min, massRanges['blackHoles'].max, massRanges['blackHoles'].alpha);
  }
  
}



/*
Class Particle:

*/ 


class Particle {
  constructor(canvas, x=null, y=null, i=null, j=null, mass=null) {
    this.canvas = canvas;
    this.position = {
      x: x!=null ? x : Math.random() * canvas.width,
      y: y!=null ? y : Math.random() * canvas.height,
    };
    this.speed = {
      i: i!=null ? i : 0,
      j: j!=null ? j : 0
    }
    this.mass = mass!=null ? mass : generateCelestialObjects();
  }

  getSpeedModule() {
    return Math.sqrt(Math.pow(this.speed.i, 2) + Math.pow(this.speed.j, 2));
  }

  _getSquareDistance(particle) {
    return (Math.pow(this.position.x - particle.position.x, 2) + Math.pow(this.position.y - particle.position.y, 2))*DISTANCE_NORMALIZATION;
  }

  // Helpfully, JavaScript's Math.atan2() function returns the angle in radians in the correct quadrant
  _getAlpha(particle) {
    return Math.atan2(particle.position.y - this.position.y, particle.position.x - this.position.x);  
  }

  _getForce(particle) {
    return G * this.mass * particle.mass / this._getSquareDistance(particle);
  }
  //
  
  _setSpeed(deltaTime) {
    
    this.speed.i += this.force.i / this.mass * deltaTime;
    this.speed.j += this.force.j / this.mass * deltaTime;

    // Apply friction
    this.speed.i -= this.speed.i * FRICTION_COEFFICIENT;
    this.speed.j -= this.speed.j * FRICTION_COEFFICIENT;
  }
  
  setPosition(particles, deltaTime) {
    this.force = {i: 0, j: 0};
    particles.forEach(particle => {
      if (particle != this) {
        let alpha = this._getAlpha(particle);
        let forceModule = this._getForce(particle);
        this.force.i += forceModule * Math.cos(alpha);
        this.force.j += forceModule * Math.sin(alpha);
      }
    });
    this._setSpeed(deltaTime);

    this.position.x += this.speed.i * deltaTime;
    this.position.y += this.speed.j * deltaTime;

    // Check for boundary crossing and wrap around
    this.position.x = this.position.x < 0 ? this.position.x % this.canvas.width : this.position.x;
    this.position.y = this.position.y < 0 ? this.position.y % this.canvas.height : this.position.y;
    this.position.x = this.position.x > this.canvas.width ? this.position.x % this.canvas.width : this.position.x;
    this.position.y = this.position.y > this.canvas.height ? this.position.y % this.canvas.height : this.position.y;

  };

}

/*
Classes Node and ParticleQueue:

*/

class Node {
  constructor(particle) {
    this.particle = particle;
    this.next = null;
  }
}

class ParticleQueue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.maxElements = 10;  // Arbitrary number
  }

  push(particle) {
    let node = new Node(particle);
    if (this.head == null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    while (this._getNumberOfElements() > this.maxElements) {
      this.pop();
    }
  }

  pop() {
    let particle = this.head.particle;
    this.head = this.head.next;
    return particle;
  }

  _isEmpty() {
    return this.head == null;
  }

  _getNumberOfElements() {
    let node = this.head;
    let count = 0;
    while (node != null) {
      count++;
      node = node.next;
    }
    return count;
  }

  // Create methods for obtaining an ordered array of every property of the particles in the queue
  
  getPositions() {
    let node = this.head;
    let positions = [];
    while (node != null) {
      positions.push(node.particle.position);
      node = node.next;
    }
    return positions;
  }

  getParticle(){
    return this.tail;
  }

}

class ParticleDataBase {

  constructor() {
    this.particles = [];
    this.length = 0;
    this.queues = [];
  
  }

  addParticle(particle) {
    let queue = new ParticleQueue();
    queue.push(particle);

    this.particles.push(particle);
  }

  updateQueues(){
    for(let i = 0; i < this.queues.length; i++){
      this.queues[i].push(this.particles[i]);
    }
  }
  updateParticles(particles) {
    this.particles = particles;
  }

  update(particles) {
    this.updateParticles(particles);
    this.updateQueues();
  }

  // Remove particle from the database and queues
  removeParticle(particle) {
    this.particles = this.particles.filter(p => p != particle);
    this.queues = this.queues.filter(q => q.getParticle() != particle);
  }

  getParticles() {
    return this.particles;
  }
}


/*
Class CanvasBackgroundSystemController:

*/

class CanvasBackgroundSystemController {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.database = new ParticleDataBase();
    this.lastTime = 0;

  }
  generate(c=0){
    let count = c + 1;
    let newParticle = new Particle(this.canvas);
    this.database.addParticle(newParticle);
    if(count < INITIAL_PARTICLES){
      this.generate(count);
    }

  }

  animate(currentTime=0) {
    let deltaTime = currentTime/DELTA_TIME_NORMALIZATION - this.lastTime;
    this.lastTime = currentTime/DELTA_TIME_NORMALIZATION;

    console.log("Animating... Delta Time:", deltaTime);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let particles = this.database.getParticles();
    particles.forEach(particle => {
      particle.setPosition(particles, deltaTime);
      console.log("Particle Position:", particle.position); 
      this.ctx.beginPath();
      this.ctx.arc(
        particle.position.x, 
        particle.position.y, 
        Math.log(particle.mass)/DENSITY, 
        0, 
        Math.PI * 2
      );
      this.ctx.fillStyle = WHITE;
      if (particle.mass >5.97e25) {
        this.ctx.fillStyle = GREEN;
      }
      if (particle.mass > 3 * 1.989e30){
        this.ctx.fillStyle = BLUE0;
      }
      if (particle.getSpeedModule() > 10e8) {
        this.ctx.fillStyle = ORANGE;
      }

      this.ctx.fill();
      this.ctx.closePath()
    });
    
    requestAnimationFrame((currentTime) => this.animate(currentTime));
  }

}