function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.id('sub-canvas');
    background(250,250,250,0);
}

function draw(){
    clear();

    ellipse(mouseX, mouseY, 10, 10);
    
}

