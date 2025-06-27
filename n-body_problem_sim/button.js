class Button{
    constructor(x, y, w, h, text = ''){
        this.x = x;
        this.y = y; 
        this.w = w;
        this.h = h;
        this.open = true;
        this.action;
        this.text = text;
        //stores function for displaying
        this.display;
        this.clicked;
    }
    show(){
        this.open = true;
    }
    hide(){
        this.open = false;
    }
    contains(otherX, otherY){
        if (this.x < otherX && otherX < this.x + this.w &&
            this.y < otherY && otherY < this.y + this.h
        ){
            return true;
        }
    }
    assignClicked(clicked){
        this.clicked = () => {
            if(this.open&&this.contains(mouseX, mouseY)){
               clicked(this);
            }
        };
    }
    assignDisplay(displayFunction){
        //console.log(this)
        this.display = () => {
            if(this.open){
                displayFunction(this);
            }
        };
    } 
    assignAction(action){
        this.action = () => {
            if(this.open){
               action();
            }
        };
    } 
}