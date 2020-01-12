import { listImages } from "./utils";
import { response } from "express";
import { promises } from "dns";
const automl = require('@google-cloud/automl');
const fs = require('fs');

export default class GCP {
    projectId:string;
    computeRegion:string;
    modelId:string;
    scoreThreshold:number;
    client:any;
    modelFullId:any;

    constructor(projectId:string,computeRegion:string,modelId:string,scoreThreshold:number) {
        this.projectId = projectId; //`The GCLOUD_PROJECT string, e.g. "my-gcloud-project"`;
        this.computeRegion = computeRegion; //`region-name, e.g. "us-central1"`;
        this.modelId =  modelId; //`id of the model, e.g. “ICN723541179344731436”`;
        this.scoreThreshold =  scoreThreshold; //`value between 0.0 and 1.0, e.g. "0.5"`;
    
        // Create client for prediction service.
        this.client = new automl.PredictionServiceClient();
        
        // Get the full path of the model.
        this.modelFullId = this.client.modelPath(this.projectId, this.computeRegion, this.modelId);
    }
    
    start() {
        console.log("starting cloud connection")
        
        const params:any= {};
        
        if (this.scoreThreshold) {
        params.score_threshold = this.scoreThreshold;
        }
        
        let folderPath = './public/raw/'
        return listImages(folderPath)
        .then( (imagePaths:any) => {
            let promises = []
            for (let [i,p] of imagePaths.entries()){
                console.log(`Analyzing frame ${i}`)
                promises.push(new Promise((resolve,reject)=>{
                    // Read the file content for prediction.
                    const content = fs.readFileSync(`${folderPath}${p}`, 'base64');
            
                    // Set the payload by giving the content and type of the file.
                    const payload:any = {};
                    payload.image = {imageBytes: content};
                    this.predict(params,payload)
                    .then(
                        (response:any) =>resolve({frame:p,response:response})
                    )
                    .catch(
                        (err:any) => console.error(err)
                    )
                }))
            }
            return Promise.all(promises)
            .then( (responses:any)=>{
                //console.log(responses)
                return responses
            })
        })
        .catch(
            (err)=>console.error(err)
        )
    }

    
        
    predict(params:any,payload:any) {
        // params is additional domain-specific parameters.
        // currently there is no additional parameters supported.
        return this.client.predict({
            name: this.modelFullId,
            payload: payload,
            params: params,
        }).then((responses:any) => {
                const response = responses[0];
                // console.log(`Prediction results:`);
                // response.payload.forEach((result:any) => {
                //     console.log(`Predicted class name: ${result.displayName}`);
                //     console.log(`Classification: ${result.imageObjectDetection.boundingBox}`)
                //     console.log(`Classification: ${result.imageObjectDetection.score}`)
                // })
                return response
            }
        )
    }
}