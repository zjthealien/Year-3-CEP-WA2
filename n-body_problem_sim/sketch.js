//this file is very messy.

//declare variable dump
const BALLNUMBER = 100;
let BALLMASS = 200;
const INITIALVELOCITY = 0;
const GRAVITATIONAL_CONSTANT = 0.1;
let SPIRAL_RADIUS_INCREMENT = 1; // Controls the spread of the spiral
let SUNMASS = 1000000;

let timeMultiplier = 1;
let timeScale = 1; // - useless and I can't be bothered to fix
let trailLength = 300; /* timeScale;*/
//balls array
let balls = [];
//offsets camera by this vector
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
//makes the game menu smaller as part of it is blocked by the bar menu
let verticalTranslate;

//in a seperate function so the simulation can reset without reloading the pageee
function setupFunction(){
  //sets the random seed to use the seed
  randomSeed(seed);
  //resets the balls array
  balls = []
  let sun = new Ball(0, 0, SUNMASS, "Sol-" + seed);
  sun.color = color(255, 204, 0); // Yellow color for the sun-yours sincerely, ChatGPT 
  balls.push(sun);
  // Create balls in a spiral pattern -yours sincerely, ChatGPT 


  let maxX = -Infinity;
  let maxY = -Infinity;
  let minX = Infinity;
  let minY = Infinity;
  //makes the same number of balls as ball number
  for (let i = 0; i < BALLNUMBER; i++) {
    let angle = i;
    let radius = i * random(1, 5) * SPIRAL_RADIUS_INCREMENT + 1500; // Radius increases as we go along the spiral-yours sincerely, ChatGPT 
    // Introduce small variation to the angle to add randomness-yours sincerely, ChatGPT 
    let angleVariation = random(-1, 1);
    let adjustedAngle = angle + angleVariation;
    // Calculate the ball's position using polar coordinates-yours sincerely, ChatGPT 
    let x = radius * cos(adjustedAngle);
    let y = radius * sin(adjustedAngle);
    //find the max and min of these axes
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    let newBall = new Ball(x, y, BALLMASS, randomName());
    //varies the velocity for each ball
    let velocityAngle = adjustedAngle + HALF_PI; 
    let velocityMagnitude = sqrt(
    (GRAVITATIONAL_CONSTANT *((SUNMASS) + (BALLNUMBER * BALLMASS / 2))/radius)*timeScale*random(0.6,1.4)); 
    let velocity = p5.Vector.fromAngle(velocityAngle).mult(velocityMagnitude);
    //applies each velocity to the ball by changing the previous position the ball starts with
    newBall.prevPosition = p5.Vector.sub(newBall.position, velocity);
    balls.push(newBall);
  }
  //finds the center of gravity yay
  centerOfGravity = createVector(0, 0);
  findCenterOfGravity();
  //makes sure all the balls are within the screen at the start
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
  console.log(tutorialPanels)
  //makes a random 10 digit (maybe) seed
  seed = round(random(1,9999999999));
  print("Seed: " + seed);
  let canvas = createCanvas(windowWidth, windowHeight);
  //prevents context menu from appearing when right clicking (doesnt interfere with creating balls)
  canvas.elt.oncontextmenu = () => false;
  //sets up the menus
  setupBallMenu();
  //game menu to prevent interactions with the simulation when the mouse is not on the simualtion
  menus.gameMenu = new Menu (0, 0, width, height, [], 1);
  menus.gameMenu.open = true;
  setupBarMenu();
  setupFunction();
  setupTutorialMenu()

}

function draw() {
  //makes selected ball undefined if it isnt in the balls array - in an effort to eradicate it if its supposed to be gone
  if (balls.includes(selectedBall)){

  }else{
    selectedBall = undefined;
    //ballmenu closes because there is no selected ball to display
    menus.ballMenu.attemptClose()
  }
  background(0);
  //updates physics x times based on time multiplier and whether the game menu is open (closed when tutorial menu is open) and if game is paused
  if (!paused&&menus.gameMenu.open){
    for (let times = 0; times < timeMultiplier; times++) {
      physicsUpdate();
    }
  }
  //uh does camera things
  setCameraSettings();
  //finds center of gravity so center of mass marker can be displayed
  findCenterOfGravity();
  //translates and scales the screen for proper displaying of stuff
  translate(width / 2, verticalTranslate);
  scale(zoom);
  translate(cameraOffset.x, cameraOffset.y);
  //displays trails first to prevent them overlapping with balls
  for (let ball of balls){
    ball.trailDisplay();
  }
  //displays balls
  for (let ball of balls) {
    ball.ballDisplay();
    
  }
  //displays vectors of balls
  displayVectors(balls);
  //displays the great center of mass marker (all mentions of center of gravity are in fact referring to center of mass)
  displayCenterOfMassMarker();
  //resets the previous transformations so the UI can be displayed
  resetMatrix();
  findSelectedMenu()
  displayUserInterface();
}

function mousePressed(){
  //spawns balls when pressing right mouse button 
  if (menus.gameMenu.open){
  if (mouseButton == RIGHT&&selectedMenu == menus.gameMenu) {
    spawnBallOnLocation(mouseToWorld());
  }
  //selects balls if within radius + 10 pixels of radius when pressing left mouse button
  if (mouseButton == LEFT && selectedMenu == menus.gameMenu) {
    //balltomouse returns a Ball object
    let ball = ballToMouse(10)
    //if mouse clicked on a ball, selected ball changes, if not clicked on ball, selected ball does not change
    selectedBall = ball ? ball : selectedBall;
    //opens the ball menu to display the ball selected
    if (ball){
      menus.ballMenu.attemptOpen();
    }
  }
}
//goes through every button in the menu selected to see if they have been clicked and run corressponding code if there is corressponding code
  for (let button of selectedMenu.buttons){
    if (button instanceof Button){
      if (button.clicked){
        button.clicked();
      }
    }
  }
}

function keyPressed() {
  //doesnt process key presses when an input is selected

  //when press 'c' and gameMenu is open, do this thing
  if (keyCode == 67&&document.activeElement.tagName != 'INPUT'&&menus.gameMenu.open) {
    if(menus.ballMenu.open){
      //camera switches between free movement and following the ball if ball menu open
      if (cameraFollowBall.followingBall == true){
        cameraFollowBall.followingBall = false
        cameraFollow = "FREEMOVEMENT"
      }else{
        cameraFollowBall.followingBall = true
      }
    }else{
      if (cameraFollowBall.followingBall){
        //if camera is still following ball after ball menu is closed (for nice view), make it stop doing that and go to free movement
        cameraFollowBall.followingBall = false
        cameraFollow = "FREEMOVEMENT"
      }else{
        //toggles between free movement and following center of MASS
        cameraFollow = cameraFollow == "FREEMOVEMENT" ? "CENTEROFGRAVITY" : "FREEMOVEMENT"
      }
    }
  }
  //when press space, pause/start the game
  if (keyCode == 32&&document.activeElement.tagName != 'INPUT'&&menus.gameMenu.open) {
    if (paused){
      paused = false;
    }else{
      paused = true;
    }
  }
}

function mouseWheel(event) {
  //when shift is held, it zooms faster
  //zooms in and out, courtesy of CHATGPT
  if (menus.gameMenu.open){
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
}
//spawns ball on position (a vector)
function spawnBallOnLocation(position) {
  let newBall = new Ball(position.x, position.y, BALLMASS, randomName());
  balls.push(newBall);
}

//does physics updates
function physicsUpdate() {
  //for every ball in balls
  for (let j = 0; j < balls.length; j++) {
    let ball = balls[j];
    //for every other ball in balls
    for (let i = 0; i < balls.length; i++) {
      let other = balls[i];
      //if other ball is not the first ball, attract it
      if (ball != other) {
        ball.attract(other);
        //collision detection
        if (
          p5.Vector.dist(ball.position, other.position) <
          ball.radius + other.radius
        ) {
          //for the biggest ball
          if (other.mass > ball.mass) {
            other.collide(ball);
            //add smaller ball mass to biggest ball
            other.mass += ball.mass;
            //remove smaller ball
            balls.splice(j, 1);
            //swap selected ball to bigger ball if smaller ball was selected ball
            if (selectedBall == ball) {
              selectedBall = other;
            }
            //go back one to account for removal of ball
            j--;
            break;
            //stop looping through for all the other balls as the first ball is gone, destroyed (i realised this is not the best way to do this but whatever)
          } else {
            //the first ball consumes the other ball if same mass or first ball more mass
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
    //moves the balls
    ball.update();
  }
  findCenterOfGravity();
}

function setCameraSettings() {
  //when shift is held, it moves faster
  //doesnt work when input is selected
  //WASD for free movement
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
  //follows center of mass
  if (cameraFollow == "CENTEROFGRAVITY") {
    cameraOffset.x = -centerOfGravity.x;
    cameraOffset.y = -centerOfGravity.y;
  }
  //makes camera follow a ball object (might be a bad idea)
  if (cameraFollowBall.followingBall){
    cameraFollow = balls[balls.indexOf(selectedBall)]
  } 
  //if selected ball suddenly goes missing
  //camera follow returns to free movement and following ball is false
  if (cameraFollowBall.followingBall&&selectedBall==undefined){
    cameraFollow = "FREEMOVEMENT"
    cameraFollowBall.followingBall = false
  }
  //follows ball if camera follow is a ball object
  if (cameraFollow instanceof Ball){
    cameraOffset.x = -cameraFollow.position.x;
    cameraOffset.y = -cameraFollow.position.y;
  }
  //console.log(cameraFollow)

}

function displayCenterOfMassMarker() {
  //shows the red square which is the center of mass marker
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
  textAlign(RIGHT, BOTTOM)
  text("Camera Following: " + cameraFollowText, width, height/8*7);
  textAlign(LEFT, TOP)

  //shows what the center of the camera is looking at
  text("x: " + floor(mouseToWorld().x) + ", y: " + -floor(mouseToWorld().y), 0, 0)

  fill(30);
  stroke(255);
  strokeWeight(1);
  //makes the center of the screen a higher spot to account for the bar menu taking up space
  if (menus.barMenu.open){
    verticalTranslate = height/8*7/2
  } else if (menus.barMenu.open == false){
    verticalTranslate = height/2
  }
  //push every menu into an array
  let menuItems = []
  for (let i in menus){
    let menu = menus[i];
    menuItems.push(menu)
  }
  //sort the menus in terms of priority (CHATGPT)
  let sortedMenus = Object.values(menus).sort((a, b) => a.priority - b.priority);

    // Loop and display each menu in order of increasing priority
    for (let menu of sortedMenus) {
      if (menu.display) {
          menu.display();
      }
      //display the menus Button objects after displaying it
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
//converts screen coords to world coords
function screenToWorld(vector) {
  return vector
    .sub(width / 2, verticalTranslate)
    .div(zoom)
    .sub(cameraOffset);
}
//does that but inputs mouse coords 
function mouseToWorld() {
  return screenToWorld(createVector(mouseX, mouseY));
}
//finds out if mouse touches a ball with a pixel buffer
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
//finds cenetr of mass
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
//makes random names for balls
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
//finds the menu which the mouse is on, with the help of priority
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
