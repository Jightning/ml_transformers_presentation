import React, { useRef, useEffect, useState } from 'react'
import { useAppSelector } from '@/lib/hooks';

const ProcessedImage = () => {
    const sampleImage = useAppSelector((state) => state.value)[1];

    return (
        <div>
            <img src={sampleImage} height={540} width={720}
            className={'relative top-1 border-2 border-white rounded-lg '}></img>
        </div>
    )
}

export default ProcessedImage