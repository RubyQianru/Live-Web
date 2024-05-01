let canvas;
let container;
let stage;
let captureContainers;
let captureIndex;

function animationInit() {
    canvas = document.getElementById("animation");
    stage = new createjs.Stage(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let w = canvas.width;
    let h = canvas.height;

    container = new createjs.Container();
    stage.addChild(container);

    captureContainers = [];
    captureIndex = 0;

    for (let i = 0; i < 100; i++) {
        let heart = new createjs.Shape();
        heart.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30));
        heart.graphics.moveTo(0, -12).curveTo(1, -20, 8, -20).curveTo(16, -20, 16, -10).curveTo(16, 0, 0, 12);
        heart.graphics.curveTo(-16, 0, -16, -10).curveTo(-16, -20, -8, -20).curveTo(-1, -20, 0, -12);
        heart.y = -100;

        container.addChild(heart);
    }

    for (let i = 0; i < 100; i++) {
        let captureContainer = new createjs.Container();
        captureContainer.cache(0, 0, w, h);
        captureContainers.push(captureContainer);
      }
    
      // start the tick and point it at the window so we can do some work before updating the stage:
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", tick);

    setTimeout(clearCanvas, 3000);

}  

function clearCanvas() {
    createjs.Ticker.off("tick", tick);
    stage.removeAllChildren();
    stage.update();
    canvas.style.display = "none";
}

function tick(event) {
    let w = canvas.width;
    let h = canvas.height;
    let l = container.numChildren;
  
    captureIndex = (captureIndex + 1) % captureContainers.length;
    stage.removeChildAt(0);
    let captureContainer = captureContainers[captureIndex];
    stage.addChildAt(captureContainer, 0);
    captureContainer.addChild(container);
  
    // iterate through all the children and move them according to their velocity:
    for (let i = 0; i < l; i++) {
        let heart = container.getChildAt(i);
        if (heart.y < -50) {
            heart._x = Math.random() * w;
            heart.y = h * (1 + Math.random()) + 50;
            heart.perX = (1 + Math.random() * 2) * h;
            heart.offX = Math.random() * h;
            heart.ampX = heart.perX * 0.1 * (0.15 + Math.random());
            heart.velY = -Math.random() * 2 - 1;
            heart.scale = Math.random() * 2 + 1;
            heart._rotation = Math.random() * 40 - 20;
            heart.alpha = Math.random() * 0.75 + 0.05;
            heart.compositeOperation = Math.random() < 0.33 ? "lighter" : "source-over";
        }
        let int = (heart.offX + heart.y) / heart.perX * Math.PI * 2;
        heart.y += heart.velY * heart.scaleX / 2;
        heart.x = heart._x + Math.cos(int) * heart.ampX;
        heart.rotation = heart._rotation + Math.sin(int) * 30;
    }
  
    captureContainer.updateCache("source-over");
  
    stage.update(event);
  }
