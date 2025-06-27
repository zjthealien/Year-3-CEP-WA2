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
    menus.barMenu = new Menu(-10, (height / 8) * 7, width + 20, height / 8 + 10, 3);
    menus.barMenu.open = true;
    menus.barMenu.assignDisplay(displayBarMenu);
    timeMultiplierModifier = new Button(10, height/8*7+height/16, width/8, height/16-10);
    timeMultiplierModifier.assignDisplay((button)=>{
        let posNegSign = timeMultiplierModifierValue>0? "+" : ""
        clickButtonDisplay(button, posNegSign + timeMultiplierModifierValue+"x")
    });
    timeMultiplierModifier.assignClicked(()=>{timeMultiplierModifierClicked()});
    timeMultiplierModifier.assignAction(()=>{timeMultiplierModifierAction()})
    menus.barMenu.buttons.push(timeMultiplierModifier)
    positiveTimeMultiplier = new Button(10+width/8, height/8*7+height/16, width/32, height/32-5)
    positiveTimeMultiplier.assignDisplay((button)=>{toggleButtonDisplay(button, "+")})
    positiveTimeMultiplier.assignClicked((button)=>{toggleButtonClicked(button)})
    positiveTimeMultiplier.active = false
    menus.barMenu.buttons.push(positiveTimeMultiplier)
    negativeTimeMultiplier = new Button(10+width/8, height/8*7+height/16+height/32-5, width/32, height/32-5)
    negativeTimeMultiplier.assignDisplay((button)=>{toggleButtonDisplay(button, "-")})
    negativeTimeMultiplier.assignClicked((button)=>{toggleButtonClicked(button)})
    negativeTimeMultiplier.active = false
    menus.barMenu.buttons.push(negativeTimeMultiplier);
    multTenTimeModifierValue = new Button(10+width/8+width/32, height/8*7+height/16, width/20-10, height/32-5)
    multTenTimeModifierValue.assignDisplay((button)=>{(clickButtonDisplay(button, "x10"))})
    multTenTimeModifierValue.assignClicked(()=>{multTenTimeModifierValueClicked()})
    menus.barMenu.buttons.push(multTenTimeModifierValue)
    divTenTimeModifierValue = new Button(10+width/8+width/32, height/8*7+height/16+height/32-5, width/20-10, height/32-5)
    divTenTimeModifierValue.assignDisplay((button)=>{(clickButtonDisplay(button, "/10"))})
    divTenTimeModifierValue.assignClicked(()=>{divTenTimeModifierValueClicked()})
    menus.barMenu.buttons.push(divTenTimeModifierValue)
    pauseStartButton = new Button(10+width/8+width/32+width/20, height/8*7, width/16, width/16)
    pauseStartButton.assignDisplay((button)=>{pauseStartButtonDisplay(button)})
    pauseStartButton.assignClicked(()=>{paused = paused ? false : true})
    menus.barMenu.buttons.push(pauseStartButton)
    clearAllBallsButton = new Button(width/8*7, height/8*7, width/8, height/32)
    clearAllBallsButton.assignDisplay((button)=>{(clickButtonDisplay(button, "Clear ALL Balls"))})
    clearAllBallsButton.assignClicked(()=>{balls = []})
    menus.barMenu.buttons.push(clearAllBallsButton)
    toggleVectors = new Button(width/4*3, height/8*7, width/8, height/16)
    toggleVectors.assignDisplay((button)=>{toggleVectorsDisplay(button, "Show Vectors")})
    toggleVectors.assignClicked(()=>{
        showVector = showVector == false ? true : false
    })
    menus.barMenu.buttons.push(toggleVectors)

    openTutorialMenu = new Button(width/8*7, height-height/32, width/8, height/32)
    openTutorialMenu.assignDisplay((button)=>{clickButtonDisplay(button, "Show Tutorial")})
    openTutorialMenu.assignClicked(()=>{menus.tutorialMenu.attemptOpen()})
    menus.barMenu.buttons.push(openTutorialMenu)


    seedInput = createInput();
    seedInput.attribute('type', 'number');
    spawnMassInput = createInput()
    spawnMassInput.attribute('type', 'number')
    push();
    seedInput.position(width/4+width/32, height/30*29)
    seedInput.size(width/2-width/4-width/32, height/40)
    spawnMassInput.position(width/2+width/64, height/8*7+5+width/80*2)
    spawnMassInput.size(width/8+width/32, height/40)
    pop()
    seedInput.elt.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            seed = floor(seedInput.value())
            seed = constrain(seed, 0,9999999999)
            setupFunction()
        }
    })
    menus.barMenu.buttons.push(seedInput)
    spawnMassInput.elt.addEventListener('keydown', (event) => {
        if(event.key === 'Enter'){
            BALLMASS = constrain(floor(spawnMassInput.value()),1, 1000000000)
        }
    })
    menus.barMenu.buttons.push(spawnMassInput)
}
function displayBarMenu(){
    push()
    fill(30);
    stroke(255);
    strokeWeight(1);
    textSize(width/50)
    textAlign(LEFT, TOP)
    rect(-10, (height / 8) * 7, width + 20, height / 8 + 10);
    fill(200)
    strokeWeight(1)
    noStroke()
    text("Time Step: " + timeMultiplier + "x", 10, height/8*7+10)
    text("Seed: " + seed, width/4+width/32, height/8*7+10)
    textSize(width/80)
    text("Input 10 digit Seed (Resets Simulation): ", width/4+width/32, height/8*7+height/16)
    text("Mass of spawned Ball: " + BALLMASS, width/2+width/64,height/8*7+5)
    text("Change spawned Ball mass: ", width/2+width/64, height/8*7+5+width/80)
    pop()
    textSize(width/80)
}

function timeMultiplierModifierClicked(){

    timeMultiplier += timeMultiplierModifierValue;
}

function timeMultiplierModifierAction(){
    if (positiveTimeMultiplier.active && timeMultiplierModifierValue<0){
        timeMultiplierModifierValue*=-1
    }
    if (negativeTimeMultiplier.active && timeMultiplierModifierValue>0){
        timeMultiplierModifierValue*=-1
    }
    timeMultiplierModifierValue = timeMultiplierModifierValue > 0 ? constrain(timeMultiplierModifierValue, 1, 100000) : constrain(timeMultiplierModifierValue, -100000, -1)
    timeMultiplier = constrain(timeMultiplier, 0,100000)
    if (timeMultiplier>1 && Number.isInteger(timeMultiplier)){
        timeMultiplier = round(timeMultiplier, 0)
    }
    timeMultiplier =  round(timeMultiplier, 0)
}

function multTenTimeModifierValueClicked(){
    timeMultiplierModifierValue*=10
}

function divTenTimeModifierValueClicked(){
    timeMultiplierModifierValue/=10
}
function pauseStartButtonDisplay(button){
    push()
    if (paused){
        fill(230, 0, 0)
        rect(button.x, button.y, button.w, button.h)
        fill(150, 0, 0)
        rect(button.x + button.w/3-button.w/8, button.y + button.h/6, button.w/4, button.h/6*4)
        rect(button.x + button.w/3*2-button.w/8, button.y + button.h/6, button.w/4, button.h/6*4)
    }else{
        fill(0, 230, 0)
        rect(button.x, button.y, button.w, button.h)
        fill(0, 150, 0)
        triangle(button.x + button.w/3-button.w/8, button.y+button.h/6, button.x + button.w/3-button.w/8, button.y+button.h/6*5, button.x + button.w/3*2-button.w/8+button.w/4, button.y+button.h/2)
    }
    pop()
}

function toggleVectorsDisplay(button, string){
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