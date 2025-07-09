const RADIUS_FACTOR = 0.1;
const G = 10;

class Astro{
  // Define las propiedades de un astro
  constructor(x, y, m){
    this.position = {x:x, y:y};
    this.speed = {x:0, y:0};
    this.mass = m;
    this.radius = this.mass * RADIUS_FACTOR;
  }

  update(speed, dt, canvas){
    // Actualiza la posición y la velocidad del astro
    this.speed.x += speed.x;
    this.speed.y += speed.y;

    this.position.x += this.speed.x * dt
    this.position.y += this.speed.y * dt

    this.position.x = (this.position.x + canvas.width) % canvas.width
    this.position.y = (this.position.y + canvas.height) % canvas.height
  }
}

function createAstros(number, width, height){
  // Dados un número, un ancho y un alto, crea un arreglo de astros
  var astros = [];
  for (let i = 0; i < number; i++){
    astros.push(new Astro(Math.random() * width, Math.random() * height, Math.random() * 10));
  }
  return astros;
}

function detectCollision(astros){
  astros.forEach((currentAstro, i) => {
    astros.forEach((otherAstro, j) => {
      if (i !== j){
        const dx = currentAstro.position.x - otherAstro.position.x;
        const dy = currentAstro.position.y - otherAstro.position.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < currentAstro.radius + otherAstro.radius){
          if (currentAstro.mass > otherAstro.mass){
            currentAstro.mass += otherAstro.mass;
            currentAstro.radius = currentAstro.mass * RADIUS_FACTOR;
            currentAstro.speed.x = (currentAstro.speed.x * currentAstro.mass + otherAstro.speed.x * otherAstro.mass) / (currentAstro.mass + otherAstro.mass);
            currentAstro.speed.y = (currentAstro.speed.y * currentAstro.mass + otherAstro.speed.y * otherAstro.mass) / (currentAstro.mass + otherAstro.mass);

            astros.splice(j, 1);

          } else {
            otherAstro.mass += currentAstro.mass;
            otherAstro.radius = otherAstro.mass * RADIUS_FACTOR;
            otherAstro.speed.x = (currentAstro.speed.x * currentAstro.mass + otherAstro.speed.x * otherAstro.mass) / otherAstro.mass;
            otherAstro.speed.y = (currentAstro.speed.y * currentAstro.mass + otherAstro.speed.y * otherAstro.mass) / otherAstro.mass;

            astros.splice(i, 1);
          }
        }
      }
    });
  });
}

function calculateForces(astros, dt, canvas) {
  // Calcula las fuerzas de atracción entre los astros
  let speedBuffer = [];
  astros.forEach((currentAstro, i) => {
    let currentSpeed = {x: 0, y: 0};
    astros.forEach((otherAstro, j) => {
      if (i !== j) {
        const dx = ((otherAstro.position.x - currentAstro.position.x) + canvas.width/2) % canvas.width - canvas.width/2;
        const dy = ((otherAstro.position.y - currentAstro.position.y) + canvas.height/2) % canvas.height - canvas.height/2;
        const distance = Math.sqrt(dx ** 2 + dy ** 2) || 1; // ! Aquí se gestiona división por cero, pero tambien se puede gestionar distancias menores a 1 (que igual son las que generan aceleraciones muy grandes)
        const force = (G * currentAstro.mass * otherAstro.mass) / (distance ** 2);
        const ax = force * dx / distance;
        const ay = force * dy / distance;
        currentSpeed.x += ax / currentAstro.mass;
        currentSpeed.y += ay / currentAstro.mass;
      }
    });
    speedBuffer.push(currentSpeed);
  });

  // aplica a cada astro la fuerza acumulada (importante para no tener en cuenta los cambios de posición de los astros que ya se han calculado)
  astros.forEach((astro, i) => {
    astro.update(speedBuffer[i], dt, canvas);
  });
}

function draw(ctx, astros){
  // Dibuja los astros en el canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  astros.forEach(astro => {
    ctx.beginPath();
    ctx.arc(astro.position.x, astro.position.y, astro.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill(); 
    ctx.closePath();
  });
}


function main(canvas){
  var ctx = canvas.getContext("2d");
  var astros = createAstros(100, canvas.width, canvas.height);
  draw(ctx, astros);
  
  let lastTime = 0;
  setTimeout(() => {
    console.log("Pasaron 2 segundos");
  }, 2000);
  let animate = (timestamp) => {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    detectCollision(astros);
    calculateForces(astros, dt, canvas);
    draw(ctx, astros);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

}