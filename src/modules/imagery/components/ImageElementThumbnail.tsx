import { useObserver } from "mobx-react-lite"
import React from "react"
import { ImageElement } from "../classes/ImageElement"
import { ImagePreview } from "./ImagePreview"

export type ImageElementThumbnailProps = {
  element: ImageElement
  className?: string
}

export function ImageElementThumbnail(props: ImageElementThumbnailProps) {
  const { element, className } = props

  const getAnimation = () => {
    const { frames, width } = element.data
    if (!frames) return

    return {
      count: frames.count,
      width: frames.count * width,
    }
  }

  return useObserver(() => (
    <ImagePreview
      className={className}
      src={element.preview}
      animation={getAnimation()}
    />
  ))
}
