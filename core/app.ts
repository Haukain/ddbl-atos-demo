import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import Raspberry from './src/Raspberry';
import { cleanFolder, listFiles, wsSendMessage, wsSendJson } from './src/utils';

cleanFolder('public/raw')
cleanFolder('public/predictions')

const app = express();
app.use(express.static('public'))

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const raspberryPiClient = new Raspberry("localhost:5000",0);

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        if(message==='connect'){
            wsSendMessage(ws,'Connection test...');
            raspberryPiClient.connect().then((e)=>{
                e?wsSendMessage(ws,'Connection successful'):wsSendMessage(ws,'Connection failed');
            })
        }

        if(message==='start'){
            wsSendMessage(ws,'Starting process...');
            raspberryPiClient.start().then((e)=>{
                console.log('return value')
                console.log(e)
                e?wsSendMessage(ws,'Process successful'):wsSendMessage(ws,'Process failed');
                if(e){
                    listFiles('./public/raw')
                    .then((files:any)=>{
                        console.log('files:')
                        console.log(files)
                        wsSendJson(ws,files.map((e:any)=>`/raw/${e}`))
                    })
                    .catch((err:null|NodeJS.ErrnoException)=>{
                        console.log('error:')
                        console.error(err)
                        wsSendJson(ws,[])
                    })
                }
            })
        }
        //log the received message and send it back to the client
        console.log('received: %s', message);
    });

    //send immediatly a feedback to the incoming connection    
    wsSendMessage(ws,'Connection established');
});

// start our server
server.listen(9000, () => {
    console.log(`Server started on port 9000`);
});