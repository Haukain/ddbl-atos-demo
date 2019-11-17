import {get,post} from './utils'
import * as fs from 'fs';

export default class Raspberry {
    localIP: string;
    id: number;

    constructor(localIP: string, id: number) {
        this.localIP = localIP;
        this.id = id
    }

    connect(): Promise<boolean>{
        console.log(`Connection to PI ${this.id} on ${this.localIP}`)
        return get(`${this.localIP}/`)
        .then((response:any) => {
            if(response.success){
                return true
            }
            else if(response.error){
                console.log("Error testing the connection: "+response.error)
                return false
            }
            else {
                console.log("Unknown error testing the connection: "+response)
                return false
            }
        })
        .catch((err:any) => {
            console.error(err)
            return false
        });
    }

    start(): Promise<boolean> {
        console.log(`Starting process on PI ${this.id} on ${this.localIP}`)
        return get(`${this.localIP}/start/`)
        .then((response:any) => {
            if(response.success){
                console.log(response.success)
                return this.get_images(response.success.frames.map((f:any)=>f.path))
                .then((e:any)=>{
                    return true
                })
                .catch((err:any)=>{
                    console.error(err)
                    return false
                })
            }
            else if(response.error){
                console.error("Error starting the process: "+response.error)
                return false
            }
            else {
                console.log("Unknown error starting the process: "+response)
                return false
            }
        })
        .catch((err:any) => {
            console.error(err)
            return false
        });
    }

    get_images(paths: Array<string>):any {
        let promises = []
        for(let p of paths){
            promises.push(
                get(`${this.localIP}/${p}`,false,null)
                .then((response:any) =>{
                    fs.writeFile(`./public/raw/${this.id}_${p.split('/')[1]}`, response,
                        function(err) {
                            if(err) {
                                return err
                            }
                        }
                    );
                })
            )
        }
        return Promise.all(promises)
    }
}