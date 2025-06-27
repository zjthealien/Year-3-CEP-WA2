class Menu{
  constructor(x, y, w, h, priority){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    //stores all buttons (actually just items in general which have show and hide functions)
    this.buttons = [];
    this.open = false;
    //priority - displays menus with menus with lower priority displayed first
    this.priority = priority;
  }
  attemptOpen(){
    if (this.open == false){
      this.open = true;
    }
    //shows all buttons when menu is opened
    for (let i = 0; i < this.buttons.length; i++){
      this.buttons[i].show();
    }
  }
  attemptClose(){
    if (this.open == true){
      this.open = false;
    }
    //hides all buttons when menus is opened
    for (let i = 0; i < this.buttons.length; i++){
      this.buttons[i].hide();
      //makes all buttons with toggle functions inactive to prevent their actions from performing
      if (this.buttons[i].active){
        this.buttons[i].active = false;
      }
    }
  }
  assignDisplay(displayFunction){
    //displays stuff the menu has
    this.display = () => {
      if(this.open){
        displayFunction();
      }
    };
  } 
  has(otherX, otherY){
    //i made two of these functions for some reason and idk if deleting the former will break things
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