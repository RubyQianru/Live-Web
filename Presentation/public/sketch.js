let bubbleA, bubbleB;
let velocityA, velocityB;
let radiusA = 20, radiusB = 20;
let engine;
let bubblesReady = false;

let p5socket = io.connect()

p5socket.on('loadHistory', (votes) => {
    votes.forEach(entry => {
        if (entry.option === 'optionA') {
            radiusA = entry.count*5+20;
            velocityA = entry.count*1.5;
        } else if (entry.option === 'optionB') {
            radiusB = entry.count*5+20;
            velocityB = entry.count*1.5;
        }
    });

    bubbleA = new Bubble(width / 2, height - radiusA, radiusA, color(255, 149, 81), velocityA);
    bubbleB = new Bubble(width / 4, height - radiusB, radiusB, color(95,157,247), velocityB);
    bubblesReady = true; 
});

function setup() {
    createCanvas(windowWidth, windowHeight);

}

function draw() {
    if (!bubblesReady) return;

    background(225);
    checkCollisions([bubbleA, bubbleB]); 
    noStroke();

    bubbleA.update();
    checkOffBountry(bubbleA);

    bubbleB.update();
    checkOffBountry(bubbleB);

    bubbleA.show();
    bubbleB.show();
}

p5socket.on('voteUpdate', (option) => {
    if (option == 'optionA') {
        bubbleA.radius += 5;
        bubbleA.vel.y += 1.5;
        checkOffBountry(bubbleA);
    } else if (option == 'optionB') {
        bubbleB.radius += 5;
        bubbleB.vel.y += 1.5;
        checkOffBountry(bubbleB);
    }
});

function checkOffBountry(bubble) {
    if (bubble.x > width - bubble.radius ) {
        bubble.x = width - bubble.radius;
    }
    if (bubble.x < bubble.radius) {
        bubble.x = bubble.radius;
    }
    if (bubble.y > height - bubble.radius) {
        bubble.y = height - bubble.radius
    } if (bubble.y < bubble.radius) {
        bubble.y = bubble.radius
    }
}

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

