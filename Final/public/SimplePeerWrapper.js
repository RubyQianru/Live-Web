class SimplePeerWrapper {

    constructor(initiator, socket_id, socket, stream) {
       this.simplepeer = new SimplePeer({
           initiator: initiator,
           trickle: false
       });				

       // Their socket id, our unique id for them
       this.socket_id = socket_id;
       this.socket = socket;

       // Our video stream - need getters and setters for this
       this.stream = stream;

       // simplepeer generates signals which need to be sent across socket
       this.simplepeer.on('signal', data => {						
           this.socket.emit('signal', this.socket_id, this.socket.id, data);
       });

       // When we have a connection, send our stream
       this.simplepeer.on('connect', () => {

           //p.send('whatever' + Math.random())

           // Let's give them our stream
           this.simplepeer.addStream(stream);
       });

       // Stream coming in to us
       this.simplepeer.on('stream', stream => {

           // This should really be a callback
           // Create a video object
           let ovideo = document.createElement("VIDEO");
           const videos = document.getElementById('videos')
           ovideo.style.width = "200px"
           ovideo.style.height = "150px"
           ovideo.style.margin = "5px"
           ovideo.id = this.socket_id;
           ovideo.srcObject = stream;
           ovideo.muted = true;
           ovideo.onloadedmetadata = function(e) {
               ovideo.play();
           };		
           videos.appendChild(ovideo);
           ovideo.addEventListener("click", function(e) {
                console.log("clicked!")
                const video = e.target;
                if (!document.fullscreenElement) {
                    video.requestFullscreen().catch(err => {
                        console.error(`Failed to enable fullscreen: ${err.message}`);
                    });
                } else if (document.fullscreenElement === video) {
                    document.exitFullscreen().catch(err => {
                        console.error(`Failed to exit fullscreen: ${err.message}`);
                    });
                }
           });
       });		
       
       this.simplepeer.on('close', () => {
           console.log('Got close event');
           // Should probably remove from the array of simplepeers
       });

       this.simplepeer.on('error', (err) => {
           console.log(err);
       });
   }

   inputsignal(sig) {
       this.simplepeer.signal(sig);
   }

}	


