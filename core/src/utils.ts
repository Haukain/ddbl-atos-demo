import request = require('request-promise-native')
import * as fs from 'fs';
import * as path from 'path';
import * as WebSocket from 'ws';

export function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms as any));
  }

export function cleanFolder(directory:string) {
    let files = fs.readdirSync(directory);
    for (const file of files) {
            fs.unlinkSync(path.join(directory, file))
    }
    return true
}

export function listFiles(directory:string){
    
    return new Promise(function(resolve, reject) {
        fs.readdir(directory, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
}

export function listImages(directory:string){
    
    return new Promise(function(resolve, reject) {
        listFiles(directory)
        .then((filenames:any)=>{
            resolve(filenames.filter((f:string)=>{f.includes('.jpg')||f.includes('.png')}))
        })
        .catch((err:any)=>reject(err))
    })
}

export function writeJson(path:string,json:any){
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, json, 'utf8', function (err) {
            if (err) {
                return reject(err);
            }
            else resolve()
        });
    });
}

export function post(uri: string, payload: any):any{
    
    let options = {
        method: 'POST',
        uri: `http://${uri}`,
        body: payload,
        json: true
    };

    console.log(uri)
    
    return request.post(options)
}

export function get(uri: string,json=true,encoding: string | null = 'utf8'):any {
    
    let options = {
        method: 'GET',
        uri: `http://${uri}`,
        json: json,
        encoding: encoding
    };

    return request.get(options)
}

export function wsSendMessage(ws:WebSocket,msg:string) {
    ws.send(JSON.stringify({message:msg}))
}

export function wsSendJsonPathRaw(ws:WebSocket,path:any) {
    ws.send(JSON.stringify({rawJsonPath:path}))
}