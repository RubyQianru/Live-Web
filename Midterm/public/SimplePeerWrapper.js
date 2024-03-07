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
           console.log('CONNECT')
           console.log(this.simplepeer);
           //p.send('whatever' + Math.random())

           // Let's give them our stream
           this.simplepeer.addStream(stream);
           console.log("Send our stream");
       });

       // Stream coming in to us
       this.simplepeer.on('stream', stream => {
           console.log('Incoming Stream');

           // This should really be a callback
           // Create a video object
           let ovideo = document.createElement("VIDEO");
           ovideo.id = this.socket_id;
           ovideo.srcObject = stream;
           ovideo.muted = true;
           ovideo.onloadedmetadata = function(e) {
               ovideo.play();
           };					
           document.body.appendChild(ovideo);
           console.log(ovideo);
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