function setupBallMenu(){
  menus.ballMenu = new Menu((width / 4) * 3, -10, width / 4 + 10, (height / 8) * 7 + 10, 2);
  ballMenuExit = new Button(width-25, 5, 20, 20);
  ballMenuExit.assignAction(()=>{menus.ballMenu.attemptClose()});
  ballMenuExit.assignDisplay(ballMenuExitDisplay);
  menus.ballMenu.buttons.push(ballMenuExit)
  menus.ballMenu.assignDisplay(displayBallMenu);
  velocityInput = createInput();
  velocityInput.attribute('type', 'number');
  push()
  textSize(height/40);
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
  for (let item of menus.ballMenu.buttons){
    item.hide();
  }
}

function displayBallMenu() {
  push();
  rect((width / 4) * 3, -10, width / 4 + 10, (height / 8) * 7 + 10);
  textAlign(LEFT, TOP);
  fill(200);
  strokeWeight(0);
  textSize(1);
  let textLength = textWidth(selectedBall.name);
  //the code still works here
  let size =
    ((height / 4 - 20) / textLength > height / 20)
      ? height / 20
      : (height / 4 - 20) / textLength;
  textSize(size);
  text(selectedBall.name, (width / 4) * 3 + 10, 10);
  textSize(height / 40);
  text(
    "x: " + floor(selectedBall.position.x),
    (width / 4) * 3 + 10,
    height / 12 + height / 40
  );
  text(
    "x: " + floor(selectedBall.position.y),
    (width / 4) * 3 + 10,
    height / 12 + (height / 40) * 2
  );
  text(
    "Velocity: " +
      round(selectedBall.position.copy().sub(selectedBall.prevPosition.copy()).mag(), 3),
    (width / 4) * 3 + 10,
    height / 12 + (height / 40) * 3
  );
  text(
    "Edit Velocity: ",
    width/4*3+10,
    height/12+height/40*4
    );
  text("Mass: " + selectedBall.mass, (width / 4) * 3 + 10, height / 12);

  pop();
}

function ballMenuExitDisplay(){
  print('hi');
  push();
  stroke(255, 0, 0);
  strokeWeight(5);
  line(ballMenuExit.x, ballMenuExit.y, ballMenuExit.x+ballMenuExit.w, ballMenuExit.y+ballMenuExit.h);
  line(ballMenuExit.x, ballMenuExit.y+ballMenuExit.h, ballMenuExit.x+ballMenuExit.w, ballMenuExit.y);
  pop();
}