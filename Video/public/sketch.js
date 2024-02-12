let classifier
let labelSpan
let confidenceSpan
let clearButton
let promptTitle
let canvas
let feedback

// prompts 
let items = ["hand", "rabbit", "mouse", "strawberry", "mouth", "snake", "cookie", "cat"]
let prompt

//socket communication
let socket = io.connect()

socket.on('connect', function() {
  console.log("Connected")
})

function preload() {
  classifier = ml5.imageClassifier('DoodleNet');
}

function setup() {
  canvas =  createCanvas(300, 300)
  background(255);
  classifier.classify(canvas, gotResult);

  clearButton = select("#clearBtn")
  clearButton.mousePressed(clearCanvas);

  labelSpan = select("#label")
  confidenceSpan = select("#confidence")

  promptTitle = select('#promptTitle')
  promptInit()

  feedback = select('#feedback')

  scoreSpan = select('#score')
}

//handle draw on canvas
socket.on("draw", function(data){
  strokeWeight(16)
  stroke(0)
  line(data.x, data.y, data.prevX, data.prevY)
})

function draw() {
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2)
  strokeWeight(16)
  stroke(0)
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY)
    socket.emit("draw", { x: mouseX, y: mouseY, prevX: pmouseX, prevY: pmouseY })
  }

  if (select('#feedback') !== "" && !mouseIsPressed) {
    feedback.html("")
  }

}

//handle clear canvas
socket.on("clearCanvas", function() {
  background(255)
})

function clearCanvas() {
  background(255)
  socket.emit("clearCanvas")
}

//handle prompt
function promptInit() {
  prompt = random(items)
  socket.emit("prompt", prompt)
}

socket.on("prompt", function(data){
  promptTitle.html("Draw a " + data)
})

//handle score
// score
let score = 0

function updatetScore() {
  score += 1
  socket.emit("score", score)
}

// function feedbackWin() {
//   push() 
//   noStroke()
//   textSize(32)
//   textAlign(CENTER, CENTER)
//   text("You did it!", width/2, height/2) 
//   pop()
// }

socket.on("score", function(data){
  scoreSpan.html(data)
  feedback.html("You did it!")
})

// ml5 results
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  labelSpan.html("Is it a " + results[0].label + "?");

  if (results[0].label == prompt){
    promptInit()
    updatetScore()
    clearCanvas()
  }

  classifier.classify(canvas, gotResult);
}


