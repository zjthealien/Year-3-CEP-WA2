
class Ball{
  constructor(x, y, mass, name){
    this.position = createVector(x, y);
    this.prevPosition = createVector(x, y); 
    this.acceleration = createVector(0, 0);
    this.saveAcceleration = this.acceleration.copy()
    this.mass = mass;
    this.radius = sqrt(mass);
    this.color = color(round(random(50,200), 0), round(random(50,200), 0),round(random(50,200), 0));
    this.trail = [];
    this.name = name;
  }
  applyForce(force) {
    //changes acceleration vector of ball based on f = ma
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    //removes first position stored in trail array if trail array exceeds or equals trail length
    if (this.trail.length>=trailLength){
      strokeWeight(0.5);
      this.trail.shift();
    }
    let velocity = p5.Vector.sub(this.position, this.prevPosition);
    let tempPosition = this.position.copy();
    //uses verlet integration to calculate next position without relying on velocity 
    this.position.add(p5.Vector.add(velocity, p5.Vector.mult(this.acceleration, timeScale**2)));
    this.prevPosition = tempPosition;
    this.saveAcceleration = this.acceleration.copy();
    this.acceleration.mult(0);
    //saves current position to trail array
    this.trail.push(this.position.copy());
  }
  
  ballDisplay() {
    push();
    //makes sure radius of ball doesn't go below 0
    this.radius = constrain(sqrt(this.mass/PI), 0, Infinity);
    //white outline around the selected ball
    if (this == selectedBall&&menus.ballMenu.open){
      //the size of the outline remains the same regardless of zoom
      let whiteOutlineSize = 4/zoom
      fill(200)
      noStroke()
      //draws outline using ellipse 
      ellipse(this.position.x, this.position.y, this.radius * 2 + whiteOutlineSize)
    }
    fill(this.color);
    noStroke();
    //makes sure ball always has at least a radius of 1 regardless of screen size
    //(ensures ball is always visible so it is easier to find when zooming out)
    if (zoom*this.radius<1){
      ellipse(this.position.x, this.position.y, 1*2/zoom);

    }else{
      ellipse(this.position.x, this.position.y, this.radius * 2);
    }
    pop();
  }
  trailDisplay(){
    //displays the trail
    for (let i = 0; i < this.trail.length-1; i++){
      stroke(this.color)
      //makes sure trail is always 0.5 pixels in size regardless of zoom
      strokeWeight(0.5/zoom);
      line(this.trail[i].x, this.trail[i].y, this.trail[i+1].x, this.trail[i+1].y);
    }
  }
   attract(body) {
    //finds direction of force exerted by gravity 
    let force = p5.Vector.sub(this.position, body.position);
    //finds distance between ball and body using the force above
    let d = force.mag();
    //calculates force of gravity exerted by other body on ball
    let strength = (GRAVITATIONAL_CONSTANT* (this.mass * body.mass)) / (d * d);
    //adjusts force applied based on calculation
    force.setMag(strength);
    //uses applyForce to apply the force on the body 
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
  }
}