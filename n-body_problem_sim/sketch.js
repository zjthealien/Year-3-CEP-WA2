//declare variable dump
const BALLNUMBER = 100;
let BALLMASS = 200;
const INITIALVELOCITY = 100000;
const GRAVITATIONAL_CONSTANT = 0.1;
let SPIRAL_RADIUS_INCREMENT = 1; // Controls the spread of the spiral
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
let paused = false;
//menus object
let menus = {};
let seed;
//for the ball menu at the side
let selectedBall;
let selectedMenu;
let verticalTranslate;

function setupFunction(){
  randomSeed(seed);
  balls = []
  let sun = new Ball(0, 0, SUNMASS, "Sol-" + seed);
  sun.color = color(255, 204, 0); // Yellow color for the sun
  balls.push(sun);
  // Create balls in a spiral pattern
  let maxX = -Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let minY = Infinity;
  for (let i = 0; i < BALLNUMBER; i++) {
    let angle = i;
    let radius = i * random(1, 5) * SPIRAL_RADIUS_INCREMENT + 1500; // Radius increases as we go along the spiral
    // Introduce small variation to the angle to add randomness
    let angleVariation = random(-1, 1);
    let adjustedAngle = angle + angleVariation;
    // Calculate the ball's position using polar coordinates
    let x = radius * cos(adjustedAngle);
    let y = radius * sin(adjustedAngle);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    let newBall = new Ball(x, y, BALLMASS, randomName());
    let velocityAngle = adjustedAngle + HALF_PI; 
    let velocityMagnitude = sqrt(
    (GRAVITATIONAL_CONSTANT *((SUNMASS) + (BALLNUMBER * BALLMASS / 2))/radius)*timeScale*random(0.6,1.4)); 
    let velocity = p5.Vector.fromAngle(velocityAngle).mult(velocityMagnitude);
    newBall.prevPosition = p5.Vector.sub(newBall.position, velocity);
    balls.push(newBall);
  }
  centerOfGravity = createVector(0, 0);
  findCenterOfGravity();
  let dataWidth = maxX - minX;
  let dataHeight = maxY - minY;
  let padding = 10;
  let availableWidth = width - 2 * padding;
  let availableHeight = height/8*7 - 2 * padding;
  let centerX = (minX + maxX) / 2;
  let centerY = (minY + maxY) / 2;
  zoom = Math.min(availableWidth / dataWidth, availableHeight / dataHeight);
  cameraOffset = createVector(-centerX, -centerY);
  verticalTranslate = height/8*7/2;
  cameraFollow = "FREEMOVEMENT"
  timeMultiplier = 1
}

function setup() {  
  seed = round(random(1,9999999999));
  //make the randomness based on the seed number

  print("Seed: " + seed);
  let canvas = createCanvas(windowWidth, windowHeight);
  //prevents context menu from appearing when right clicking (doesnt interfere with creating balls)
  canvas.elt.oncontextmenu = () => false;
  //
  setupBallMenu();
  menus.gameMenu = new Menu (0, 0, width, height, [], 1);
  menus.gameMenu.open = true;
  setupBarMenu();
  setupFunction();
}

function draw() {
  if (balls.includes(selectedBall)){

  }else{
    selectedBall = undefined;
    menus.ballMenu.attemptClose()
  }
  //console.log(selectedBall)
  background(0);
  //print(zoom);
  if (mouseIsPressed && mouseY < (height / 8) * 7 && mouseButton == RIGHT&&selectedMenu == menus.gameMenu) {
    spawnBallOnLocation(mouseToWorld());
  }
  if (!paused){
    for (let times = 0; times < timeMultiplier; times++) {
      physicsUpdate();
    }
  }
  setCameraSettings();
  findCenterOfGravity();
  translate(width / 2, verticalTranslate);
  scale(zoom);
  translate(cameraOffset.x, cameraOffset.y);
  for (let ball of balls){
    ball.trailDisplay();
  }
  for (let ball of balls) {
    ball.ballDisplay();
    
  }
  displayVectors(balls);
  displayCenterOfMassMarker();
  resetMatrix();
  findSelectedMenu()
  displayUserInterface();
  //console.log(menus.ballMenu.open);
  //console.log(selectedMenu)
}

function mousePressed(){
  for (let button of selectedMenu.buttons){
    if (button instanceof Button){
      if (button.clicked){
        button.clicked();
      }
    }
  }
  if (mouseButton == LEFT && selectedMenu == menus.gameMenu) {
    let ball = ballToMouse(10)
    selectedBall = ball ? ball : selectedBall;
    if (ball){
      menus.ballMenu.attemptOpen();
    }
  }
}

function keyPressed() {
  if (keyCode == 67&&document.activeElement.tagName != 'INPUT') {
    if(menus.ballMenu.open){
      cameraFollowBall.followingBall = cameraFollowBall.followingBall == true ? false : true
    }else{
      if (cameraFollowBall.followingBall){
        cameraFollowBall.followingBall = false
      }else{
        cameraFollow = cameraFollow == "FREEMOVEMENT" ? "CENTEROFGRAVITY" : "FREEMOVEMENT"
      }
    }
    if (cameraFollowBall.followingBall == false){
      cameraFollow = "FREEMOVEMENT"
    }

  }
  
  if (keyCode == 32&&document.activeElement.tagName != 'INPUT') {
    if (paused){
      paused = false;
    }else{
      paused = true;
    }
  }
}

function mouseWheel(event) {
  //console.log(zoom)
  let baseFactor = keyIsDown(16) ? 0.001 : 0.0001;
  // Get mouse position in world space BEFORE zoom change
  let mouseWorld = mouseToWorld();
  // Apply exponential flattening zoom
  zoom *= Math.exp(-event.delta * baseFactor);
  zoom = constrain(zoom, -Infinity, 100000)
  // Get mouse position in world space AFTER zoom change
  let newMouseWorld = mouseToWorld();
  // Offset camera so zoom centers on mouse
  cameraOffset.add(newMouseWorld.sub(mouseWorld));
}

//custom functions
//makes random names for bodies
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
              selectedBall = other;
            }
            j--;
            break;
          } else {
            ball.collide(other);
            ball.mass += other.mass;
            balls.splice(i, 1);
            if (selectedBall == other) {
              selectedBall = ball;
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
    if (keyIsPressed && keyIsDown(87)&&document.activeElement.tagName != 'INPUT') {
      if (keyIsDown(16)) {
        cameraOffset.y += 50 / zoom;
      }
      cameraOffset.y += 10 / zoom;
    }
    if (keyIsPressed && keyIsDown(83)&&document.activeElement.tagName != 'INPUT') {
      if (keyIsDown(16)) {
        cameraOffset.y -= 50 / zoom;
      }
      cameraOffset.y -= 10 / zoom;
    }
    if (keyIsPressed && keyIsDown(65)&&document.activeElement.tagName != 'INPUT') {
      if (keyIsDown(16)) {
        cameraOffset.x += 50 / zoom;
      }
      cameraOffset.x += 10 / zoom;
    }
    if (keyIsPressed && keyIsDown(68)&&document.activeElement.tagName != 'INPUT') {
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
  if (cameraFollowBall.followingBall){
    cameraFollow = balls[balls.indexOf(selectedBall)]
  } 
  if (cameraFollowBall.followingBall&&selectedBall==undefined){
    cameraFollow = "FREEMOVEMENT"
    cameraFollowBall.followingBall = false
  }
  if (cameraFollow instanceof Ball){
    cameraOffset.x = -cameraFollow.position.x;
    cameraOffset.y = -cameraFollow.position.y;
  }
  //console.log(cameraFollow)

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
    //show what camera is following
  textSize(height/45);
  fill(200)
  noStroke()
  let cameraFollowText;
  if (cameraFollow instanceof Ball){
    cameraFollowText = cameraFollow.name;
  } else {
    cameraFollowText = cameraFollow == "FREEMOVEMENT" ? "Free Movement" : "Center of Mass"
  }
  //console.log(cameraFollow)
  textAlign(RIGHT, BOTTOM)
  text("Camera Following: " + cameraFollowText, width, height/8*7);
  textAlign(LEFT, TOP)

  //shows what the center of the camera is looking at
  text("x: " + floor(mouseToWorld().x) + ", y: " + -floor(mouseToWorld().y), 0, 0)

  fill(30);
  stroke(255);
  strokeWeight(1);
  if (menus.barMenu.open){
    verticalTranslate = height/8*7/2
  } else if (menus.barMenu.open == false){
    verticalTranslate = height/2
  }
  let menuItems = []
  for (let i in menus){
    let menu = menus[i];
    menuItems.push(menu)
  }
  for (let i = 0; i < menuItems.length; i++){
    let menu = menuItems[i] 
    //print(menu)
    let lowestPriority = 1000;
    let displayMenu;
    for (let f = 0; f < menuItems.length; f++){
      if (menu.priority <= lowestPriority){
        lowestPriority = menu.priority;
        displayMenu = menu;
      } 
    }
    if (displayMenu.display){
      displayMenu.display()
    }
    for (let g = 0; g < menu.buttons.length; g++){
      let button = menu.buttons[g];
      if (button instanceof Button){
        if (button.display){
          button.display();
        }
        if (button.action){
          button.action();
        }
      }
    }
  }


  pop();
}

function screenToWorld(vector) {
  return vector
    .sub(width / 2, verticalTranslate)
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
      .add(width / 2, verticalTranslate);
    let screenRadius = ball.radius * zoom;
    let interactionDistance = screenRadius < buffer ? buffer : screenRadius;
    if (p5.Vector.dist(mouse, screenPosition) < interactionDistance) {
      return ball;
    }
  }
}

function findCenterOfGravity() {
  if (balls.length>0){
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
  } else{
    centerOfGravity.x = 0 
    centerOfGravity.y = 0
  }
}

function randomName(length = random(4, 8)) {
  let name = "";
  let vowels = ["a", "e", "i", "o", "u"];
  let vowelWeights = [1, 1, 1, 1, 1, 0.3];
  let consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
  //assume first letter is not vowel
  let isVowel = false;
  // set first letter to be a random letter
  let letters = vowels.concat(consonants);
  name += letters[floor(random(0, letters.length))];
  for (let i = 0; i < vowels.length; i++) {
    if (name == vowels[i]){
      //if first letter is vowel, set isVowel to true
      isVowel = true;
      break;
    }
  }
  name = name.toUpperCase();
  //find total weights of vowels
  let totalVowelWeight = 0;
  vowelWeights.forEach(vowelWeight => {
    totalVowelWeight += vowelWeight
  });   
  //add y to the list of vowels here to prevent 2 'y's in the letters list
  vowels.push('y');
  //make the rest of the letters
  for (let i = 0; i < length-1; i++) {
    if (isVowel == true) {
      //randomly choose a consonant if previous letter is a vowel
      name += consonants[floor(random(0, consonants.length), 0)];
      isVowel = false;
    } else {
      //use weighted randomness to choose a vowel
      weightChosen = random(0, totalVowelWeight);
      for (let i = 0; i < vowels.length; i++) {
        weightChosen -= vowelWeights[i];
        if (weightChosen < 0) {
          name += vowels[i];
          break;
        }
      }
      isVowel = true;
    }
  }
  return name;
}
function findSelectedMenu(){
  let hoveredMenu = null;
  let highestPriority = -Infinity;
  for (let i in menus){
    let menu = menus[i];
    //console.log(menu.contains(mouseX, mouseY))
    if (menu.contains(mouseX, mouseY) && menu.open == true){
      if (menu.priority > highestPriority){
        highestPriority = menu.priority;
        hoveredMenu = menu;
      }
    }
  }
  selectedMenu = hoveredMenu;
}
