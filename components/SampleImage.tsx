import React, { useRef } from 'react'
// import { selectSampleImage } from '@/lib/features/sampleImageSlice';
import { useAppSelector } from '@/lib/hooks';
import Image from 'next/image';

const SampleImage = (className?: any) => {
    const canvasRef = useRef(null);
    // const sampleImage = useAppSelector(selectSampleImage);
    const sampleImage = useAppSelector((state) => state.value)[0];

    return (
        <div className='sample-slide'>
            <img src={sampleImage} height={540} width={720}
            className={'border-2 border-white rounded-lg ' + className}></img>
        </div>
    )
}

export default SampleImage