//a custom button object for better interactions and displaying
class Button{
    constructor(x, y, w, h, text = ''){
        this.x = x;
        this.y = y; 
        this.w = w;
        this.h = h;
        this.open = true;
        
        //stores functions
        this.action;
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
        //detects if coordinates are within button
        if (this.x < otherX && otherX < this.x + this.w &&
            this.y < otherY && otherY < this.y + this.h
        ){
            return true;
        }
    }
    assignClicked(clicked){
        //runs this function if button is clicked 
        this.clicked = () => {
            if(this.open&&this.contains(mouseX, mouseY)){
               clicked(this);
            }
        };
    }
    assignDisplay(displayFunction){
        //runs this every frame
        this.display = () => {
            if(this.open){
                displayFunction(this);
            }
        };
    } 
    assignAction(action){
        //runs every frame as well, for the actions of the button
        this.action = () => {
            if(this.open){
               action();
            }
        };
    } 
}