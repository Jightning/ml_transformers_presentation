import React, { useRef } from 'react'
// import { selectSampleImage } from '@/lib/features/sampleImageSlice';
import { useAppSelector } from '@/lib/hooks';

const SampleImage = (className?: any) => {
    const canvasRef = useRef(null);
    // const sampleImage = useAppSelector(selectSampleImage);
    const sampleImage = useAppSelector((state) => state.value)[0];

    let dimen = [720, 540]
    console.log(sampleImage)
    return (
        <div>
            <img src={sampleImage} height={540} width={720}
            className={'relative top-1 border-2 border-white rounded-lg ' + className}></img>
        </div>
    )
}

export default SampleImage