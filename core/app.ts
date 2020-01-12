import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import Raspberry from './src/Raspberry';
import { cleanFolder, wsSendMessage, wsSendJsonPathRaw } from './src/utils';
import GCP from './src/GCP';
var cors = require('cors')

cleanFolder('public/raw')
cleanFolder('public/predictions')

const app = express();
app.use(cors())
app.use(express.static('public'))

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const raspberryPiClient = new Raspberry(process.argv[2]?process.argv[2]:"localhost:5000",0);

// TO BE FILLED IN
const GCPProjectInfo = {
    name: 'blank', // name of the project
    location: 'blank', // location of the project
    id: 'blank' // id of the project
}
if (GCPProjectInfo.name==="blank"||GCPProjectInfo.location==="blank"||GCPProjectInfo.id==="blank") {
    console.log("Please fill in the GCP project information");
}
const GCPClient = new GCP(GCPProjectInfo.name,GCPProjectInfo.location,GCPProjectInfo.id,0.5);

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
            cleanFolder('public/raw')
            wsSendMessage(ws,'Starting process...');
            raspberryPiClient.start().then((e)=>{
                e?wsSendMessage(ws,'Process successful'):wsSendMessage(ws,'Process failed');
                if(e){
                    wsSendJsonPathRaw(ws,'/raw/frames.json')
                }
                GCPClient.start()
                .then((prediction:any)=>{
                    for(let p of prediction){
                        wsSendMessage(ws,`${p.frame} : ${p.response.payload[0].displayName}`)
                    }
                })
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