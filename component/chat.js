const chatContextElement = document.querySelector("#chat-content")
chatContextElement.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        // Thêm hiển thị
        $('.chat-wrapper').append(`<p>
            <span style="font-weight: 700">${socket.id}: </span>
            <span>${chatContextElement.value }</span>
        </p>`);
        // Xoa du lieu trong the input
        console.log(event)
        socket.emit("sendChat", { message: chatContextElement.value })
        chatContextElement.value = ''
    }

})

socket.on("sendChatFromServer", function(result) {
    if (socketId !== result.socketId) {
        $('.chat-wrapper').append(`<p>
        <span style="font-weight: 700">${result.socketId}: </span>
        <span>${result.message }</span>
    </p>`)
    }
})