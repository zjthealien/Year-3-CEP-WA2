class Menu{
  constructor(x, y, w, h, buttons){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.buttons = buttons;
    for (let i = 0; i < this.buttons.length; i++){
      this.buttons[i].hide();
    }
    this.open = false;
  }
  attemptOpen(){
    if (this.open == false){
      this.open = true;
    }
    for (let i = 0; i < this.buttons.length; i++){
      this.buttons[i].show();
    }
    print('attmept open')
  }
  attemptClose(){
    if (this.open == true){
      this.open = false;
    }
    for (let i = 0; i < this.buttons.length; i++){
      this.buttons[i].hide();
    }
    print('attempt close')
  }
  assignOpen(button){
    button.mousePressed(() => {this.attmeptOpen()})
  }
  assignClose(button){
    button.mousePressed(() => {this.attemptClose()})
  }
  assignDisplay(displayFunction){
    this.display = displayFunction;
  } 
}