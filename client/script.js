const ip = 'localhost:9000'
const wsUrl = `ws://${ip}`
const httpUrl = `http://${ip}`

function display(text,type='info'){
    $('#text-display-area').append(`
    <div class="card mb-2">
        <div class="card-body ${type}">
        ${text}
        </div>
    </div>`)
}

function handleRawJson(rawJsonPath){
    fetch(`${httpUrl}${rawJsonPath}`)
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
        id = $('#raw-images-display-area').length
        for(let f of data.frames){
            imgId=`raw-img-${id}`
            let fullImagePath = `${httpUrl}${f.path}`
            $('#raw-images-display-area').append(`
                <img id="${imgId}-img" height="75px" class="image" src=${fullImagePath}></img>
            `)
            // $('#raw-images-display-area').append(`
            // <div id="${imgId}-div">
            //     <p class="font-weight-lighter">${f.width},${f.height}</p>
            //     <div id="${imgId}-codes"></div>
            //     <img id="${imgId}-img" height="75px" class="image" src=${fullImagePath}></img>
            // </div>`)
            // for(let code of f.qrcodes){
            //     $(`#${imgId}-codes`).append(`<p class="font-weight-lighter">${code.name}</p>`)
            // }
            id+=1
        }
    })
    .catch(err => {
        console.error(err)
    })
}

let socket = new WebSocket(wsUrl);
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
    json = JSON.parse(event.data)
    if(json.message) display(`[message] Data received from server: ${json.message}`);
    else if(json.rawJsonPath){
        handleRawJson(json.rawJsonPath)
    }
    else {
        console.log(json)
        display(json)
    }
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