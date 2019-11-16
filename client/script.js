function display(text,type='info'){
    $('#text-area').append(`<p class=${type}>${text}</p>`)
}

let socket = new WebSocket("ws://localhost:9000");
socket.onopen = function(event) {
    display("[open] Connection established");
}

$('#start-button').click((event)=>{
    display("[message] Sending start message")
    socket.send("start");
})

$('#connect-button').click((event)=>{
    display("[message] Sending connect message")
    socket.send("connect");
})

socket.onmessage = function(event) {
    display(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
if (event.wasClean) {
    display(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
} else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    display('[close] Connection died','error');
}
};

socket.onerror = function(error) {
    display(`[error] ${error.message}`,'error');
};