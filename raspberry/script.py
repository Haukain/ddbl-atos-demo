from flask import jsonify
import time
import cv2
# import pyzbar.pyzbar as pyzbar
# import sys
# from classes import Outrigger, VideoFrame, QRCode, Object, Point, BoundingBox
# from google.cloud import automl_v1beta1 
# import numpy as np 
# import time

def on_connect() :
    print("Connection!")
    return jsonify({'success': "This is a successful connection"})

def on_start() :
    print("Has started")
    
    paths = []
    cap = cv2.VideoCapture(0)
    for i in range(0,3):
        ret,frame = cap.read()
        paths.append('img/%d.png' %i)
        cv2.imwrite('./public/%d.png' %i,frame)
    cap.release()

    return jsonify({
        'success': {
            'message': "This is a successful start",
            'files': paths
        }
    })

# def extract_frames(file_path) :
#     video_frames = []
#     # Create a VideoCapture object and read from input file
#     # If the input is the camera, pass 0 instead of the video file name
#     cap = cv2.VideoCapture(file_path)
    
#     # Check if camera opened successfully
#     if (cap.isOpened()== False): 
#         print("Error opening video stream or file")
#     else :
#         # Read until video is completed
#         while(cap.isOpened()):
#             # Capture frame-by-frame
#             ret, frame = cap.read()
#             if ret == True:

#                 decodedObjects = pyzbar.decode(frame)

#                 if decodedObjects :
#                     qrcodes = []
#                     _,encoded = cv2.imencode('.png', frame)
#                     binary_frame = encoded.tobytes()
#                     for obj in decodedObjects :
#                         # Image is sideways
#                         # Coordinates are inverted (x is y, y is x)
#                         # TODO : Investigate why
#                         if("outrigger" in obj.data.decode()) :
#                             qrcodes.append(QRCode(obj.data.decode(),
#                             BoundingBox(
#                                 Point(
#                                     obj.rect.left,
#                                     obj.rect.top
#                                 ),
#                                 Point(
#                                     obj.rect.left+obj.rect.width,
#                                     obj.rect.top+obj.rect.height
#                                 )
#                             )
#                             ))
#                     h, w = frame.shape[:2]
#                     if(qrcodes) :
#                         video_frames.append(VideoFrame(w, h, frame, binary_frame, qrcodes))

#             # Break the loop
#             else: 
#                 break

#         # # Print & Save images
#         print("=> %d frames with QRCodes were found" % len(video_frames))

#     # When everything done, release the video capture object
#     cap.release()

#     return video_frames

# def predict(video_frames) :
#     prediction_client = automl_v1beta1.PredictionServiceClient()

#     name = 'projects/{}/locations/us-central1/models/{}'.format('566187461177', 'IOD3328692288254640128')

#     print("=> making prediction on %d frames" % len(video_frames))
#     for i, vf in enumerate(video_frames) :
#         print("=> object detection on frame %d" %i)
#         payload = {'image': {'image_bytes': vf.binary_image }}
#         prediction = prediction_client.predict(name, payload, {}) # waits till request is returned

#         objects = []
#         for i in prediction.payload :
#             objects.append(Object(i.display_name,BoundingBox(
#                 Point(
#                     i.image_object_detection.bounding_box.normalized_vertices[0].x*vf.width,
#                     i.image_object_detection.bounding_box.normalized_vertices[0].y*vf.height),
#                 Point(
#                     i.image_object_detection.bounding_box.normalized_vertices[1].x*vf.width,
#                     i.image_object_detection.bounding_box.normalized_vertices[1].y*vf.height)
#                 )))
#         vf.objects = objects

#     return video_frames

# def export_images(video_frames) : 
#     print("=> exporting %d images" % len(video_frames))
#     for i, vf in enumerate(video_frames) :
#         print("=> exporting image %d" % i)
#         for q in vf.qrcodes :
#                 cv2.rectangle(vf.image, q.bounding_box.get_top_left_corner(), q.bounding_box.get_bottom_right_corner(),(255, 255, 0),3)
#                 cv2.putText(vf.image, str(q.name), q.bounding_box.get_top_left_corner(), cv2.FONT_HERSHEY_DUPLEX, 1,(255, 255, 0))
#         for o in vf.objects :
#                 cv2.rectangle(vf.image, o.bounding_box.get_top_left_corner(), o.bounding_box.get_bottom_right_corner(),(0, 0, 255),3)
#                 cv2.putText(vf.image, str(o.name), o.bounding_box.get_top_left_corner(), cv2.FONT_HERSHEY_DUPLEX, 1,(0, 0, 255))
#         cv2.imwrite("frames/%d.jpg" %(i), vf.image)

#     return 0

# def report(video_frames) :
#     print("=> reporting from %d images" % len(video_frames))

#     outriggers_tuples = []
#     outriggers = []
#     # Associate the qr codes and the objects in the list order
#     # TODO : Link QrCodes and their object with their position
#     # If there is more QrCodes than objects, objects are "unknown"
#     # If there is more objects than QrCodes, they are not taken in account
#     # TODO : link qr codes and their object if their is multiple ones
#     for i, vf in enumerate(video_frames) :
#         for j, q in enumerate(vf.qrcodes):
#             detected_object_name = vf.objects[j].name if j<len(vf.objects) else None
#             outriggers_tuples.append((q.name,detected_object_name))

#     for i in np.unique(np.array(list(map(lambda x: x[0],outriggers_tuples)))):
#         outriggers.append(Outrigger(i))

#     for i in outriggers:
#         for j in list(filter(lambda x: x[0]==i.ref, outriggers_tuples)) :
#             if(j[1]=="working_outrigger"):
#                 i.working+=1
#             elif(j[1]=="defective_outrigger"):
#                 i.defective+=1
#             else : i.unknown+=1
#         print("outrigger %s ; unknown : %d ; working : %d ; defective %d" %(i.ref,i.unknown,i.working,i.defective))

# if __name__ == '__main__':
#     print(time.asctime(time.gmtime()) + " Processing the video file...")
#     video_frames = extract_frames(sys.argv[1])
#     if(video_frames) : 
#         #prediction
#         print(time.asctime(time.gmtime()) +" Waiting for prediction...")
#         video_frames = predict(video_frames)
#         #export images
#         print(time.asctime(time.gmtime()) +" Exporting the images...")
#         export_images(video_frames)
#         #creating report
#         print(time.asctime(time.gmtime()) +" Creating the report...")
#         report(video_frames)
#         print(time.asctime(time.gmtime()) +" Ending the process...")
#     else :
#         print("No QRCode was found in the given video")