let setting = {};
setting.showVector = true;


function arrow(x1, y1, x2, y2, colour){
  //an arrow creating function, base at first set of coordinates, tip at second set of coordinates
  //arrow position is the first set of coordinates
  let arrowPosition = createVector(x1, y1);
  let arrowVector = createVector(x2-x1, y2-y1)
  //line portion of arrow, with base at 0,0
  //adjust length to ensure tip of arrow is at second set of coordinates
  let arrowSize = arrowVector.mag()/3
  let lineVector = arrowVector.copy().setMag(arrowVector.mag()-arrowSize)
  //position of other end of line portion of arrow
  let arrowHeadBase = lineVector.copy().add(arrowPosition)
  
  
  //find coordinates of right corner of arrowhead in relation to base of arrow Vector
  let arrowHeadRight = arrowVector.copy();
  //rotate 90 degrees to the right
  arrowHeadRight.setHeading(lineVector.heading()+PI/2);
  arrowHeadRight.setMag(arrowSize/2);
  //find coordinates of left corner of arrowhead by using negative of right corner of arrowhead
  let arrowHeadLeft = arrowHeadRight.copy().mult(-1);
  //using vector of line portion of arrow to find tip of arrowhead
  let arrowHeadMiddle = arrowVector.copy().setMag(arrowSize)
  //find position of base of arrowhead by adding the position of base of arrow to the line portion of arrow
  //move arrowhead to base of arrowhead
  arrowHeadRight.add(arrowHeadBase);
  arrowHeadLeft.add(arrowHeadBase);
  arrowHeadMiddle.add(arrowHeadBase);
  //display arrow
  push();
  c = color(colour);
  print(c)
  c.setAlpha(100);
  strokeWeight(0);
  stroke(c)
  fill(c)
  triangle(arrowHeadRight.x, arrowHeadRight.y, arrowHeadMiddle.x, arrowHeadMiddle.y, arrowHeadLeft.x, arrowHeadLeft.y);
  strokeWeight(arrowSize/2)
  line(arrowPosition.x, arrowPosition.y, arrowHeadBase.x, arrowHeadBase.y)
  pop();
}
function displayVectors(array){
  if (setting.showVector == true){
    for (let i = 0; i < array.length; i++){
      let ball = array[i];
      let velocity = ball.position.copy()
      .sub(ball.prevPosition).mult(10).add(ball.position);
      arrow(ball.position.x, ball.position.y, velocity.x, velocity.y, 'green');
      let acceleration = ball.acceleration.copy().mult(10000);
      acceleration.add(ball.position)
    arrow(ball.position.x, ball.position.y, acceleration.x, acceleration.y, 'red')
  }
  }
}
