//declare variable dump
const BALLNUMBER = 10;
const BALLMASS = 100;
const INITIALVELOCITY = 100000;
const GRAVITATIONAL_CONSTANT = 0.1;
let SPIRAL_RADIUS_INCREMENT = 5; // Controls the spread of the spiral
let SUNMASS = 1000000;

let timeMultiplier = 1;
let timeScale = 1; // - useless and I can't be bothered to fix
let trailLength = 300; /* timeScale;*/
//balls array
let balls = [];
let cameraOffset;
let cameraFollow = "FREEMOVEMENT"; // two modes - 'FREEMOVEMENT', allows the player to move camera using wasd and 'CENTER OF GRAVITY', centers the screen on the center of gravity
let centerOfGravity;
let zoom = 0.7; //sets the scale of the coordinate system on the screen to create zoom in zoom out effect

//menus object
let menus = {};

//for the ball menu at the side
let selectedBall;

function setup() {
  let seed = 1;
  //make the randomness based on the seed number
  randomSeed(seed);
  print("Seed: " + seed);
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.oncontextmenu = () => false;
  //
  setupBallMenu();
  
  sun = new Ball(0, 0, SUNMASS, "Sol-" + seed);
  sun.color = color(255, 204, 0); // Yellow color for the sun
  balls.push(sun);
  // Create balls in a spiral pattern
  for (let i = 0; i < BALLNUMBER; i++) {
    let angle = i;
    let radius = i * random(1, 5) * SPIRAL_RADIUS_INCREMENT + sun.radius; // Radius increases as we go along the spiral
    // Introduce small variation to the angle to add randomness
    let angleVariation = random(-1, 1);
    let adjustedAngle = angle + angleVariation;
    // Calculate the ball's position using polar coordinates
    let x = radius * cos(adjustedAngle);
    let y = radius * sin(adjustedAngle);
    let newBall = new Ball(x, y, BALLMASS, randomName());
    // Calculate the velocity for a circular orbit around the sun
    let velocityAngle = adjustedAngle + HALF_PI; // Perpendicular to the radius for circular motion
    let distanceToSun = dist(x, y, sun.position.x, sun.position.y);
    let velocityMagnitude = sqrt(
      (GRAVITATIONAL_CONSTANT * (SUNMASS + (BALLNUMBER * BALLMASS) / 2)) /
        distanceToSun
    ); // Circular orbit velocity formula
    // Add a slight variation to the velocity magnitude to take into account other masses
    let velocity = p5.Vector.fromAngle(velocityAngle).mult(velocityMagnitude);
    // Set prevPosition based on intended initial velocity
    newBall.prevPosition = p5.Vector.sub(newBall.position, velocity);
    balls.push(newBall);
  }
  centerOfGravity = createVector(0, 0);
  findCenterOfGravity();
  cameraOffset = createVector(-centerOfGravity.x, -centerOfGravity.y);
  zoom = 0.16;
}

function draw() {
  background(0);
  //print(zoom);
  if (mouseIsPressed && mouseY < (height / 8) * 7 && mouseButton == RIGHT) {
    spawnBallOnLocation(mouseToWorld());
  }
  for (let times = 0; times < timeMultiplier; times++) {
    physicsUpdate();
  }
  setCameraSettings();
  findCenterOfGravity();
  translate(width / 2, height / 2);
  scale(zoom);
  translate(cameraOffset.x, cameraOffset.y);
  for (let ball of balls) {
    ball.display();
  }
  displayCenterOfMassMarker();
  resetMatrix();
  displayUserInterface();
}

function keyPressed() {
  if (keyCode == 67) {
    if (cameraFollow === "CENTEROFGRAVITY") {
      cameraFollow = "FREEMOVEMENT";
    } else if (cameraFollow === "FREEMOVEMENT") {
      cameraFollow = "CENTEROFGRAVITY";
    }
  }

  if (
    key == "0" ||
    key == "1" ||
    key == "2" ||
    key == "3" ||
    key == "4" ||
    key == "5" ||
    key == "6" ||
    key == "7" ||
    key == "8" ||
    key == "9"
  ) {
   // timeMultiplier = (Number(key) * 3) ** 2;
  }
  if (keyCode == 32) {
    timeMultiplier = 0;
  }
}

function mouseWheel(event) {
  let baseFactor = keyIsDown(16) ? 0.001 : 0.0001;
  // Get mouse position in world space BEFORE zoom change
  let mouseWorld = mouseToWorld();
  // Apply exponential flattening zoom
  zoom *= Math.exp(-event.delta * baseFactor);
  // Get mouse position in world space AFTER zoom change
  let newMouseWorld = mouseToWorld();
  // Offset camera so zoom centers on mouse
  cameraOffset.add(newMouseWorld.sub(mouseWorld));
}

//menu functions
function setupBallMenu(){
  ballMenuExit = createButton('x');
  ballMenuExit.size(width/45, width/45)
  ballMenuExit.position(width-width/45, 0)
  ballMenuExit.style('background-color', 'red');
  ballMenuExit.style('color', 'black');
  menus.ballMenu = new Menu((width / 4) * 3, -10, width / 4 + 10, (height / 8) * 7 + 10, [ballMenuExit])
  menus.ballMenu.assignClose(ballMenuExit);
  menus.ballMenu.assignDisplay(displayBallMenu);
  velocityInput = createInput()
  push()
  textSize(width/40);
  velocityInput.position(menus.ballMenu.x+10+textWidth('Edit Velocity: '), height/12+height/40*4);
  velocityInput.size(width/4-20-textWidth('Edit Velocity: '), height/40)
  pop();
  velocityInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    let speed = float(velocityInput.value()); // Get input as a float

    // Compute direction vector
    let velocity = p5.Vector.sub(selectedBall.position, selectedBall.prevPosition);

    // Set magnitude to user input
    velocity.setMag(speed);

    // Update previous position based on new velocity
    selectedBall.prevPosition = p5.Vector.sub(selectedBall.position, velocity);
  }
});
  menus.ballMenu.buttons.push(velocityInput);
}

//makes random names for bodies
function randomName(length = random(4, 8)) {
  let name = "";
  let vowels = ["a", "e", "i", "o", "u", "y"];
  let consonants = [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "z",
  ];
  let isVowel;
  let r = random(0, 1);
  if (r == 0) {
    name += consonants[floor(random(0, consonants.length), 0)];
    isVowel = false;
  } else {
    name += vowels[floor(random(0, vowels.length), 0)];
    isVowel = true;
  }
  name = name.toUpperCase();
  for (let i = 0; i < length - 1; i++) {
    if (isVowel == true) {
      name += consonants[floor(random(0, consonants.length), 0)];
      isVowel = false;
    } else {
      name += vowels[floor(random(0, vowels.length), 0)];
      isVowel = true;
    }
  }
  return name;
}

function spawnBallOnLocation(position) {
  let newBall = new Ball(position.x, position.y, BALLMASS, randomName());
  let velocity = createVector(0, INITIALVELOCITY);
  velocity.setHeading(random(0, PI * 2));
  newBall.previousPosition = p5.Vector.mult(velocity, -1);
  balls.push(newBall);
}

function physicsUpdate() {
  for (let j = 0; j < balls.length; j++) {
    let ball = balls[j];
    for (let i = 0; i < balls.length; i++) {
      let other = balls[i];
      if (ball != other) {
        ball.attract(other);
        if (
          p5.Vector.dist(ball.position, other.position) <
          ball.radius + other.radius
        ) {
          if (other.mass > ball.mass) {
            other.collide(ball);
            other.mass += ball.mass;
            balls.splice(j, 1);
            if (selectedBall == ball) {
              selectedBall = undefined;
            }
            j--;
            break;
          } else {
            ball.collide(other);
            ball.mass += other.mass;
            balls.splice(i, 1);
            if (selectedBall == other) {
              selectedBall = undefined;
            }
            i--;
          }
        }
      }
    }
    ball.update();
  }
  findCenterOfGravity();
}

function setCameraSettings() {
  if (cameraFollow === "FREEMOVEMENT") {
    if (keyIsPressed && keyIsDown(87)) {
      if (keyIsDown(16)) {
        cameraOffset.y += 50 / zoom;
      }
      cameraOffset.y += 10 / zoom;
    }
    if (keyIsPressed && keyIsDown(83)) {
      if (keyIsDown(16)) {
        cameraOffset.y -= 50 / zoom;
      }
      cameraOffset.y -= 10 / zoom;
    }
    if (keyIsPressed && keyIsDown(65)) {
      if (keyIsDown(16)) {
        cameraOffset.x += 50 / zoom;
      }
      cameraOffset.x += 10 / zoom;
    }
    if (keyIsPressed && keyIsDown(68)) {
      if (keyIsDown(16)) {
        cameraOffset.x -= 50 / zoom;
      }
      cameraOffset.x -= 10 / zoom;
    }
  }
  if (cameraFollow == "CENTEROFGRAVITY") {
    cameraOffset.x = -centerOfGravity.x;
    cameraOffset.y = -centerOfGravity.y;
  }
}

function displayCenterOfMassMarker() {
  push();
  stroke(0);
  strokeWeight(1 / zoom);
  fill(255, 0, 0, 150);
  square(centerOfGravity.x - 3 / zoom, centerOfGravity.y - 3 / zoom, 6 / zoom);
  pop();
}

function displayUserInterface() {
  // UI AREA
  push();
  fill(30);
  stroke(255);
  strokeWeight(1);
  rect(-10, (height / 8) * 7, width + 20, height / 8 + 10);
  if (mouseIsPressed) {
    let ball = ballToMouse(10)
    selectedBall = ball ? ball : selectedBall;
    if (ball){
      menus.ballMenu.attemptOpen();
    }
  }
  if (selectedBall){
    
  } else{
    menus.ballMenu.attemptClose();
  }
  if (menus.ballMenu.open){
    menus.ballMenu.display(selectedBall);
  }
  pop();
}

function displayBallMenu(ball) {
  push();
  rect((width / 4) * 3, -10, width / 4 + 10, (height / 8) * 7 + 10);
  textAlign(LEFT, TOP);
  fill(200);
  strokeWeight(0);
  textSize(1);
  let textLength = textWidth(ball.name);
  //the code still works here
  let size =
    ((width / 4 - 20) / textLength > width / 20)
      ? width / 20
      : (width / 4 - 20) / textLength;
  textSize(size);
  text(ball.name, (width / 4) * 3 + 10, 10);
  textSize(width / 40);
  text(
    "x: " + floor(ball.position.x),
    (width / 4) * 3 + 10,
    height / 12 + height / 40
  );
  text(
    "x: " + floor(ball.position.y),
    (width / 4) * 3 + 10,
    height / 12 + (height / 40) * 2
  );
  text(
    "Velocity: " +
      round(ball.position.copy().sub(ball.prevPosition.copy()).mag(), 3),
    (width / 4) * 3 + 10,
    height / 12 + (height / 40) * 3
  );
  text(
    "Edit Velocity: ",
    width/4*3+10,
    height/12+height/40*4
    );
  text("Mass: " + ball.mass, (width / 4) * 3 + 10, height / 12);

  pop();
}

function screenToWorld(vector) {
  return vector
    .sub(width / 2, height / 2)
    .div(zoom)
    .sub(cameraOffset);
}
function mouseToWorld() {
  return screenToWorld(createVector(mouseX, mouseY));
}

function ballToMouse(buffer) {
  mouse = createVector(mouseX, mouseY);
  for (let ball of balls) {
    let screenPosition = ball.position
      .copy()
      .add(cameraOffset)
      .mult(zoom)
      .add(width / 2, height / 2);
    let screenRadius = ball.radius * zoom;
    let interactionDistance = screenRadius < buffer ? buffer : screenRadius;
    if (p5.Vector.dist(mouse, screenPosition) < interactionDistance) {
      return ball;
    }
  }
}

function findCenterOfGravity() {
  let totalXOfBalls = 0;
  let totalYOfBalls = 0;
  let totalBALLMASS = 0;
  for (let ball of balls) {
    totalXOfBalls += ball.position.x * ball.mass;
    totalYOfBalls += ball.position.y * ball.mass;
    totalBALLMASS += ball.mass;
  }
  centerOfGravity.x = totalXOfBalls / totalBALLMASS;
  centerOfGravity.y = totalYOfBalls / totalBALLMASS;
}
