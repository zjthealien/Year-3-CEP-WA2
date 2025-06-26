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

function setupBallMenu(){
  segmentHeight = height/40;
  menus.ballMenu = new Menu((width / 4) * 3, -10, width / 4 + 10, (height / 8) * 7 + 10, 2);
  ballMenuExit = new Button(width-25, 5, 20, 20);
  ballMenuExit.assignDisplay((button)=>{ballMenuExitDisplay(button)});
  ballMenuExit.assignClicked(()=>{
    //selectedBall = undefined;
    menus.ballMenu.attemptClose();
  });
  menus.ballMenu.buttons.push(ballMenuExit);
  changePosition = new Button(width/4*3+10, height/12+2 + segmentHeight*3, width/4-20, segmentHeight-4)
  changePosition.active = false;
  changePosition.changingPosition = false;
  changePosition.assignDisplay((button)=>{toggleButtonDisplay(button, "Change Position")});
  changePosition.assignClicked((button)=>{toggleButtonClicked(button)})
  changePosition.assignAction(()=>{changePositionAction()});
  menus.ballMenu.buttons.push(changePosition);
  changeVelocityHeading = new Button(width/4*3+10, height/12 + segmentHeight*6 +2 , width/4-20, segmentHeight - 4)
  changeVelocityHeading.active = false;
  changeVelocityHeading.changingPosition = false;
  changeVelocityHeading.assignDisplay((button)=>{toggleButtonDisplay(button, "Change Velocity Heading")});
  changeVelocityHeading.assignClicked((button)=>{toggleButtonClicked(button)})
  changeVelocityHeading.assignAction(()=>{changeVelocityHeadingAction()});
  menus.ballMenu.buttons.push(changeVelocityHeading);
  applyColourChange = new Button(width/4*3+10, height/8*7-segmentHeight*4+2, width/4-20, segmentHeight - 4)
  applyColourChange.assignDisplay((button)=>{clickButtonDisplay(button, "Apply Colour")})
  applyColourChange.assignClicked(()=>{applyColourChangeClicked()})
  menus.ballMenu.buttons.push(applyColourChange)
  cameraFollowBall = new Button(width/4*3+10, height/8*7-segmentHeight*3+2, width/4-20, segmentHeight - 4)
  cameraFollowBall.followingBall = false;
  cameraFollowBall.assignDisplay((button)=>{cameraFollowBallDisplay(button, "Follow Ball")})
  cameraFollowBall.assignClicked((button)=>{cameraFollowBallClicked(button)})
  menus.ballMenu.buttons.push(cameraFollowBall)
  deleteSelectedBall = new Button(width/4*3+10, height/8*7-segmentHeight+2, width/4-20, segmentHeight-4)
  deleteSelectedBall.assignDisplay((button)=>{clickButtonDisplay(button, "Delete Ball")})
  deleteSelectedBall.assignClicked(()=>{deleteSelectedBallClicked()})
  menus.ballMenu.buttons.push(deleteSelectedBall);

  menus.ballMenu.assignDisplay(displayBallMenu);
  velocityInput = createInput();
  velocityInput.attribute('type', 'number');
  changeXPositionInput = createInput();
  changeXPositionInput.attribute('type', 'number');
  changeYPositionInput = createInput();
  changeYPositionInput.attribute('type', 'number');
  changeMassInput = createInput();
  changeMassInput.attribute('type', 'number');
  changeNameInput = createInput();
  changeNameInput.attribute('type', 'text');
  changeColour = createColorPicker();
  push()
  textSize(segmentHeight);
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
  changeXPositionInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    selectedBall.velocity = selectedBall.position.copy().sub(selectedBall.prevPosition)
    selectedBall.position.x = float(changeXPositionInput.value()) ? float(changeXPositionInput.value()) : 0;
    selectedBall.prevPosition = selectedBall.position.copy().sub(selectedBall.velocity)
  }
});
  menus.ballMenu.buttons.push(changeXPositionInput);
  changeYPositionInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    selectedBall.velocity = selectedBall.position.copy().sub(selectedBall.prevPosition)
    selectedBall.position.y = float(changeYPositionInput.value()) ? float(changeYPositionInput.value()) : 0;
    selectedBall.prevPosition = selectedBall.position.copy().sub(selectedBall.velocity)
  }
});
  menus.ballMenu.buttons.push(changeYPositionInput);
  changeMassInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    selectedBall.mass = float(changeMassInput.value());
  }
});
  menus.ballMenu.buttons.push(changeMassInput);
  changeNameInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    selectedBall.name = (changeNameInput.value());
  }
});
  menus.ballMenu.buttons.push(changeNameInput);
  changeColour.input(() => {
    selectedBallNewColor = changeColour.value();
  });
  menus.ballMenu.buttons.push(changeColour);
  for (let item of menus.ballMenu.buttons){
    item.hide();
  }
}

function displayBallMenu() {
  push();
  fill(30);
  rect((width / 4) * 3, -10, width / 4 + 10, (height / 8) * 7 + 10);
  textAlign(LEFT, TOP);
  fill(200);
  strokeWeight(0);
  textSize(1);
  let textLength = textWidth(selectedBall.name);
  let size =
    ((width / 4 - 40) / textLength > height / 15)
      ? height / 15
      : (width / 4 - 40) / textLength;
  textSize(size);
  text(selectedBall.name, (width / 4) * 3 + 10, 10);
  textSize(segmentHeight);
  text(
    "x: " + floor(selectedBall.position.x) + " y: " + floor(selectedBall.position.y)*-1,
    (width / 4) * 3 + 10,
    height / 12 
  );
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
  text(
    "Velocity: " +
      round(selectedBall.position.copy().sub(selectedBall.prevPosition.copy()).mag(), 3),
    (width / 4) * 3 + 10,
    height / 12 + segmentHeight*4);
  text(
    "Edit Velocity: ",
    width/4*3+10,
    height/12+segmentHeight*5
    );
  text("Acceleration: " + round(selectedBall.saveAcceleration.mag(), 5), (width / 4) * 3 + 10, height / 12+segmentHeight*7)
  text("Mass: " + selectedBall.mass, (width / 4) * 3 + 10, height / 12 + segmentHeight * 8);
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
  let printColor = color(selectedBall.color);
  push()
  textSize(height/40);
  textAlign(CENTER, CENTER)
  text(
    "Colour: (" + "r: " + red(printColor) + ", g: " + green(printColor) + ", b: " + blue(printColor) + ")", (width / 8 * 7), height / 12+segmentHeight*11+segmentHeight/2
  )
  pop();
  pop();
}

function ballMenuExitDisplay(button){
  push();
  stroke(255, 0, 0);
  strokeWeight(5);
  line(button.x, button.y, button.x+button.w, button.y+button.h);
  line(button.x, button.y+button.h, button.x+button.w, button.y);
  pop();
}

function toggleButtonDisplay(button, string){
  push();
  let buttonColour = button.active ? 200 : 60
  fill(color(buttonColour));
  rect(button.x, button.y , button.w, button.h);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize();
  let wordColour = button.active ? 60 : 200
  fill(color(wordColour));
  text(string, button.x+button.w/2, button.y+button.h/2);
  pop();
}
function changePositionAction(){
    if (changePosition.changingPosition == false && mouseIsPressed && changePosition.active == true){
      changePosition.changingPosition = true;
    }
    if (changePosition.changingPosition == true && mouseIsPressed == false || changePosition.changePositionMode == false){
      changePosition.changingPosition = false;
    }
    if (changePosition.changingPosition&& selectedMenu == menus.gameMenu){
      let velocity = selectedBall.position.copy().sub(selectedBall.prevPosition);
      selectedBall.position = mouseToWorld();
      selectedBall.prevPosition = selectedBall.position.copy().sub(velocity);
    }
}
function clickButtonDisplay(button, string){
  push();
  let buttonColour = button.contains(mouseX, mouseY) && mouseIsPressed ? 200 : 60
  fill(color(buttonColour));
  rect(button.x, button.y , button.w, button.h);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize();
  let wordColour = button.contains(mouseX, mouseY) && mouseIsPressed ? 60 : 200
  fill(color(wordColour));
  text(string, button.x+button.w/2, button.y+button.h/2);
  pop();
}

function toggleButtonClicked(clickedButton){
  for (let item in selectedMenu.buttons){
    let button = selectedMenu.buttons[item];
    if (button != clickedButton){
      button.active = false;
    }
  }
  clickedButton.active = clickedButton.active == true ? false : true;
}

function changeVelocityHeadingAction(){
  if (changeVelocityHeading.active == true && mouseIsPressed && selectedMenu == menus.gameMenu){
    let velocity = selectedBall.position.copy().sub(selectedBall.prevPosition);
    newHeading = mouseToWorld().sub(selectedBall.position);
    velocity.setHeading(newHeading.heading());
    selectedBall.prevPosition = selectedBall.position.copy().sub(velocity);
  }
}

function applyColourChangeClicked(){
  selectedBall.color = selectedBallNewColor ? selectedBallNewColor : color(200);
}

function deleteSelectedBallClicked(){
  balls.splice(balls.indexOf(selectedBall), 1)
}
function cameraFollowBallClicked(clickedButton){
  if (clickedButton.followingBall==true){
    clickedButton.followingBall = false;
  } else {
    clickedButton.followingBall = true;
  }
}
function cameraFollowBallDisplay(button, string){
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