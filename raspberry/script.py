from flask import jsonify
import time
import cv2
import pyzbar.pyzbar as pyzbar
# from gpiozero import LED
from classes import VideoFrame, QRCode, Point, BoundingBox

# led = LED(17)

def on_connect() :
    print("Connection from core server")
    return jsonify({'success': True})

def on_start() :
    print("Process starting")
    
    # led.on()
    video_frames = []
    cap = cv2.VideoCapture('./test_data/test.mp4')
    for i in range(0,40):
        ret,frame = cap.read()

        decodedObjects = pyzbar.decode(frame)

        if decodedObjects :
            qrcodes = []

            for obj in decodedObjects :
                if("outrigger" in obj.data.decode()) :
                    qrcodes.append(QRCode(obj.data.decode(),
                    BoundingBox(
                        Point(
                            obj.rect.left,
                            obj.rect.top
                        ),
                        Point(
                            obj.rect.left+obj.rect.width,
                            obj.rect.top+obj.rect.height
                        )
                    )
                    ))
            h, w = frame.shape[:2]
            if(qrcodes) :
                video_frames.append(VideoFrame(w, h, qrcodes,'img/%d.png' %i))
                cv2.imwrite('./public/%d.png' %i,frame)

    cap.release()

    video_frames_dict = []
    for v in video_frames:
        video_frames_dict.append(v.to_dict())
        print(v.path)

    # led.off()

    return jsonify({
        'success': {
            'frames': video_frames_dict
        }
    })

def extract_frames(file_path) :
    video_frames = []
    # Create a VideoCapture object and read from input file
    # If the input is the camera, pass 0 instead of the video file name
    cap = cv2.VideoCapture(file_path)
    
    # Check if camera opened successfully
    if (cap.isOpened()== False): 
        print("Error opening video stream or file")
    else :
        # Read until video is completed
        while(cap.isOpened()):
            # Capture frame-by-frame
            ret, frame = cap.read()
            if ret == True:

                decodedObjects = pyzbar.decode(frame)

                if decodedObjects :
                    qrcodes = []
                    _,encoded = cv2.imencode('.png', frame)
                    binary_frame = encoded.tobytes()
                    for obj in decodedObjects :
                        # Image is sideways
                        # Coordinates are inverted (x is y, y is x)
                        # TODO : Investigate why
                        if("outrigger" in obj.data.decode()) :
                            qrcodes.append(QRCode(obj.data.decode(),
                            BoundingBox(
                                Point(
                                    obj.rect.left,
                                    obj.rect.top
                                ),
                                Point(
                                    obj.rect.left+obj.rect.width,
                                    obj.rect.top+obj.rect.height
                                )
                            )
                            ))
                    h, w = frame.shape[:2]
                    if(qrcodes) :
                        video_frames.append(VideoFrame(w, h, frame, binary_frame, qrcodes))

            # Break the loop
            else: 
                break

        # # Print & Save images
        print("=> %d frames with QRCodes were found" % len(video_frames))

    # When everything done, release the video capture object
    cap.release()

    return video_frames