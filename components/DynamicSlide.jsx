import React, { useRef } from 'react'
// import { selectSampleImage } from '@/lib/features/sampleImageSlice';
import { useAppSelector } from '@/lib/hooks';

const DynamicSlide = () => {
    // const sampleImage = useAppSelector(selectSampleImage);
    const sampleImage = useAppSelector((state) => state.value)[0];

    return (
        <div>
            <img src="slides/slide5.png" />
            <img src={sampleImage} className='absolute'
            style={{
                top: "10.5rem",
                left: "6.8rem",
                height: "210px",
                width: "350px"
            }} />
        </div>
    )
}

export default DynamicSlide