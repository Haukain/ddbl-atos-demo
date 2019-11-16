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
                console.log("connect: "+response.success)
                return true
            }
            else if(response.error){
                console.log("error connecting: "+response.error)
                return false
            }
            else {
                console.log("unknown error connecting: "+response)
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
                return this.get_images(response.success.files)
                .then((e:any)=>{
                    console.log('success')
                    console.log(e)
                    return true
                })
                .catch((err:any)=>{
                    console.log('fail')
                    console.error(err)
                    return false
                })
            }
            else if(response.error){
                console.log("error starting: "+response.error)
                return false
            }
            else {
                console.log("unknown error starting: "+response)
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