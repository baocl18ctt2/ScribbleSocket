const socket = io('http://localhost:8888');
const canvas = document.querySelector('#workspace')

let socketId = null


let defaultBackground = 'white'
let isDrawing = false
let drawWidth = 2
let drawColor = 'black'
let restoreDraw = [];
let restoreIndex = -1;


canvas.width = 600;
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
    const imageLastObject = ctx.getImageData(0, 0, canvas.width, canvas.height)
    if (event.type != 'mouseout') {
        restoreDraw.push(imageLastObject)
        restoreIndex += 1
    }
    socket.emit("stop", {
        isDrawing,
        imageLastObject,
        restoreIndex,
        eventType: event.type
    })
}

const colors = document.querySelectorAll('.color')
colors.forEach(colors => {
    colors.addEventListener('click', changeColor)
})

function changeColor(event) {
    drawColor = event.target.style.backgroundColor;
    socket.emit("changeColor", {
        drawColor
    })
}

const thinDrawerElement = document.querySelector('.thin-drawer');
thinDrawerElement.addEventListener('change', changeThinDrawer)

const buttonUndoElement = document.querySelector('.button-undo');
buttonUndoElement.addEventListener('click', undo);
const buttonClearElement = document.querySelector('.button-clear');
buttonClearElement.addEventListener('click', clear);

function changeThinDrawer(event) {
    drawWidth = event.target.value;
    socket.emit("changeThinDrawer", {
        drawWidth
    })
}

function clear() {
    ctx.fillStyle = defaultBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    restoreDraw = [];
    restoreIndex = -1;
    socket.emit("clear", {
        width: canvas.width,
        height: canvas.height
    })
}

function undo() {
    if (restoreIndex <= 0) {
        clear
    } else {
        restoreIndex -= 1
        restoreDraw.pop()
        ctx.putImageData(restoreDraw[restoreIndex], 0, 0)
    }
    socket.emit("undo", {
        restoreIndex
    })
}

// socket lắng nghe sự kiện
socket.on('setInstance', function(result) {
    const { id } = result
    socketId = id
})

socket.on('startFromServer', function(result) {
    if (socketId !== result.socketId) {
        isDrawing = result.isDrawing;
    }
    ctx.beginPath();
    ctx.moveTo(result.x, result.y);
    event.preventDefault();
})

socket.on('startDrawFromServer', function(result) {
    console.log('so', socketId);
    console.log(result);
    if (isDrawing && socketId !== result.socketId) {
        // Tìm vị trí của x và ys
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

socket.on("stopFromServer", function(result) {
    if (isDrawing && socketId !== result.socketId) {
        ctx.stroke();
        ctx.closePath();
        isDrawing = result.isDrawing;
    }
    const imageLastObject = result.imageLastObject
    if (result.eventType != 'mouseout' && socketId !== result.socketId) {
        restoreDraw.push(imageLastObject)
        restoreIndex = result.restoreIndex
    }
})

socket.on("changeColorFromServer", function(result) {
    drawColor = result.drawColor
})

socket.on("changeThinDrawerFromServer", function(result) {
    drawWidth = result.drawWidth
})

socket.on("clearFromServer", function(result) {
    ctx.fillStyle = defaultBackground;
    ctx.fillRect(0, 0, result.width, result.height);
    ctx.fillRect(0, 0, result.width, result.height);
    restoreDraw = [];
    restoreIndex = -1;
})

socket.on("undoFromServer", function(result) {
    if (result.restoreIndex <= 0) {
        clear
    } else {
        restoreIndex -= 1
        restoreDraw.pop()
        ctx.putImageData(restoreDraw[result.restoreIndex], 0, 0)
    }
})