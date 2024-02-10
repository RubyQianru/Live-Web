let express = require('express');
let app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!')
});

var http = require('http');
var httpServer = http.createServer(app);
httpServer.listen(80);

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(httpServer);

io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
		console.log("We have a new client: " + socket.id);
		
		//draw socket
		socket.on('draw', function(data) {
			console.log("draw: " + data)
			io.emit('draw', data)
		});

		//prompt socket
		socket.on('prompt', function(data) {
			console.log("prompt: " + data)
			io.emit('prompt', data)
		})

		//clear canvas socket
		socket.on('clearCanvas', function(){
			console.log("clearCanvas")
			io.emit('clearCanvas')
		})

		//score socket
		socket.on('score', function(data){
			console.log("score", data)
			io.emit('score', data)
		})
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);


