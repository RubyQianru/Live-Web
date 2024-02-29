let socket = io.connect()

let model, tfmodel,  prediction
let heartToggle = false
let raiseToggle = false
let yayToggle = false 
let thumbToggle = false

const heart = document.getElementById('heart')
const raiseHand = document.getElementById('raiseHand')
const yay = document.getElementById('yay')
const thumb = document.getElementById('thumb')

async function getResult(output) {
  let maxValue = Math.max(...output);
  let maxIndex = output.indexOf(maxValue);
  return maxIndex
}

async function predict(target) {
    const skeleton = await tfmodel.estimateHands(target)
    if (skeleton.length > 0) {
      const landmarks = skeleton[0].landmarks
      let inputs = [];
      for (let i = 0; i < landmarks.length; i++) {
        inputs.push(landmarks[i][0]);
        inputs.push(landmarks[i][1]);
        inputs.push(landmarks[i][2]);
      }

      const output = model.predict(tf.tensor(inputs, [1, 63]));
      console.log(output)
      const result = await output.array()
      console.log(result)
      const maxi = await getResult(result[0])
      console.log(maxi)

      if (maxi == 0 && heartToggle == false ) {
        socket.emit('heart')
      }else if (maxi == 1 && raiseToggle == false ) {
        socket.emit('raise')
      }else if (maxi == 2 && yayToggle == false) {
        socket.emit('yay')
      }else if (maxi == 3 && thumbToggle == false) {
        socket.emit('thumb')
      }
    }
  }
  socket.on('heart', handler(heart, heartToggle))
  socket.on('raise', handler(raiseHand, raiseToggle))
  socket.on('yay', handler(yay, yayToggle))
  socket.on('thumb', handler(thumb, thumbToggle))


  function handler(symbol, toggle) {
    return function () {
      sendSymbol(symbol)
      symbolToggle(toggle)
    }
  }

  function sendSymbol(symbol) {
    symbol.className = 'visible'
    setTimeout(() => {
      symbol.classList.remove('visible')
    }, 2000)
  }        

  function symbolToggle(toggle) {
    toggle = true
    setTimeout(() => {
        toggle = false
      }, 2001)
  }

  async function init() {
    const modelURL = "./tfjsmodel-graph/model.json"
    model = await tf.loadGraphModel(modelURL)

    // tsjs handpose detection points
    tfmodel = await handpose.load()
  }
