import { basename, extname } from "path"
import { isNonNil } from "../../../common/lang/isNonNil"
import { ImageElementData } from "../types/ImageElementData"
import { getStrippedFilename } from "../../../common/lang/string/getStrippedFilename"
import {
  ANIMATION_NAMING_EDGECASES,
  HD_SUFFIX,
  ANIMATABLE_IMAGE_NAMES,
} from "../constants"

export type FrameData = {
  canonical: string
  index: number
}

export type ImageParseData = {
  name: string
  path: string
  frame?: FrameData
}

export type ImageDataFromParse = Omit<ImageElementData, "width" | "height">

/**
 * Returns a frame data if the image is a valid frame
 */
export const getFrameFor = (name: string): FrameData | undefined => {
  const safeName = name.replace(/\-?\d/g, "")

  /**
   * Check if this frame is one of the edgecases
   * where the frame number is not prefixed with a hyphen,
   * we remove the number from the frame so that
   * it'll match the edgecase list
   */
  const isEdgecase = ANIMATION_NAMING_EDGECASES.includes(safeName)
  const isAnimation = ANIMATABLE_IMAGE_NAMES.includes(safeName)

  console.log({ isAnimation, safeName })

  const regex = new RegExp(isEdgecase ? /\d+/ : /-\d+/)
  const match = name.match(regex)

  if (match && isAnimation) {
    const canonical = name.replace(regex, "")

    return {
      canonical,
      index: Number(match[0].replace("-", "")),
    }
  }
}

/**
 * Get the frame elements for an element
 */
export const getFrames = (element: ImageParseData, items: ImageParseData[]) => {
  return items.filter(item => {
    /** Remove the number, so this can match */
    return item.frame && item.frame.canonical === element.name.replace(/\-?\d/g, "")
  })
}

/**
 * Parses the path and attempts to guess what the image is for
 */
export const parseImagePath = (path: string) => {
  const name = getStrippedFilename(path).replace(HD_SUFFIX, "")
  const frame = getFrameFor(name)

  return { name, path, frame }
}

/**
 * Creates the final ImageElement data
 */
export const createDataFromParse = (
  data: ImageParseData,
  others: ImageParseData[],
): ImageDataFromParse | undefined => {
  const { name, path, frame } = data

  /** Get the amount of frames associated with this element */
  const frameCount = getFrames(data, others).length

  /** Include this if it's the first frame and there is not a static variant */
  if (frame) {
    const { canonical, index } = frame
    const hasStatic = others.find(other => other.name === canonical)

    /** Skip this if there's a static, which will be the parent, or if there's not but this is the first frame, which will be the parent. */
    if (hasStatic || index !== 0) return

    return {
      path,
      name: canonical,
      frames: {
        count: frameCount,
        static: false,
      },
    }
  }

  const frames = frameCount ? { count: frameCount, static: true } : undefined

  return {
    name,
    path,
    frames,
  }
}

/**
 * Returns true or false depending on if the element is a redundant non @2x
 */
export const filterScaling = (path: string, _: any, others: string[]) => {
  const ext = extname(path)
  const name = basename(path, ext)

  const isDouble = name.includes(HD_SUFFIX)
  if (isDouble) return true

  return !others.find(other => other.includes(`${name}${HD_SUFFIX}`))
}

export const parseImagePaths = (paths: string[]): ImageDataFromParse[] => {
  const filteredPaths = paths.filter(filterScaling)
  const parsed = filteredPaths.map(parseImagePath)

  return parsed.map(p => createDataFromParse(p, parsed)).filter(isNonNil)
}
