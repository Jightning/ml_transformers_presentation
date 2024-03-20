"use client"

import React, { useEffect, useState } from 'react'
// import { selectSampleImage } from '@/lib/features/sampleImageSlice';
import { useAppSelector } from '@/lib/hooks';

const ImageArrayDisplay = () => {
    // const sampleImage = useAppSelector(selectSampleImage);
    const imageSrc = useAppSelector((state) => state.value)[0];
    const [imageArray, setImgArray] = useState<Uint8ClampedArray>()
    const [colorChunks, setColorChunks] = useState("white")
    const [zoom, setZoom] = useState(1)

    useEffect(() => {
        const loadImage = async () => {
            const img = new Image();
            img.src = imageSrc; // Replace with your image source
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
            
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);

                    setImgArray(ctx.getImageData(0, 0, img.width, img.height).data);
                }
                // imageData now contains RGBA values for each pixel
                // console.log(imgArray, imgArray.length)
            
            };
          
            img.onerror = (error) => {
              console.error('Error loading image:', error);
            };
        };
    
        loadImage();
      }, []);

    function randomColor(values?: any): string {
        let newValues = []
        if (colorChunks === "picture" && values) {
            for (let i = 0; i < 3; i++) {
                newValues[i] = String(values[i])
                if (values[i] < 100) {
                    newValues[i] = "0" + newValues[i]
                    if (values[i] < 10) {
                        newValues[i] = "0" + newValues[i]
                    }
                }
            }

            return `rgb(${values[0]}, ${values[1]}, ${values[2]}, ${values[3]})`
        } else if (colorChunks === "random") {
            let colors = [Number(Math.random() * 256), Number(Math.random() * 256), Number(Math.random() * 256)]
            return `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`
        }

        return "rgb(255, 255, 255)"
    }
 
    let visualArray: any = [];

    if (imageArray) {
        for (let i = 0; i < imageArray.length; i += (32 * (zoom + 4))) {            
            visualArray.push(<span 
                style={{
                    color: randomColor(imageArray.slice(i, i+4)),
            }}>{"[" + String(imageArray.slice(i, i+4)) + "]"}</span>)

            if ((i / 4) % 640 == 0) {
                visualArray.push(<br />)
            }
        }
    }

    return (
        <div>
            <div className='absolute bottom-6 right-96 border-2 border-white rounded-lg p-4 w-32'>
                Zoom: {zoom}
            </div>
            <div 
                style={{
                    lineHeight: "1",
                    fontSize: ((zoom - 1) * (8) + 0.4) + "px",
                }}
                className={'image-array border-2 break-words border-white rounded-lg text-center overflow-x-hidden overflow-y-hidden'}>
                {visualArray.map((val: any) => {
                    return val
                })}
            </div>

            <span
                onClick={() => (setZoom((currentZoom: number) => {
                    if (currentZoom < 5) {
                        return currentZoom + 1;
                    }
                    return currentZoom
                }))} 
                className="material-symbols-outlined zoom-in-btn">zoom_in</span>

            <span 
                onClick={() => (setColorChunks((colorMode: string) => {
                    if (colorMode === "white") {
                        return "random"
                    } else if (colorMode === "random") {
                        return "picture"
                    }
                    return "white"
                }))}
                
                className="material-symbols-outlined visibility-btn absolute border-2 border-white">{colorChunks === "white" ? "visibility_off" : "visibility"}
            </span>
            
            <span
                onClick={() => (setZoom((currentZoom: number) => {
                    if (currentZoom > -4) {
                        return currentZoom - 1;
                    }
                    return currentZoom
                }))} 

                className="material-symbols-outlined zoom-out-btn absolute border-2 border-white ">zoom_out</span>
        </div>
    )
}

export default ImageArrayDisplay