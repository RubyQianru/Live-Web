let classifier
let labelSpan
let confidenceSpan
let clearButton
let problemTitle
let canvas

// problems 
let items = ["hand", "rabbit", "mouse", "strawberry", "mouth"]
let problem

// score
let score = 0

function preload() {
  classifier = ml5.imageClassifier('DoodleNet');
}

function setup() {
  canvas =  createCanvas(300, 300)
  background(255);
  classifier.classify(canvas, gotResult);

  clearButton = select("#clearBtn");
  clearButton.mousePressed(clearCanvas);

  labelSpan = select("#label");
  confidenceSpan = select("#confidence");

  problemTitle = select('#problemTitle')
  problemInit()

  scoreSpan = select('#score')

}

function clearCanvas() {
  background(255);
}

function draw() {
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2)

  strokeWeight(16);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function problemInit() {
  problem = random(items)
  problemTitle.html("Draw a " + problem)
}

function updatetScore() {
  score += 1
  scoreSpan.html(score)
}


function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  labelSpan.html("Is it a " + results[0].label + "?");
  // confidenceSpan.html(floor(100 * results[0].confidence));

  if (results[0].label == problem){
    problemInit()
    updatetScore()
    clearCanvas()
  }

  classifier.classify(canvas, gotResult);
}


