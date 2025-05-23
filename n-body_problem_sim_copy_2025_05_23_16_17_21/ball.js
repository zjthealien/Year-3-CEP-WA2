
class Ball{
  constructor(x, y, mass, name){
    this.position = createVector(x, y);
    this.prevPosition = createVector(x, y); 
    this.acceleration = createVector(0, 0);
    this.mass = mass;
    this.radius = sqrt(mass);
    this.color = color(random(100,255), random(100,255),random(100,255));
    this.trail = [];
    this.name = name;
  }
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    if (this.trail.length>trailLength){
      strokeWeight(0.5);
      this.trail.shift();
    }
    let velocity = p5.Vector.sub(this.position, this.prevPosition);
    let tempPosition = this.position.copy();
    this.position.add(p5.Vector.add(velocity, p5.Vector.mult(this.acceleration, timeScale**2)));
    this.prevPosition = tempPosition;
    this.acceleration.mult(0);
    this.trail.push(this.position.copy());
  }
  
  checkEdges(){
  }
  
  display() {
    this.radius = constrain(sqrt(this.mass/PI), 0, 100000);
    fill(this.color);
    stroke(0);
    strokeWeight(0.1);
    if (zoom*this.radius<1){
          ellipse(this.position.x, this.position.y, 1/zoom);

    } else{
          ellipse(this.position.x, this.position.y, this.radius * 2);

    }
    for (let i = 0; i < this.trail.length-1; i++){
      stroke(this.color)
      strokeWeight(0.5/zoom);
      line(this.trail[i].x, this.trail[i].y, this.trail[i+1].x, this.trail[i+1].y);
    }
  }
   attract(body) {
    let force = p5.Vector.sub(this.position, body.position);
    let d = force.mag();
     
    let strength = (GRAVITATIONAL_CONSTANT* (this.mass * body.mass)) / (d * d);
    force.setMag(strength);
    body.applyForce(force);
  }
collide(body) {
  // Compute velocity of this and body
  let vx1 = (this.position.x - this.prevPosition.x) / timeScale;
  let vy1 = (this.position.y - this.prevPosition.y) / timeScale;
  let vx2 = (body.position.x - body.prevPosition.x) / timeScale;
  let vy2 = (body.position.y - body.prevPosition.y) / timeScale;
  // Combined momentum (mass-weighted average velocity)
  let totalMass = this.mass + body.mass;
  let xVel = (this.mass * vx1 + body.mass * vx2) / totalMass;
  let yVel = (this.mass * vy1 + body.mass * vy2) / totalMass;

  // Update previous position to reflect new post-collision velocity
  this.prevPosition.x = this.position.x - xVel * timeScale;
  this.prevPosition.y = this.position.y - yVel * timeScale;
  //print(balls.length);
}
  menu(){
    push();
    stroke(255);
    strokeWeight(5);
    fill('black');
    rect(width/8*7, height/8, width/8, height/8*7);
    pop();
  }
}