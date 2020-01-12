# ddbl-atos-demo

This project was made by [Timothy Cabaret](https://github.com/Haukain), a Fontys University of Applied Sciences as part of a project for ATOS.

# Table of Contents
1. [The project](#project)
2. [How it works](#how)
3. [File Structure](#file)
3. [Setup and use](#setup)

##  The project <a name="project"></a>

The goal of this project is to be able to showcase the use of Image Recognition for Machine Learning purpose.

The idea is to detect 'defects' on a [Lego Crane](https://www.lego.com/en-fr/product/rough-terrain-crane-42082) to alert the user that the machine scanned is due to maintenance. Parts are labelled with a QRCode to recognize which, for example stabilizer we are looking at.

For this task, the project is divised in 4 parts : 
- The client dashboard
- The main server
- The camera module
- The cloud machine learning model

### The client dashboard

The client dashboard is a web interface using Bootstrap for styling and websockets to communicate with the main server.

### The main server

The main server is a Typescript NodeJS server that does the link between the three other parts.

### The camera module

The camera module is a Raspberry Pi 4 using a Logitech webcam (any PI camera / usb webcam with sufficient quality should do the job) that runs a local Flask Python server.

### The cloud machine learning model

This part is hosted on the Google Cloud Platform and is a AutoML object detection model trained to differentiate defective and valid parts of the crane.

## How it works <a name="how"></a>

### 1) Startup

The user can access the web dashboard and test the connection with the server and the camera module using the 'connect'button. He can then start the process by pressing the 'start' button. 

When pressing the 'connect' button, a message is sent to the main server through the websocket and it sends a ping request to the camera module server, if a response is received, the connection is established and works, else one of the components is not available.

When pressing the 'start' button, a message is sent to the main server which starts the process. It will first contact the camera module to start filming and getting the resulting images.

### 2) Gathering images 

Once the request receveived buy the camera module, it will start filming with the camera. The crane as to drive in front of it so it can be captured.

Every frame of the footage will be scan to search for a QR code, if found, the frame will be kept. Else, it means it does not contain a part we are interested in a it is discarded. When the filming is finished, every frame kept are sent back to the main server along with the name of the part (contained in the QRCode).

### 3) Image recognition

Once every frame have been received by the main server, it will send them to the dashboard so that they can already be displayed along with their names.

It will then contact the Google Cloud model and ask for a scan of the images. The model will respond with predictions for every images and the server will also display them on the dashboard.

### 4) Result

The result is for a list of images of the crane, with for each, a name and a prediction of the state of the part.

A report is also made for the crane listing the scanned parts and the predicted state for each (i.e if 95% percent of the images corresponding to the stabilizer A are predicted working, we can be fairly sure it is not defective)

## File structure <a name="file"></a>

- **client/**
- **core/**
    - **public/**
    - **src/**
- **raspberry/**
    - **public/**

## Setup and use <a name="setup"></a>

The program as been tested with the client and the main server running locally. The server needs NodeJS and the dependencies installed locally with NPM in order to work, use the command 'npm start' in the core folder to run it. The dashboard can be used by openning the index.html in the client folder with a web browser

The camera module is hosted by a Raspberry PI 4 and a logitech camera. The card needs to have python 3 and Flask installed as well as the Pyzbar and OpenCV for python libraries installed. Once everything installed, run the program using 'python ./app.py' in the raspberry folder in the PI environnement.

The cloud model was trained using ~80 image of defective and working crane stabilizers to be able to make accurate predictions. You will need to create a project, train it and run a server in order to run this program, the name, id, and location of the model have to be filled in in the main server files.

