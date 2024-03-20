import React, { useRef } from 'react'
import Image from 'next/image';
// import { selectSampleImage } from '@/lib/features/sampleImageSlice';
import { useAppSelector } from '@/lib/hooks';

const DynamicSlide = () => {
    // const sampleImage = useAppSelector(selectSampleImage);
    const sampleImage = useAppSelector((state) => state.value)[0];

    return (
        <div className='dynamic-slide'>
            <img src="/slides/slide5.png"
            className="border-2 border-white rounded-lg"
             />
            <img src={sampleImage} className='absolute'
            style={{
                top: "10.8rem",
                left: "6.8rem",
                height: "200px",
                width: "350px"
            }} />
        </div>
    )
}

export default DynamicSlide