function setupBarMenu(){
    menus.barMenu = new Menu(-10, (height / 8) * 7, width + 20, height / 8 + 10, 3);
    menus.barMenu.open = true;


}
function displayBarMenu(){
    fill(30);
    stroke(255);
    strokeWeight(1);
    rect(-10, (height / 8) * 7, width + 20, height / 8 + 10);
}