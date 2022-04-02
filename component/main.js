const socket = io('http://localhost:8888');
const canvas = document.querySelector('#workspace')

let defaultBackground = 'white'
let isDrawing = false
let drawWidth = 2
let drawColor = 'black'
let restoreDraw = [];
let restoreIndex = -1;


canvas.width = 500;
canvas.height = 400;

const ctx = canvas.getContext('2d')

ctx.fillStyle = defaultBackground;
ctx.fillRect(0, 0, canvas.width, canvas.height)

canvas.addEventListener("mousedown", start, false)
canvas.addEventListener("mousemove", draw, false)
canvas.addEventListener("mouseup", stop, false)
canvas.addEventListener('mouseout', stop, false)

function start(event) {
    isDrawing = true
    ctx.beginPath();
    // Tìm vị trí của x và y
    const x = event.clientX - canvas.offsetLeft
    const y = event.clientY - canvas.offsetTop
    ctx.moveTo(x, y);
    // Emit sự kiện
    socket.emit("start", {
        isDrawing: true,
        x,
        y
    })
    event.preventDefault();
}

function draw(event) {
    if (isDrawing) {
        // Tìm vị trí của x và y
        const x = event.clientX - canvas.offsetLeft
        const y = event.clientY - canvas.offsetTop
        ctx.lineTo(x, y)
        ctx.lineWidth = drawWidth
        ctx.strokeStyle = drawColor
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke();
        socket.emit("draw", {
            x,
            y
        })
    }
    event.preventDefault();
}

function stop(event) {
    if (isDrawing) {
        ctx.stroke();
        ctx.closePath();
        isDrawing = false;
    }
    event.preventDefault();
    if (event.type != 'mouseout') {
        restoreDraw.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
        restoreIndex += 1
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

const buttonUndoElement = document.querySelector('.button-undo');
buttonUndoElement.addEventListener('click', undo);
const buttonClearElement = document.querySelector('.button-clear');
buttonClearElement.addEventListener('click', clear);

function changeThinDrawer(event) {
    drawWidth = event.target.value;
}

function clear() {
    ctx.fillStyle = defaultBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    restoreDraw = [];
    restoreIndex = -1;
}

function undo() {
    if (restoreIndex <= 0) {
        clear
    } else {
        restoreIndex -= 1
        restoreDraw.pop()
        ctx.putImageData(restoreDraw[restoreIndex], 0, 0)
    }
}

// socket lắng nghe sự kiện
socket.on('startFromServer', function(result) {
    isDrawing = result.isDrawing;

    ctx.beginPath();
    ctx.moveTo(result.x, result.y);
})

socket.on('startDrawFromServer', function(result) {
    if (isDrawing) {
        // Tìm vị trí của x và y
        const x = result.x
        const y = result.y
        ctx.lineTo(x, y)
        ctx.lineWidth = drawWidth
        ctx.strokeStyle = drawColor
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke();
    }
})