let socket
let simplepeers = []
let socketId

function getSocketId() {
    return socketId
}

function setupSocket() {
    socket = io.connect();
    
    socket.on('connect', function() {
        console.log("Socket Connected");
        console.log("My socket id: ", socket.id);
        socketId = socket.id
        socket.emit('list');
    });

    socket.on('disconnect', function(data) {
        console.log("Socket disconnected");
    });

    socket.on('peer_disconnect', function(data) {
        console.log("simplepeer has disconnected " + data);
        for (let i = 0; i < simplepeers.length; i++) {
            if (simplepeers[i].socket_id == data) {
                console.log("Removing simplepeer: " + i);
                simplepeers.splice(i,1);
                // Should also remove video from page
                document.getElementById(data).remove();
            } 
        }			
    });			

    socket.on('listresults', function (data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            if (data[i] != socket.id) {	

                let simplepeer = new SimplePeerWrapper(
                    true, data[i], socket, mystream
                );

                simplepeers.push(simplepeer);	
            }
        }
    });
    
    socket.on('signal', function(to, from, data) {
    
        console.log("Got a signal from the server: ", to, from, data);

        if (to != socket.id) {
            console.log("Socket IDs don't match");
        }
    
        let found = false;
        for (let i = 0; i < simplepeers.length; i++) {
            
            if (simplepeers[i].socket_id == from) {
                console.log("Found right object");
                // Give that simplepeer the signal
                simplepeers[i].inputsignal(data);
                found = true;
                break;
            }
        
        }	
        if (!found) {
            console.log("Never found right simplepeer object");
            let simplepeer = new SimplePeerWrapper(
                false, from, socket, mystream
            );
            
            simplepeers.push(simplepeer);	
            simplepeer.inputsignal(data);
        }
    });

}

