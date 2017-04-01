var canvas
var canvasContext

var updateIntervalPerSecond = 10

var currentFractal
var maxIterations = 100 // max is 256 ?

var colors = []

// initial load
window.onload = function () {
  canvas = document.getElementById('FractalsCanvas')
  canvas.focus()
  canvasContext = canvas.getContext('2d')
  canvasContext.imageSmoothingEnabled = false

  setInterval(update, 1000 / updateIntervalPerSecond)

  for (var i = 0; i < maxIterations; i++) {
    colors[i] = 'rgb(' + getRandom256(i) + ',' + getRandom256(i) + ',' + getRandom256(i) + ')'
  }

  currentFractal = new Mandelbrot(maxIterations)
  currentFractal.draw()
}

// update function
function update () {
  // currentFractal.draw();
}

function getRandom256 (i) {
  return Math.floor(i * 256 / maxIterations)
  // return Math.floor(Math.random() * 255)
}

function Mandelbrot (depth) {
  this.maxDepth = depth

  this.draw = function () {
    var width = canvas.width
    var height = canvas.height

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var realComponent = (x - (width / 2.0)) * 4.0 / width
        var imaginaryComponent = (y - (height / 2.0)) * 4.0 / height
        var xk = 0
        var yk = 0
        var iteration = 0
        while (Math.pow(xk, 2) + Math.pow(yk, 2) <= 4 && iteration < this.maxDepth) {
          var xkNew = Math.pow(xk, 2) - Math.pow(yk, 2) + realComponent
          yk = (2 * xk * yk) + imaginaryComponent
          xk = xkNew
          iteration++
        }
        if (iteration < this.maxDepth) {
          canvasContext.fillStyle = colors[iteration]
          // canvasContext.fillStyle = 'white';
          canvasContext.fillRect(x, y, 1, 1)
        } else {
          canvasContext.fillStyle = 'black'
          canvasContext.fillRect(x, y, 1, 1)
        }
      }
    }
  }

  this.setDepth = function (depth) {
    this.maxDepth = depth
  }
}
