const canvas = document.querySelector('#workspace')

let defaultBackground = 'white'
let isDrawing = false
let drawWidth = 2
let drawColor = 'black'

canvas.width = 500;
canvas.height = 400;

const ctx = canvas.getContext('2d')

ctx.fillStyle = defaultBackground;
ctx.fillRect(0, 0, canvas.width, canvas.height)

canvas.addEventListener("mousedown", start, false)
canvas.addEventListener("mousemove", draw, false)
canvas.addEventListener("mouseup", stop, false)

function start(event) {
    isDrawing = true
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    event.preventDefault();
}

function draw() {
    if (isDrawing) {
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop)
        ctx.lineWidth = drawWidth
        ctx.strokeStyle = drawColor
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke();
    }
    event.preventDefault()
}

function stop() {
    if (isDrawing) {
        ctx.stroke();
        ctx.closePath();
        isDrawing = false;
        event.preventDefault();
    }
}

const colors = document.querySelectorAll('.color')
colors.forEach(colors => {
    colors.addEventListener('click', changeColor)
})

function changeColor(event) {
    drawColor = event.target.style.backgroundColor;

}

const thinDrawerElement = document.querySelector('.thin-drawer');
thinDrawerElement.addEventListener('change', changeThinDrawer)

function changeThinDrawer(event) {
    drawWidth = event.target.value;
}