import React, { useRef, useEffect, useState, useCallback } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { 
  DrawingUtils, 
  FaceLandmarker, 
  FilesetResolver, 
  HandLandmarker, 
  FaceDetector
} from "@mediapipe/tasks-vision";

import { newSampleImage, newBoxedImage } from '@/lib/features/sampleImageSlice';
import { useAppDispatch } from '@/lib/hooks';

// import fs from "fs"


function FaceDetectionWebcam() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const spareCanvasRef = useRef(null);
    let dimen = [720, 540]
    var camera = null;
    const [isNewImage, setIsNewImage] = useState(false)
    const [detection, setDetection] = useState(0)

    const dispatch = useAppDispatch()

    function getCanvas() {
        // const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
    
        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
    
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
    
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.translate(videoWidth, 0);
        canvasCtx.scale(-1, 1);
        canvasCtx.drawImage(
          webcamRef.current.video,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        return canvasCtx
    }

    function draw(results) {
        // console.log("Results", results)
        const canvasCtx = getCanvas()
        const drawing_utils = new DrawingUtils(canvasCtx)

        if (results.faceLandmarks || results.landmarks) {
            for (const landmarks of (results.landmarks ? results.landmarks : results.faceLandmarks)) {
                drawing_utils.drawLandmarks(landmarks)

                let connections = [];
                for (let i = 1; i < landmarks.length; i++) {
                    connections[i - 1] = {start: landmarks[i - 1], end: landmarks[i]}
                }

                drawing_utils.drawConnectors(landmarks, connections, {color: '#C0C0C070', lineWidth: 15})
            }
      
            canvasCtx.restore();

        } 
    }

    function drawBoundingBoxes(results) {
        // console.log("Results", results)

        const canvasCtx = getCanvas()
        const drawing_utils = new DrawingUtils(canvasCtx)

        if (results.detections) {
            for (const detection of results.detections) {
                drawing_utils.drawBoundingBox(detection.boundingBox, {
                    fillColor: "transparent",
                    color: "#00ff00"
                })
                // canvasCtx.strokeRect(detection.boundingBox.originX, detection.boundingBox.originY, detection.boundingBox.width, detection.boundingBox.height)
            }
            canvasCtx.filter = 'blur(1000px)';
            canvasCtx.restore();
        } 
    }

    // setInterval(())
    useEffect(() => {
        let handLandmarker;
        let faceLandmarker;
        let faceDetector;

        const createLandmarkers = async () => {
    
            const vision = await FilesetResolver.forVisionTasks(
                // path/to/wasm/root
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            handLandmarker = await HandLandmarker.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath: "models/hand_landmarker.task"
                    },
                    numHands: 4
            });

            faceLandmarker = await FaceLandmarker.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath: "models/face_landmarker.task"
                    },
                    runningMode: "IMAGE"
            });

            faceDetector = await FaceDetector.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath: "models/blaze_face_short_range.tflite"
                    },
                    runningMode: "IMAGE"
            });
        }

        createLandmarkers();


        if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
            camera = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (faceLandmarker && handLandmarker && faceDetector && webcamRef.current && webcamRef.current.video !== null) {                    
                        if (detection === 0) {
                            const faceDetectionResult = faceDetector.detect(webcamRef.current.video);
                            drawBoundingBoxes(faceDetectionResult, false)
                        } else if (detection == 1) {
                            //detect face
                            const faceLandmarkerResult = faceLandmarker.detect(webcamRef.current.video);
                            draw(faceLandmarkerResult, false)
                        } else {
                            // detect hand
                            const handLandmarkerResult = handLandmarker.detect(webcamRef.current.video);
                            draw(handLandmarkerResult, true)
                        }
                    }   
                },
                width: dimen[0],
                height: dimen[1],
            });
            camera.start();
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === " ") {
                setIsNewImage(true)
            }
        })

        return () => {
            camera.stop()
        }

    }, [detection]);

    useEffect(() => {
            if (isNewImage) {
                // const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;
                
                // Set canvas width
                spareCanvasRef.current.width = videoWidth;
                spareCanvasRef.current.height = videoHeight;
                
                const canvasElement = spareCanvasRef.current;
                const canvasCtx = canvasElement.getContext("2d");
                
                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                canvasCtx.translate(videoWidth, 0);
                canvasCtx.scale(-1, 1);
                canvasCtx.drawImage(
                  webcamRef.current.video,
                  0,
                  0,
                  canvasElement.width,
                  canvasElement.height
                );
                console.log(canvasElement.height, canvasElement.width)
            
                // console.log(canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height))
                const imageSrc = spareCanvasRef.current.toDataURL('image/png');
                const imgData = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height)

                dispatch(newSampleImage([imageSrc, canvasRef.current.toDataURL('image/png')]))
                setIsNewImage(false)
            }
    }, [isNewImage])

    return (
        <div>
            <canvas ref={spareCanvasRef} className="hidden absolute top-1"></canvas>
            <div className="absolute">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className={"hidden"}
                />
                <canvas
                ref={canvasRef}
                className="unique-slide"
                style={{
                    position: "absolute",
                    textAlign: "center",
                    zindex: 9,
                    width: dimen[0],
                    height: dimen[1],
                    border: "solid white",
                    borderRadius: "15px"
                }}
                ></canvas>
            </div>

            <span 
            onClick={() => {
                setDetection((detect) => {
                    if (detect === 2) {
                        return 0
                    }
                    return detect + 1
                })
            }}  
            className="material-symbols-outlined model-cycle"
            >cycle</span>

            <span 
                onClick={() => {   
                    setIsNewImage(true)
                }}
                className="absolute border-2 border-white capture-btn material-symbols-outlined">photo_camera</span>


        </div>
    );
}

export default FaceDetectionWebcam;

