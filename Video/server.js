var http = require('http'); // Change to use http instead of https
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.send("Hello World!");
});

var httpServer = http.createServer(app); // Change to use http instead of https
var port = 3000; // Change the port number to your desired port

httpServer.listen(port, function() {
    console.log('Server is running at http://localhost:' + port);
});

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(httpServer);

const userIds = [
    "AppleHarmony", "BerryWhisperer", "CherryDreamer", "GrapeExplorer", "KiwiJourney",
    "MangoMelody", "OrangeSunset", "PineappleBreeze", "StrawberrySerene", "WatermelonWanderer",
    "BananaBliss", "BlueberryBlaze", "CoconutCraze", "DragonfruitDancer", "FigFantasy",
    "GuavaGlimmer", "LemonLullaby", "LimeLagoon", "PassionfruitPrelude", "PeachPonder",
    "PearPebble", "PlumPilgrim", "RaspberryRipple", "StarfruitSerenade", "TangerineTranquil",
    "UmbuCalm", "VanillaVista", "ZestZenith"
]
const user = []
let ptr = 0

io.sockets.on('connection',
    function (socket) {
        console.log("We have a new client: " + socket.id);

        const id = userIds[ptr]
        console.log("The new client: " + id)
        ptr += 1

        io.emit('connection', id)

        socket.on('video', function(data){
            socket.broadcast.emit('video', data)
        })

        socket.on('heart', function(){
            io.emit('heart')
        })

        socket.on('raise', function(){
            io.emit('raise')
        })

        socket.on('yay', function(){
            io.emit('yay')
        })

		socket.on('thumb', function(){
            io.emit('thumb')
        })

        socket.on('disconnect', function() {
            console.log("Client has disconnected " + socket.id);
        });
    }
);
