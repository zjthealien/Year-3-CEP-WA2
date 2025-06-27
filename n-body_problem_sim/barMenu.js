//VARIABLES
let timeMultiplierModifierValue = 10;
let positiveTimeMultiplier;
let negativeTimeMultiplier;
let timeMultiplierModifier;
let multTenTimeModifierValue;
let divTenTimeModifierValue;
let pauseStartButton;
let seedInput;
let clearAllBallsButton;
let spawnMassInput;
let sunMassInput;
let openTutorialMenu;
let toggleVectors;

function setupBarMenu(){
    //menu
    menus.barMenu = new Menu(-10, (height / 8) * 7, width + 20, height / 8 + 10, 3);
    menus.barMenu.assignDisplay(displayBarMenu);
    //when pressed, add/subtract the time multiplier (no. updates to physics in a frame) by a set value (timeMultiplierModifierValue, from now referred to as 'the set value' for convenience)
    timeMultiplierModifier = new Button(10, height/8*7+height/16, width/8, height/16-10);
    timeMultiplierModifier.assignDisplay((button)=>{
        //includes a + sign to positive values to show it adds this value
        let posNegSign = timeMultiplierModifierValue>0? "+" : ""
        clickButtonDisplay(button, posNegSign + timeMultiplierModifierValue+"x")
    });
    timeMultiplierModifier.assignClicked(()=>{timeMultiplierModifierClicked()});
    timeMultiplierModifier.assignAction(()=>{timeMultiplierModifierAction()})
    menus.barMenu.buttons.push(timeMultiplierModifier)
    //makes the set value positive
    positiveTimeMultiplier = new Button(10+width/8, height/8*7+height/16, width/32, height/32-5)
    positiveTimeMultiplier.assignDisplay((button)=>{toggleButtonDisplay(button, "+")})
    positiveTimeMultiplier.assignClicked((button)=>{toggleButtonClicked(button)})
    positiveTimeMultiplier.active = false
    menus.barMenu.buttons.push(positiveTimeMultiplier)
    //makes the set value negative
    negativeTimeMultiplier = new Button(10+width/8, height/8*7+height/16+height/32-5, width/32, height/32-5)
    negativeTimeMultiplier.assignDisplay((button)=>{toggleButtonDisplay(button, "-")})
    negativeTimeMultiplier.assignClicked((button)=>{toggleButtonClicked(button)})
    negativeTimeMultiplier.active = false
    menus.barMenu.buttons.push(negativeTimeMultiplier);
    //multiplies the set value by ten
    multTenTimeModifierValue = new Button(10+width/8+width/32, height/8*7+height/16, width/20-10, height/32-5)
    multTenTimeModifierValue.assignDisplay((button)=>{(clickButtonDisplay(button, "x10"))})
    multTenTimeModifierValue.assignClicked(()=>{multTenTimeModifierValueClicked()})
    menus.barMenu.buttons.push(multTenTimeModifierValue)
    //divides the set value by ten
    divTenTimeModifierValue = new Button(10+width/8+width/32, height/8*7+height/16+height/32-5, width/20-10, height/32-5)
    divTenTimeModifierValue.assignDisplay((button)=>{(clickButtonDisplay(button, "/10"))})
    divTenTimeModifierValue.assignClicked(()=>{divTenTimeModifierValueClicked()})
    menus.barMenu.buttons.push(divTenTimeModifierValue)
    //pauses / starts the simulation
    pauseStartButton = new Button(10+width/8+width/32+width/20, height/8*7, width/16, width/16)
    pauseStartButton.assignDisplay((button)=>{pauseStartButtonDisplay(button)})
    pauseStartButton.assignClicked(()=>{paused = paused ? false : true})
    menus.barMenu.buttons.push(pauseStartButton)
    //clears all balls within the simulation aka makes the balls array blank
    clearAllBallsButton = new Button(width/8*7, height/8*7, width/8, height/32)
    clearAllBallsButton.assignDisplay((button)=>{(clickButtonDisplay(button, "Clear ALL Balls"))})
    clearAllBallsButton.assignClicked(()=>{balls = []})
    menus.barMenu.buttons.push(clearAllBallsButton)
    //shows/hides arrows which show the direction and magnitude of the balls acceleration and velocity
    toggleVectors = new Button(width/4*3, height/8*7, width/8, height/16)
    toggleVectors.assignDisplay((button)=>{toggleVectorsDisplay(button, "Show Vectors")})
    toggleVectors.assignClicked(()=>{
        showVector = showVector == false ? true : false
    })
    menus.barMenu.buttons.push(toggleVectors)
    //opens the tutorial menu
    openTutorialMenu = new Button(width/8*7, height-height/32, width/8, height/32)
    openTutorialMenu.assignDisplay((button)=>{clickButtonDisplay(button, "Show Tutorial")})
    openTutorialMenu.assignClicked(()=>{menus.tutorialMenu.attemptOpen()})
    menus.barMenu.buttons.push(openTutorialMenu)

    //makes inputs 
    seedInput = createInput();
    seedInput.attribute('type', 'number');
    spawnMassInput = createInput()
    spawnMassInput.attribute('type', 'number')
    push();
    //sizes and positions inputs
    seedInput.position(width/4+width/32, height/30*29)
    seedInput.size(width/2-width/4-width/32, height/40)
    spawnMassInput.position(width/2+width/64, height/8*7+5+width/80*2)
    spawnMassInput.size(width/8+width/32, height/40)
    pop()
    //inputs random seed and resets the simulation with the new seed
    seedInput.elt.addEventListener('keydown', (event) => {
        //does this when press enter and input is selected
        if (event.key === 'Enter') {
            //makes sure the seed is a whole number so the user can actually record it down and enter it again
            seed = floor(seedInput.value())
            //constrains the length because of space haha
            seed = constrain(seed, 0,9999999999)
            setupFunction()
        }
    })
    //changes the mass of the ball which is spawn when right click on simulation space
    menus.barMenu.buttons.push(seedInput)
    spawnMassInput.elt.addEventListener('keydown', (event) => {
        //does this when press enter and input is selected
        if(event.key === 'Enter'){
            //constrains and rounds the value to a whole number
            //no negative mass
            BALLMASS = constrain(floor(spawnMassInput.value()),1, Infinity)
        }
    })
    menus.barMenu.buttons.push(spawnMassInput)
}
function displayBarMenu(){
    //some display stuff
    push()
    fill(30);
    stroke(255);
    strokeWeight(1);
    textSize(width/50)
    textAlign(LEFT, TOP)
    //makes the rectangle to demarcate the menu
    rect(-10, (height / 8) * 7, width + 20, height / 8 + 10);
    fill(200)
    strokeWeight(1)
    noStroke()
    //shows how many updates are there per frame
    text("Time Step: " + timeMultiplier + "x", 10, height/8*7+10)
    //shows the seed 
    text("Seed: " + seed, width/4+width/32, height/8*7+10)
    textSize(width/80)
    //input instructions
    text("Input 10 digit Seed (Resets Simulation): ", width/4+width/32, height/8*7+height/16)
    //shows how big the ball is when you spawn it.
    text("Mass of spawned Ball: " + BALLMASS, width/2+width/64,height/8*7+5)
    text("Change spawned Ball mass: ", width/2+width/64, height/8*7+5+width/80)
    text("Ball Count: "+ balls.length, width/2+width/64, height-5-width/80)
    pop()
    textSize(width/80)
}

function timeMultiplierModifierClicked(){
    //adds the set value to the time multiplier
    timeMultiplier += timeMultiplierModifierValue;
}

function timeMultiplierModifierAction(){
    //makes the set value positive / negative based on where the buttons are active or not
    if (positiveTimeMultiplier.active && timeMultiplierModifierValue<0){
        timeMultiplierModifierValue*=-1
    }
    if (negativeTimeMultiplier.active && timeMultiplierModifierValue>0){
        timeMultiplierModifierValue*=-1
    }   
    //restricts the updates per frame and the set value so it isnt too laggy (it will be very laggy if it is set to 1 million and theres a lot of balls)
    timeMultiplierModifierValue = timeMultiplierModifierValue > 0 ? constrain(timeMultiplierModifierValue, 1, 100000) : constrain(timeMultiplierModifierValue, -100000, -1)
    timeMultiplier = constrain(timeMultiplier, 0,100000)
    //makes sure the updates per frame are a whole number (cant have a half update)
    timeMultiplier =  round(timeMultiplier, 0)
}

function multTenTimeModifierValueClicked(){
    //multiplies the set value by ten
    timeMultiplierModifierValue*=10
}

function divTenTimeModifierValueClicked(){
    //divides the set value by ten
    timeMultiplierModifierValue/=10
}
function pauseStartButtonDisplay(button){
    //display for the pause / start button
    push()
    if (paused){
        //red with 2 rectangles when paused
        fill(230, 0, 0)
        rect(button.x, button.y, button.w, button.h)
        fill(150, 0, 0)
        rect(button.x + button.w/3-button.w/8, button.y + button.h/6, button.w/4, button.h/6*4)
        rect(button.x + button.w/3*2-button.w/8, button.y + button.h/6, button.w/4, button.h/6*4)
    }else{
        //green with a triangle when started 
        fill(0, 230, 0)
        rect(button.x, button.y, button.w, button.h)
        fill(0, 150, 0)
        triangle(button.x + button.w/3-button.w/8, button.y+button.h/6, button.x + button.w/3-button.w/8, button.y+button.h/6*5, button.x + button.w/3*2-button.w/8+button.w/4, button.y+button.h/2)
    }
    pop()
}

function toggleVectorsDisplay(button, string){
    //this button uses showVector as a replacement for the active variable 
  push();
  stroke(200)
  let buttonColour = showVector ? 200 : 60
  fill(color(buttonColour));
  rect(button.x, button.y , button.w, button.h);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize();
  let wordColour = showVector ? 60 : 200
  fill(color(wordColour));
  text(string, button.x+button.w/2, button.y+button.h/2);
  pop();
}