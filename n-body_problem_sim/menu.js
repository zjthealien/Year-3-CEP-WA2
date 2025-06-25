class Menu{
  constructor(x, y, w, h, priority){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.buttons = [];
    this.open = false;
    this.priority = priority;
  }
  attemptOpen(){
    console.log('attempt open')
    //print(this.open)
    if (this.open == false){
      this.open = true;
    }
    for (let i = 0; i < this.buttons.length; i++){
      this.buttons[i].show();
    }
  }
  attemptClose(){
    console.log('attmept close')
    if (this.open == true){
      this.open = false;
    }
    for (let i = 0; i < this.buttons.length; i++){
      this.buttons[i].hide();
    }
  }
  assignDisplay(displayFunction){
    this.display = () => {
      if(this.open){
        displayFunction();
      }
    };
  } 
  has(otherX, otherY){
    if (this.x < otherX && otherX < this.x + this.w &&
        this.y < otherY && otherY < this.y + this.h
    ){
        return true;
    }
  }
  contains(otherX, otherY){
      if (this.x < otherX && otherX < this.x + this.w &&
          this.y < otherY && otherY < this.y + this.h
      ){
          return true;
      }
  }
}