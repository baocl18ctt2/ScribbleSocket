// const socket = io('http://localhost:8888');

// const chatWrapperElement = document.querySelector('.chat-wrapper')
const chatContextElement = document.querySelector("#chat-content")
chatContextElement.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        // Thêm hiển thị
        $('.chat-wrapper').append(`<p>
       <span>${socket.id}: </span>
       <span>${chatContextElement.value }</span>
   </p>`)
        socket.emit("sendChat", { message: chatContextElement.value })
    }
})

socket.on("sendChatFromServer", function(result) {
    if (socketId !== result.id) {

    }
})