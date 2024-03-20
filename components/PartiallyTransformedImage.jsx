"use client"

import React, { useRef, useEffect, useCallback } from 'react'
import { selectSampleImage } from '@/lib/features/sampleImageSlice';
import { useAppSelector } from '@/lib/hooks';


const PartiallyTransformedImage = () => {
    const imgData = useAppSelector((state) => state.value)[0];
    const canvasRef = useRef(null)
    const imgRef = useRef(null)
    let dimen = [720, 540]


    function RGBToGrayScale(red, green, blue){
        //return red * 0.2126 + green * 0.7152 + blue * 0.0722;
        return (red * 6966 + green * 23436 + blue * 2366) >> 15;
    }

    function threshold(grayscale){
        const thresholdValue = 100;
        if (grayscale < thresholdValue) {
          return 0;
        } else{
          return 255;
        }
    }

    useEffect(() => {
        const loadImage = async () => {
            const img = new Image();
            img.src = imgData;
            
            img.onload = () => {
                if (!(img.width && img.height && canvasRef.current?.width && canvasRef.current?.height)) {
                    return
                }
                canvasRef.current.width = img.width;
                canvasRef.current.height = img.height;
            
                const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });

                if (ctx) {
                    ctx.drawImage(img, 0, 0);

                    const imageData = ctx.getImageData(0, 0, 720, 540);
                    const pixels = imageData.data

                    for (let i = 0; i < imgData.length * 4; i += 4) {
                        // let red = pixels[i];
                        // let green = pixels[i + 1];
                        // let blue = pixels[i + 2];
                        // let alpha = pixels[i + 3];
                        // let average = (red + green + blue) / 3;
                        // pixels[i] = average;
                        // pixels[i + 1] = average;
                        // pixels[i + 2] = average;
                        // pixels[i + 3] = alpha;
                        const bw_value = threshold(RGBToGrayScale(pixels[i], pixels[i + 1], pixels[i + 2]))
                        pixels[i] = bw_value;
                        pixels[i + 1] = bw_value;
                        pixels[i + 2] = bw_value;
                    }
                    
                    ctx.putImageData(imageData, 0, 0);
                }
            
            };
          
            img.onerror = (error) => {
              console.error('Error loading image:', error);
            };
        };
    
        loadImage();
    }, []);

    return (
        <div>
            {/* <img src={imgData} className='hidden absolute' /> */}
            <canvas ref={canvasRef} 
            className='unique-slide'
            style={{
                position: "absolute",
                textAlign: "center",
                zindex: 9,
                width: dimen[0],
                height: dimen[1],
                border: "solid white",
                borderRadius: "15px"
            }}/>
            {/* <img src={sampleImage} height={540} width={720} className='relative top-1 border-2 border-white rounded-lg'></img> */}
        </div>
    )
}

export default PartiallyTransformedImage