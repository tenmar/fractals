
// DECLARE GLOBLS
/** @type {Record<number, Record<number, number | undefined>>} */
const cache = {}
/** @type {HTMLCanvasElement | undefined} */
const canvas = document.getElementById('canvas') 
/** @returns {CanvasRenderingContext2D | undefined} */
const context2D = canvas && canvas.getContext('2d')

/** camera */
let zoom = 1
let offsetX = 0
let offsetY = 0

/** define domain and range */
let domain = [-2.5, 1.5]
let domainLength = domain[1] - domain[0]
let range = [-1.12, 1.12]
let rangeLength = range[1] - range[0]

/** iterations */
const f = Math.sqrt(0.001 + 2.0 * Math.min(domainLength, rangeLength));
const MAX_ITERATIONS = Math.floor(223.0 / f)

const ESCAPE_RADIUS = 10.0
/** coloring */
let colors = []
for (let colorInd = 1; colorInd <= MAX_ITERATIONS; colorInd++) {
    let grey = colorInd * 255/MAX_ITERATIONS
    colors.push(`rgb(${grey}, ${grey}, ${grey})`)
}
console.log("COlors", colors)



// Actual functions
function resizeCanvas(resizeDomain = false) {
    if (!canvas) { 
        console.log("No canvas?")
        return 
    }
    const { innerWidth, innerHeight } = window
    canvas.width = innerWidth
    canvas.height = innerHeight
    
    const { width, height } = canvas

    if (resizeDomain) {
        let newDomainLength = width/height * rangeLength
        domain = [domain[0], domain[0] + newDomainLength]
        domainLength = domain[1] - domain[0]
    } else {
        let newRangeLength = height/width * domainLength
        range = [-newRangeLength/2, newRangeLength/2]
        rangeLength = range[1] - range[0]
    }
    console.log("Resized Canvas!")
}

/** 
 * @param {number} inputX
 * @returns {number}
 */
function getX(inputX) {
    const dx = (domainLength / canvas.width) / zoom
    return domain[0] + dx * inputX
}
/** 
 * @param {number} inputY
 * @returns {number}
 */
function getY(inputY) {
    const dy = (rangeLength / canvas.height) / zoom
    return range[0] + dy * inputY
}

/**
 * 
 * @param {number} x Cr_0
 * @param {number} y Ci_0
 * @returns -1 if in mandelbrot set after # of iterations, otherwise i iterations taken to diverge.
 */
function computeInMandelbrot(Zr_0, Zi_0) {
    let Zr = 0 // Zr
    let Zi = 0 // Zi
    let Tr = 0 // Tr
    let Ti = 0 // Ti


    // iterate
    let iter = 0
    while (Tr + Ti <= 4 && iter < MAX_ITERATIONS) {
        Zi = (2 * Zr * Zi) + Zi_0// Zi 2 * xk * yk + imaginaryComponent
        Zr = Tr - Ti + Zr_0 // Zr
        Tr = Math.pow(Zr, 2)// Tr
        Ti = Math.pow(Zi, 2) // Ti
        iter += 1
    }

    return iter < MAX_ITERATIONS ? iter : -1
}


function draw() {
    const { width, height } = canvas

    let currentPixel = 0
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            currentPixel += 1
            if (currentPixel % 100000 === 0) { console.log("...drew", currentPixel, "pixels") }

            const x0 = getX(x)
            const y0 = getY(y)

            const iter = computeInMandelbrot(x0, y0)

            context2D.fillStyle = iter == -1 ? '#000' : colors[iter]
            context2D.fillRect(x, y, 1, 1)
        }
    }
    
    console.log("Drew canvas!")
}

resizeCanvas()

let XArray = [0, Math.round(canvas.width/2), canvas.width]
let YArray = [0, Math.round(canvas.height/2), canvas.height]
for (let i = 0; i < XArray.length; i++) {
    console.log(rangeLength, canvas.height, YArray[i])
    console.log("X", getX(XArray[i]), "Y", getY(YArray[i]))
}


draw()
