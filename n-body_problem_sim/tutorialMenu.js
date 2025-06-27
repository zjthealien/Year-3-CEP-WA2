//stores images for tutorial menu
let tutorialPanels = []
//records the current panel
let currentPanel = 0;
//variables for buttons (only three this time yay)
let previousPanel;
let nextPanel;
let exitTutorialMenu;
//preloads all images into p5.Image objects for use 
function preload(){
    for (let i = 0; i < 4; i++){
        //conveniently enough the images' names are just numbers (made in Canva)
        tutorialPanels[i] = loadImage(`/assets/${i+1}.png`)
    }
}
//sets up tutorial menu
function setupTutorialMenu(){
    menus.tutorialMenu = new Menu (0,0,width,height, 10)
    menus.tutorialMenu.assignDisplay(displayTutorialMenu)
    //essentially disables all functionality and reenables it when tutorial menu is open or closed respectively 
    //by closing gamemenu and bar menu / reopening them
    menus.tutorialMenu.attemptOpen = () => {
        console.log('attempt open')
        if (menus.tutorialMenu.open == false){
            menus.tutorialMenu.open = true;
        }
        for (let i = 0; i < menus.tutorialMenu.buttons.length; i++){
            menus.tutorialMenu.buttons[i].show();
        }
        menus.gameMenu.attemptClose()
        menus.barMenu.attemptClose()
    }
    menus.tutorialMenu.attemptClose = () => {
        console.log('attmept close')
        if (menus.tutorialMenu.open == true){
            menus.tutorialMenu.open = false;
        }
        for (let i = 0; i < menus.tutorialMenu.buttons.length; i++){
            menus.tutorialMenu.buttons[i].hide();
            if (menus.tutorialMenu.buttons[i].active){
                menus.tutorialMenu.buttons[i].active = false;
            }
        }
        menus.gameMenu.attemptOpen()
        menus.barMenu.attemptOpen()
    }
    //opens tutorial menu to shove it into the player's face before they go wandering off confused
    menus.tutorialMenu.attemptOpen()
    //exits the tutorial menu by using the previously made close function
    exitTutorialMenu = new Button(width-25, 5, 20, 20);
    exitTutorialMenu.assignDisplay((button)=>{ballMenuExitDisplay(button)});
    exitTutorialMenu.assignClicked(()=>{
    //selectedBall = undefined;
        menus.tutorialMenu.attemptClose();
    });
    menus.tutorialMenu.buttons.push(exitTutorialMenu)
    //goes back to the previous panel in the tutorial 
    previousPanel = new Button(0, height/16*15, width/4, height/16)
    previousPanel.assignDisplay((button)=>{clickButtonDisplay(button, "Previous")})
    previousPanel.assignClicked(()=>{
        currentPanel-=1
        //constrains currentPanel's value to prevent it from getting an undefined value
        currentPanel = constrain(currentPanel, 0, tutorialPanels.length)
    })
    previousPanel.action = ()=>{
        console.log(currentPanel)
        //hides the button if the panel is the first one
        if(currentPanel == 0||!menus.tutorialMenu.open){
            previousPanel.hide()
        }else{
            previousPanel.show()
        }
    }
    menus.tutorialMenu.buttons.push(previousPanel)
    //goes to the next panel in the tutorial
    nextPanel = new Button(width-width/4, height/16*15, width/4, height/16)
    nextPanel.assignDisplay((button)=>{clickButtonDisplay(button, "Next")})
    nextPanel.assignClicked(()=>{
        currentPanel+=1
        //constrains currentPanel's value to prevent it from getting an undefined value
        currentPanel = constrain(currentPanel, 0, tutorialPanels.length)
    })
    nextPanel.action = ()=>{
        //hides the button if the panel is the last one
        if(currentPanel == tutorialPanels.length-1||!menus.tutorialMenu.open){
            nextPanel.hide()
        }else{
            nextPanel.show()
        }   
    }
    menus.tutorialMenu.buttons.push(nextPanel)
    //makes the tutorial panels smaller so they fit into the screen (hopefully)
    for (let i = 0; i < tutorialPanels.length; i++){
        tutorialPanels[i].resize(0, height/8*7)
    }
}

function displayTutorialMenu(){
    fill(0)
    rect(-10, -10, width+20, height+20)
    let panel = tutorialPanels[currentPanel]
    //displays current panel thingy
    image(panel,width/2-panel.width/2, height/2-panel.height/2)
    textSize(height/20)
    //shows what panel number user is on
    push()
    textAlign(CENTER, CENTER)
    fill(200)
    noStroke()
    text((currentPanel+1)+"/"+tutorialPanels.length, width/2, height/32*31)
    pop()
}