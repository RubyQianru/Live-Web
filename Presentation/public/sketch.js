let bubbleA, bubbleB;
let radiusA = 20, radiusB = 20;
let engine;

let socket = io.connect()

socket.on('connect', function() {
  console.log("Connected")
})

function setup() {
    createCanvas(windowWidth, windowHeight);
    bubbleA = new Bubble(width/2, height - radiusA, radiusA, color(159, 163, 227));
    bubbleB = new Bubble(width/4, height - radiusB, radiusB, color(201, 147, 212));
}

function draw() {
    background(225);
    checkCollisions([bubbleA, bubbleB]); 
    noStroke();

    bubbleA.update();
    bubbleB.update();
    bubbleA.show();
    bubbleB.show();
}

socket.on('voteUpdate', (option) => {
    if (option == 'optionA') {
        bubbleA.radius += 5;
        bubbleA.vel.y -= 0.01;
    } else if (option == 'optionB') {
        bubbleB.radius += 5;
        bubbleB.vel.y -= 0.01;

    }
});


function checkCollisions(bubbles) {
    for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
            let dx = bubbles[i].x - bubbles[j].x;
            let dy = bubbles[i].y - bubbles[j].y;
            let distance = sqrt(dx * dx + dy * dy);
            if (distance < bubbles[i].radius + bubbles[j].radius) {
                bubbles[i].bounce(bubbles[j]);
            }
        }
    }
}

