import Image from "next/image";

import { SlideShow1 } from "@/slides.json"

import DynamicSlides from "@/components/DynamicSlide"
import FaceDetectionWebcam from "@/components/FaceDetectionWebcam"
import ImageArrayDisplay from "@/components/ImageArrayDisplay"
import PartiallyTransformedImage from "@/components/PartiallyTransformedImage"
import ProcessedImage from "@/components/ProcessedImage"
import SampleImage from "@/components/SampleImage"

import { useState } from "react";

export default function Home() {
  const [slideNumber, setSlideNumber] = useState(0)

  const types = ["peopleCam", "sampleImage", "slideWithDynamicImage", "imageArray", "partiallyTransformedImage"]
  const uniqueSlides = {
    [types[0]]: <FaceDetectionWebcam />,
    [types[1]]: <SampleImage />,
    [types[2]]: <DynamicSlides />,
    [types[3]]: <ImageArrayDisplay />,
    [types[4]]: <ProcessedImage />,
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <span></span>
    </main>
  );
}
