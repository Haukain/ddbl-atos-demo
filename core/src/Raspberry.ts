import {get,post} from './utils'

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
                console.log("start: "+response.success.message)
                console.log("start: "+response.success.files)
                return true
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
}