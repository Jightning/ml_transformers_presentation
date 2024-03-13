"use client"

import React, { useEffect, useState } from 'react'
// import { selectSampleImage } from '@/lib/features/sampleImageSlice';
import { useAppSelector } from '@/lib/hooks';

const ImageArrayDisplay = () => {
    // const sampleImage = useAppSelector(selectSampleImage);
    const sampleImage = useAppSelector((state) => state.value)[0];
    const [imgArray, setImgArray] = useState<Uint8ClampedArray>()

    useEffect(() => {
        const loadImage = async () => {
            const img = new Image();
            img.src = sampleImage; // Replace with your image source
            
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
    return (
        <div>
            {(() => {
                let visualArray = ""
                if (!imgArray) {
                    return
                }
                for (let i = 0; i < imgArray.length; i+=16) {
                    visualArray += "[" + String(imgArray.slice(i, i+4)) + "]"
                }
                return (
                    <div className='border-2 border-white max-w-lg break-words text-center overflow-x-hidden'>{visualArray}</div>
                )
            })()}
        </div>
    )
}

export default ImageArrayDisplay