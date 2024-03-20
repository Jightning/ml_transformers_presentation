"use client"

import Image from "next/image";

import { SlideShow1 } from "@/slides.json"

import DynamicSlides from "@/components/DynamicSlide"
import FaceDetectionWebcam from "@/components/FaceDetectionWebcam"
import ImageArrayDisplay from "@/components/ImageArrayDisplay"
import PartiallyTransformedImage from "@/components/PartiallyTransformedImage"
import ProcessedImage from "@/components/ProcessedImage"
import SampleImage from "@/components/SampleImage"

import { useState, useEffect } from "react";

import StoreProvider from "@/components/redux/StoreProvider";

export default function Home() {
  const [slideNumber, setSlideNumber] = useState(0)

  useEffect(() => {
    const handleMouseDown = (event: any) => {
      if (event.key === "ArrowRight") {
        handleSlideChange(1)
      } else if (event.key === "ArrowLeft") {
        handleSlideChange(-1)
      }
    } 
    document.addEventListener("keydown", handleMouseDown)

    return () => {
      document.removeEventListener("keydown", handleMouseDown)
    }
  }, [])

  const types = ["peopleCam", "sampleImage", "slideWithDynamicImage", "bw-img", "imageArray", "partiallyTransformedImage"]
  const uniqueSlides = {
    [types[0]]: <FaceDetectionWebcam />,
    [types[1]]: <SampleImage />,
    [types[2]]: <DynamicSlides />,
    [types[3]]: <PartiallyTransformedImage />,
    [types[4]]: <ImageArrayDisplay />,
    [types[5]]: <ProcessedImage />,
  }

  const handleSlideChange = (change: number) => {
    setSlideNumber((num) => {
      let finalNum = num + change
      if (finalNum < 0 || finalNum >= SlideShow1.length) {
        return num
      }
      return finalNum
    })
  }

  return (
    <main className="">
      {slideNumber > 0 ? <span onClick={() => (handleSlideChange(-1))} className="material-symbols-outlined left-0 arrow">arrow_back_ios</span> : ""}
      
      {(() => {
        const slide = SlideShow1[slideNumber]
        if (slide.type === "image") {
          return (
            <Image height={720} width={960} alt="slide" src={String(slide.imageUrl)}
            className={"z-0 slide rounded-lg relative border-2 border-white m-auto " + (slide.rounded && "rounded-full")} />
          )
        } else {
          return (
            <StoreProvider>              
              <div className="z-0 h-fit w-fit unique-slide m-auto">{uniqueSlides[slide.type]}</div>
            </StoreProvider>
          )
        }
        return <></>
      })()}

      {slideNumber < SlideShow1.length - 1 ? <span onClick={() => (handleSlideChange(1))} className="material-symbols-outlined z-20 right-0 arrow">arrow_forward_ios</span> : ""}
    </main>
  );
}
