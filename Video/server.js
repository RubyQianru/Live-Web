var https = require('https');
var fs = require('fs'); // Using the filesystem module

var credentials = { 
key: fs.readFileSync('/etc/letsencrypt/live/qz2432.itp.io/privkey.pem'), 
cert: fs.readFileSync('/etc/letsencrypt/live/qz2432.itp.io/cert.pem') 
};

// Express Code
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.send("Hello World!");
});

var httpsServer = https.createServer(credentials, app);
// Default HTTPS Port 443
httpsServer.listen(443);

// WebSocket Portion
// WebSockets work with the HTTPS server
var io = require('socket.io')(httpsServer);

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
	// We are given a websocket object in our function
	function (socket) {
		console.log("We have a new client: " + socket.id);
		const id = userIds[ptr]
		console.log("The new client: " + id)
		ptr += 1

		io.emit('connection', id)

		socket.on('video', function(data){
			socket.broadcast.emit('video', data)
		})
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);


