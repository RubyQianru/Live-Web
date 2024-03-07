

class SymbolHandler {
  constructor(id, index) {
    this.toggle = false
    this.symbol = document.getElementById(id)
    this.index = index
    this.socket = id
  }

  handler(data) {
    return () => {
      this.sendSymbol()
      this.symbolToggle()
      console.log(data)
    }
  }

  sendSymbol = () => {
    this.symbol.className = 'visible'
    setTimeout(() => {
      this.symbol.classList.remove('visible')
    }, 2000)
  }    

  symbolToggle = () => {
    this.toggle = true
    setTimeout(() => {
        this.toggle = false
      }, 2001)
  }

}

class HandposeModel {

  async graphModelInit(path) {
    const modelURL = path
    this.model = await tf.loadGraphModel(modelURL)
    if (this.model) {
      console.log("Model is loaded!")
    }
  }

  async tfmodelInit() {
    this.tfmodel = await handpose.load()
  }

  async getResult(inputArr) {
    let maxValue = Math.max(...inputArr);
    let maxIndex = inputArr.indexOf(maxValue);
    return maxIndex
  }

  async predict(target) {
    let maxi, inputs
    const skeleton = await this.tfmodel.estimateHands(target)

    if (skeleton.length > 0) {

      const landmarks = skeleton[0].landmarks
      inputs = [];

      for (let i = 0; i < landmarks.length; i++) {
        inputs.push(landmarks[i][0]/505);
        inputs.push(landmarks[i][1]/505);
        inputs.push(landmarks[i][2]/505);
      }
      const output = tf.tidy(() => {
        return this.model.predict(tf.tensor(inputs, [1, 63]));
      });

      const result = await output.array()
      maxi = await this.getResult(result[0])

      if (maxi == 0 || maxi == 1) {
        if (result[0][maxi] > 0.6) {
          return maxi
        }
      } else if (maxi == 3) {
        if (result[0][maxi] >= 0.44) {
          return maxi
        }
      } else if (maxi == 2) {
        if (result[0][maxi] > 0.4) {
          return maxi
        }
      }
      
      return null 
    }
  }

}