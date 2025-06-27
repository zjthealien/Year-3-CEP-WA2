//declares global variables for objects (easier tracking)
let ballMenuExit;
let changePosition;
let velocityInput;
let changeXPositionInput;
let changeYPositionInput;
let changeVelocityHeading;
let changeMassInput;
let changeNameInput;
let segmentHeight;
let changeColour;
let applyColourChange
let selectedBallNewColor;
let deleteSelectedBall;
let cameraFollowBall;

//sets up the ball menu in setup()
function setupBallMenu(){
  //segmentHeight determines how big the various objects below are for easier editing
  segmentHeight = height/40;
  //makes the ballMenu object
  menus.ballMenu = new Menu((width / 4) * 3, -10, width / 4 + 10, (height / 8) * 7 + 10, 2);
  //button results in closing the ballMenu
  ballMenuExit = new Button(width-25, 5, 20, 20);
  ballMenuExit.assignDisplay((button)=>{ballMenuExitDisplay(button)});
  //closes menu when button is clicked
  ballMenuExit.assignClicked(()=>{
    menus.ballMenu.attemptClose();
  });
  menus.ballMenu.buttons.push(ballMenuExit);
  //enables click and drag when cursor is on the ball to change the position of the ball
  changePosition = new Button(width/4*3+10, height/12+2 + segmentHeight*3, width/4-20, segmentHeight-4)
  changePosition.active = false;
  changePosition.changingPosition = false;
  changePosition.assignDisplay((button)=>{toggleButtonDisplay(button, "Change Position")});
  changePosition.assignClicked((button)=>{toggleButtonClicked(button)})
  changePosition.assignAction(()=>{changePositionAction()});
  menus.ballMenu.buttons.push(changePosition);
  //changes the direction of the ball's velocity vector to where the cursor is relative to the ball
  changeVelocityHeading = new Button(width/4*3+10, height/12 + segmentHeight*6 +2 , width/4-20, segmentHeight - 4)
  changeVelocityHeading.active = false;
  changeVelocityHeading.changingPosition = false;
  changeVelocityHeading.assignDisplay((button)=>{toggleButtonDisplay(button, "Change Velocity Heading")});
  changeVelocityHeading.assignClicked((button)=>{toggleButtonClicked(button)})
  changeVelocityHeading.assignAction(()=>{changeVelocityHeadingAction()});
  menus.ballMenu.buttons.push(changeVelocityHeading);
  //changes colour of the ball to what is selected on the color picker
  applyColourChange = new Button(width/4*3+10, height/8*7-segmentHeight*4+2, width/4-20, segmentHeight - 4)
  applyColourChange.assignDisplay((button)=>{clickButtonDisplay(button, "Apply Colour")})
  applyColourChange.assignClicked(()=>{applyColourChangeClicked()})
  menus.ballMenu.buttons.push(applyColourChange)
  //makes the camera follow the ball when toggled
  cameraFollowBall = new Button(width/4*3+10, height/8*7-segmentHeight*3+2, width/4-20, segmentHeight - 4)
  cameraFollowBall.followingBall = false;
  cameraFollowBall.assignDisplay((button)=>{cameraFollowBallDisplay(button, "Follow Ball")})
  cameraFollowBall.assignClicked((button)=>{cameraFollowBallClicked(button)})
  menus.ballMenu.buttons.push(cameraFollowBall)
  //removes ball from balls array, deleting it
  deleteSelectedBall = new Button(width/4*3+10, height/8*7-segmentHeight+2, width/4-20, segmentHeight-4)
  deleteSelectedBall.assignDisplay((button)=>{clickButtonDisplay(button, "Delete Ball")})
  deleteSelectedBall.assignClicked(()=>{deleteSelectedBallClicked()})
  menus.ballMenu.buttons.push(deleteSelectedBall);

  menus.ballMenu.assignDisplay(displayBallMenu);
  //change velocity of ball
  velocityInput = createInput();
  velocityInput.attribute('type', 'number');
  //change x position of ball
  changeXPositionInput = createInput();
  changeXPositionInput.attribute('type', 'number');
  //change y position of ball
  changeYPositionInput = createInput();
  changeYPositionInput.attribute('type', 'number');
  //change mass of ball
  changeMassInput = createInput();
  changeMassInput.attribute('type', 'number');
  //change name of ball - is string unlike the previous 4 inputs
  changeNameInput = createInput();
  changeNameInput.attribute('type', 'text');
  //color picker to determine colour of ball
  changeColour = createColorPicker();
  push()
  textSize(segmentHeight);
  //sets position and size of inputs / color picker
  velocityInput.position(width/4*3+10+textWidth('Edit Velocity: '), height/12+segmentHeight*5+2);
  velocityInput.size(width/4-30-textWidth('Edit Velocity: '), segmentHeight-8)
  changeXPositionInput.position(width/4*3+10+textWidth('Edit x-position: '), height/12+segmentHeight+2)
  changeXPositionInput.size(width/4-30-textWidth('Edit x-position: '), segmentHeight-8)
  changeYPositionInput.position(width/4*3+10+textWidth('Edit y-position: '), height/12+segmentHeight*2+2)
  changeYPositionInput.size(width/4-30-textWidth('Edit y-position: '), segmentHeight-8)
  changeMassInput.position(width/4*3+10+textWidth('Edit Mass: '), height/12+segmentHeight*9+2)
  changeMassInput.size(width/4-30-textWidth('Edit Mass: '), segmentHeight-8)
  changeNameInput.position(width/4*3+10+textWidth('Edit Name: '), height/12+segmentHeight*10+2)
  changeNameInput.size(width/4-30-textWidth('Edit Name: '), segmentHeight-8)
  changeColour.position(width/4*3+10, height/12+segmentHeight*12+2)
  changeColour.size(width/4-20, height/8*7-height/12-segmentHeight*16 - 4)
  pop();
  //when press enter and the input is selected, change the velocity to what is in the input
  velocityInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    let speed = float(velocityInput.value()) ? float(velocityInput.value()) : 0; // Get input as a float

    // Compute direction vector
    let velocity = p5.Vector.sub(selectedBall.position, selectedBall.prevPosition).mag() == 0 ? createVector(1,0).setHeading(0) : p5.Vector.sub(selectedBall.position, selectedBall.prevPosition);

    // Set magnitude to user input
    velocity.setMag(speed);

    // Update previous position based on new velocity
    selectedBall.prevPosition = p5.Vector.sub(selectedBall.position, velocity);
  }
});
  menus.ballMenu.buttons.push(velocityInput);
  //when press enter and the input is selected, change the x position to what is in the input
  changeXPositionInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    let velocity = selectedBall.position.copy().sub(selectedBall.prevPosition);
    //sets balls position to value of input or 0 if nothing is entered
    selectedBall.position.x = float(changeXPositionInput.value()) ? float(changeXPositionInput.value()) : 0;
      selectedBall.prevPosition = selectedBall.position.copy().sub(velocity);
  }
});
  menus.ballMenu.buttons.push(changeXPositionInput);
  //when press enter and the input is selected, change the y position to what is in the input
  changeYPositionInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    let velocity = selectedBall.position.copy().sub(selectedBall.prevPosition);
    //sets balls position to value of input or 0 if nothing is entered
    selectedBall.position.y = float(changeYPositionInput.value()) ? float(changeYPositionInput.value()) : 0;
    selectedBall.prevPosition = selectedBall.position.copy().sub(velocity);
  }
});
  menus.ballMenu.buttons.push(changeYPositionInput);
  //when press enter and the input is selected, change the mass to what is in the input
  changeMassInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    //constrains the mass to a limit based on how glitchy i found it 
    selectedBall.mass = constrain(float(changeMassInput.value()), 1, 1000000000);
  }
});
  menus.ballMenu.buttons.push(changeMassInput);  
  //when press enter and the input is selected, change the name to what is in the input
  changeNameInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    //yes it can be anything. but when its very long you cant see the letters as the font size adjusts itself so...
    selectedBall.name = (changeNameInput.value());
  }
});
  menus.ballMenu.buttons.push(changeNameInput);
  changeColour.input(() => {
    //constantly updates the selectedBallNewColor to whatever the value of the color picker is 
    //- applies the color only when the apply color button is pressed
    selectedBallNewColor = changeColour.value();
  });
  menus.ballMenu.buttons.push(changeColour);
}

function displayBallMenu() {
  //closes the ball menu if the selected ball is deleted aka removed from balls array
  if (balls.includes(selectedBall)){
    
  } else{
    menus.ballMenu.attemptClose();
  }


  push();
  fill(30);
  rect((width / 4) * 3, -10, width / 4 + 10, (height / 8) * 7 + 10);
  textAlign(LEFT, TOP);
  fill(200);
  strokeWeight(0);
  
  //displays ball's name
  //makes text size 1 to find out how long the ball's name is when it is 1 pixel font size?
  textSize(1)
  let textLength = textWidth(selectedBall.name);
  //size changes based on length of name to make sure it is displayed in its entirety
  let size =
    ((width / 4 - 40) / textLength > height / 15)
      ? height / 15
      : (width / 4 - 40) / textLength;
  //adjusts the text size based on the previous thing
  textSize(size);
  text(selectedBall.name, (width / 4) * 3 + 10, 10);
  //makes text the same size as segment height so that it fits
  textSize(segmentHeight);
  //displays ball's position in terms of x and y coords; idk why the y is off by one ._.
  text(
    "x: " + floor(selectedBall.position.x) + " y: " + (-floor(selectedBall.position.y)-1),
    (width / 4) * 3 + 10,
    height / 12 
  );
  //user instructions for the input objects - tells them what they do - change position of ball
  text(
    "Edit x-position: ",
    width/4*3+10,
    height/12+segmentHeight*1
  );
  text(
    "Edit y-position: ",
    width/4*3+10,
    height/12+segmentHeight*2
  );
  //displays magnitude of velocity of ball
  text(
    "Velocity: " +
      round(selectedBall.position.copy().sub(selectedBall.prevPosition.copy()).mag(), 3),
    (width / 4) * 3 + 10,
    height / 12 + segmentHeight*4);
    //for input object
  text(
    "Edit Velocity: ",
    width/4*3+10,
    height/12+segmentHeight*5
    );
    //displays magnitude of acceleration of ball
  text("Acceleration: " + round(selectedBall.saveAcceleration.mag(), 5), (width / 4) * 3 + 10, height / 12+segmentHeight*7)
  //displays mass of ball
  text("Mass: " + selectedBall.mass, (width / 4) * 3 + 10, height / 12 + segmentHeight * 8);
  //for input object
  text(
    "Edit Mass: ",
    width/4*3+10,
    height/12+segmentHeight*9
  );
  text(
    "Edit Name: ",
    width/4*3+10,
    height/12+segmentHeight*10
  );
  //makes selectedBall's color into a p5.Color object
  let printColor = color(selectedBall.color);
  push()
  //changes the text size so that it fits - it is quite long
  textSize(height/40);
  text(
    "Colour: (" + "r: " + red(printColor) + ", g: " + green(printColor) + ", b: " + blue(printColor) + ")", (width / 4 * 3)+10, height / 12+segmentHeight*11+2
  )
  pop();
  pop();
  //determines size of text in buttons
  textSize(height/60)
}

function ballMenuExitDisplay(button){
  //draws a red X for the menu exit button
  push();
  stroke(255, 0, 0);
  strokeWeight(5);
  line(button.x, button.y, button.x+button.w, button.y+button.h);
  line(button.x, button.y+button.h, button.x+button.w, button.y);
  pop();
}

function toggleButtonDisplay(button, string){
  //generic toggle button display for mass production
  push();
  stroke(200)
  //makes button bright when active
  let buttonColour = button.active ? 200 : 60
  fill(color(buttonColour));
  //displays rect to demarcate button
  rect(button.x, button.y , button.w, button.h);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize();
  //makes words dark when active
  let wordColour = button.active ? 60 : 200
  fill(color(wordColour));
  //words displayed for user instruction
  text(string, button.x+button.w/2, button.y+button.h/2);
  pop();
}
function changePositionAction(){
    //when mouse is pressed and changePosition button is toggled to be active, changing position mode is on!
    if (changePosition.changingPosition == false && mouseIsPressed && changePosition.active == true){
      changePosition.changingPosition = true;
    }
    //if changePosition button is toggled off or (changing position mode is on and mouse isnt pressed), changing position mode is off :(
    if (changePosition.changingPosition == true && mouseIsPressed == false || changePosition.changePositionMode == false){
      changePosition.changingPosition = false;
    }
    //if changing position mode is on and the cursor is on the simulation space, ball's position moved to where cursor is. 
    //(also makes the velocity of the ball stay the same by moving the ball's previous position, which determines velocity, along in the same position relative to the ball)
    if (changePosition.changingPosition&& selectedMenu == menus.gameMenu){
      let velocity = selectedBall.position.copy().sub(selectedBall.prevPosition);
      //converts mouse coordinates on screen to the coordinates of the world
      selectedBall.position = mouseToWorld();
      selectedBall.prevPosition = selectedBall.position.copy().sub(velocity);
    }
}
function clickButtonDisplay(button, string){
  //display for buttons which only click and dont toggle (for mass production as well)
  push();
  //if mouse is on button and pressing, button turns bright
  let buttonColour = button.contains(mouseX, mouseY) && mouseIsPressed ? 200 : 60
  fill(color(buttonColour));
  rect(button.x, button.y , button.w, button.h);
  noStroke();
  textAlign(CENTER, CENTER);
  //if mouse is on button and pressing, words turn dark
  let wordColour = button.contains(mouseX, mouseY) && mouseIsPressed ? 60 : 200
  fill(color(wordColour));
  //words for instruction
  text(string, button.x+button.w/2, button.y+button.h/2);
  pop();
}

function toggleButtonClicked(clickedButton){
  //makes all other toggle buttons inactive so chaos doesnt descend
  for (let item in selectedMenu.buttons){
    let button = selectedMenu.buttons[item];
    if (button != clickedButton){
      button.active = false;
    }
  }
  //switches between true and false for active each time the button is clicked
  clickedButton.active = clickedButton.active == true ? false : true;
}

function changeVelocityHeadingAction(){
  //changes the heading of the velocity thingy of ball so it faces where the mouse is when the mouse is on simulation space and is pressed
  if (changeVelocityHeading.active == true && mouseIsPressed && selectedMenu == menus.gameMenu){
    let velocity = selectedBall.position.copy().sub(selectedBall.prevPosition);
    newHeading = mouseToWorld().sub(selectedBall.position);
    velocity.setHeading(newHeading.heading());
    selectedBall.prevPosition = selectedBall.position.copy().sub(velocity);
  }
}

function applyColourChangeClicked(){
  //applies color, if no color is selected, makes ball grey
  selectedBall.color = selectedBallNewColor ? selectedBallNewColor : color(200);
}

function deleteSelectedBallClicked(){
  //removes ball from balls array and hopefully eviscerates it from the face of the computer
  balls.splice(balls.indexOf(selectedBall), 1)
}
function cameraFollowBallClicked(clickedButton){
  //switches between camera following ball and free movement, changing the camera follow to follow the ball comes later
  if (clickedButton.followingBall==true){
    clickedButton.followingBall = false;
    cameraFollow = "FREEMOVEMENT"
  } else {
    clickedButton.followingBall = true;
  }
}
function cameraFollowBallDisplay(button, string){
  //same as toggle button display, except it changes colours when the following ball variable is true/false
  push();
  let buttonColour = button.followingBall ? 200 : 60
  fill(color(buttonColour));
  rect(button.x, button.y , button.w, button.h);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize();
  let wordColour = button.followingBall ? 60 : 200
  fill(color(wordColour));
  text(string, button.x+button.w/2, button.y+button.h/2);
  pop();
}