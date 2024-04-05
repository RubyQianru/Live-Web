// We need the file system here
var fs = require('fs');
				
// Express is a node module for building HTTP servers
var express = require('express');
var app = express();

// Tell Express to look in the "public" folder for any files first
app.use(express.static('public'));

// If the user just goes to the "route" / then run this function
app.get('/', function (req, res) {
  res.send('Hello World!')
});

// Here is the actual HTTP server 
// In this case, HTTPS (secure) server
var https = require('https');

// Security options - key and certificate
var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/qz2432.itp.io/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/qz2432.itp.io/cert.pem')
};

// We pass in the Express object and the options object
var httpServer = https.createServer(options, app);

// Default HTTPS port
httpServer.listen(443);

/* 
This server simply keeps track of the peers all in one big "room"
and relays signal messages back and forth.
*/

let count = 0;

// WebSocket Portion
// WebSockets work with the HTTP server
// Using Socket.io
const { Server } = require('socket.io');
const io = new Server(httpServer, {});

const Datastore = require('nedb');
const db = new Datastore({ filename: 'data.db', autoload: true });

// Old version of Socket.io
//var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 

	// We are given a websocket object in our function
	function (socket) {
		console.log("We have a new client: " + socket.id);

        db.find({}, (err, votes) => {
            if (err) {
                console.error(err);
                return;
            }
            socket.emit("loadHistory", votes);
        });

    
        socket.on('vote', (option) => {
            db.findOne({ option }, (err, existingEntry) => {
                if (err) {
                    console.error(err);
                    return;
                }
        
                if (existingEntry) {
                    db.remove({ _id: existingEntry._id }, {}, (err, numRemoved) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        
                        db.insert({ name: "Q1", option, count: existingEntry.count + 1 }, (err, newDocs) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            io.emit('voteUpdate', option);
                        });
                    });
                } else {
                    db.insert({ name: "Q1", option, count: 1 }, (err, newDocs) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        io.emit('voteUpdate', option);
                    });
                }
            });
        });
        
    
        socket.on('disconnect', () => {
            console.log('A client disconnected');
        });
});