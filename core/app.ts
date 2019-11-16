import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import Raspberry from './src/Raspberry';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const raspberryPiClient = new Raspberry("localhost:5000",0);

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        if(message==='connect'){
            ws.send('Connection test...');
            raspberryPiClient.connect().then((e)=>{
                e?ws.send('Connection successful'):ws.send('Connection failed');
            })
        }

        if(message==='start'){
            ws.send('Starting process...');
            raspberryPiClient.start().then((e)=>{
                e?ws.send('Process successful'):ws.send('Process failed');
            })
        }
        //log the received message and send it back to the client
        console.log('received: %s', message);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Connection established');
});

// start our server
server.listen(9000, () => {
    console.log(`Server started on port 9000`);
});