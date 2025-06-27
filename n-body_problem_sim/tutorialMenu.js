let tutorialPanels = []
let currentPanel = 0;
let previousPanel;
let nextPanel;
let exitTutorialMenu;
function preload(){
    for (let i = 0; i < 4; i++){
        tutorialPanels[i] = loadImage(`/assets/${i+1}.png`)
    }
    //console.log(tutorialPanels)
}

function setupTutorialMenu(){
    menus.tutorialMenu = new Menu (0,0,width,height, 10)
    menus.tutorialMenu.assignDisplay(displayTutorialMenu)
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
    menus.tutorialMenu.attemptOpen()
    exitTutorialMenu = new Button(width-25, 5, 20, 20);
    exitTutorialMenu.assignDisplay((button)=>{ballMenuExitDisplay(button)});
    exitTutorialMenu.assignClicked(()=>{
    //selectedBall = undefined;
        menus.tutorialMenu.attemptClose();
    });
    menus.tutorialMenu.buttons.push(exitTutorialMenu)
    previousPanel = new Button(0, height/16*15, width/4, height/16)
    previousPanel.assignDisplay((button)=>{clickButtonDisplay(button, "Previous")})
    previousPanel.assignClicked(()=>{
        currentPanel-=1
        currentPanel = constrain(currentPanel, 0, tutorialPanels.length)
    })
    previousPanel.action = ()=>{
        console.log(currentPanel)
        if(currentPanel == 0||!menus.tutorialMenu.open){
            previousPanel.hide()
        }else{
            previousPanel.show()
        }
    }
    menus.tutorialMenu.buttons.push(previousPanel)
    nextPanel = new Button(width-width/4, height/16*15, width/4, height/16)
    nextPanel.assignDisplay((button)=>{clickButtonDisplay(button, "Next")})
    nextPanel.assignClicked(()=>{
        currentPanel+=1
        currentPanel = constrain(currentPanel, 0, tutorialPanels.length)
    })
    nextPanel.action = ()=>{
        if(currentPanel == tutorialPanels.length-1||!menus.tutorialMenu.open){
            nextPanel.hide()
        }else{
            nextPanel.show()
        }   
    }
    menus.tutorialMenu.buttons.push(nextPanel)
    for (let i = 0; i < tutorialPanels.length; i++){
        tutorialPanels[i].resize(0, height/8*7)
    }
}

function displayTutorialMenu(){
    fill(0)
    rect(-10, -10, width+20, height+20)
    let panel = tutorialPanels[currentPanel]
    //console.log(panel)
    image(panel,width/2-panel.width/2, height/2-panel.height/2)
    textSize(height/20)
}