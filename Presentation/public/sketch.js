let bubbleA, bubbleB;
let radiusA = 50, radiusB = 50;
let engine;


// socket communication
// let socket = io.connect()

// socket.on('connect', function() {
//   console.log("Connected")
// })

// physics engine
const { Engine, Bodies, Composite, Body, Vector, Render } = Matter;

function setup() {
    let canvas =  createCanvas(600, 600);


    // physics engine handler
    engine = Engine.create();

    let render = Render.create({
      canvas: canvas.elt,
      engine,
      options: { width: width, height: height },
    });

    Render.run(render);
    
    bubbleA = new Bubble(width/4, height/4, color(159, 163, 227));
    bubbleB = new Bubble(width/4, height/4, color(201, 147, 212));

    Composite.add(engine.world, [bubbleA.body, bubbleB.body]);

    let ground = Bodies.rectangle(width / 2, height / 2-20, width, 10, {
        isStatic: true,
    });

    Composite.add(engine.world, ground);

    let runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
}

function draw() {

    Engine.update(engine);
    bubbleA.show();
    bubbleB.show();

}

socket.on('voteUpdate', (option) => {
    if (option == 'optionA') {
        bubbleA.r += 10;
        bubbleA.show();
    } else if (option == 'optionB') {
        bubbleB.r += 10;
        bubbleB.r += 10;
    }
});

