import request = require('request-promise-native')

export function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms as any));
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

export function get(uri: string):any {
    
    let options = {
        method: 'GET',
        uri: `http://${uri}`,
        json: true
    };

    return request.get(options)
}