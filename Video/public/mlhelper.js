let socket = io.connect()

const URL = "https://teachablemachine.withgoogle.com/models/_sKU0E-Yh/"
let model,  maxPredictions
let heartToggle = false
let raiseToggle = false
let clapToggle = false 

const heart = document.getElementById('heart')
const raiseHand = document.getElementById('raiseHand')
const clap = document.getElementById('clap')

async function predict(target) {
    const prediction = await model.predict(target)
    if (prediction[0].probability >= 0.95 && heartToggle == false ) {
      socket.emit('heart')
    }

    else if (prediction[1].probability >= 0.95 && raiseToggle == false ) {
      socket.emit('raise')
    }

    else if (prediction[2].probability >= 0.95 && raiseToggle == false ) {
      socket.emit('clap')
    }
  }

  socket.on('heart', function(){
    sendSymbol(heart)
    symbolToggle(heartToggle)
  })

  socket.on('raise', function(){
    sendSymbol(raiseHand)
    symbolToggle(raiseToggle)
  })

  socket.on('clap', function(){
    sendSymbol(clap)
    symbolToggle(clapToggle)
  })

  function sendSymbol(symbol) {
    symbol.className = 'visible'

    setTimeout(() => {
      symbol.classList.remove('visible')
    }, 2000);    
    
  }        

  function symbolToggle(toggle) {
    toggle = true
    setTimeout(() => {
        toggle = false
      }, 2001)
  }

  async function init() {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      model = await tmImage.load(modelURL, metadataURL);
      maxPredictions = model.getTotalClasses();
  }
