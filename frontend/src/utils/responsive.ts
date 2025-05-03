import { Dimensions, PixelRatio, Platform } from "react-native"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// Base dimensions for standard mobile device (iPhone 11)
const baseWidth = 375
const baseHeight = 812

// Scales
const widthScale = SCREEN_WIDTH / baseWidth
const heightScale = SCREEN_HEIGHT / baseHeight

export const isTablet = () => {
  const { width, height } = Dimensions.get("window")
  const aspectRatio = height / width

  return (Platform.OS === "ios" && aspectRatio < 1.6) || (Platform.OS === "android" && aspectRatio < 1.6)
}

export const scale = (size: number) => {
  return Math.round(size * widthScale)
}

export const verticalScale = (size: number) => {
  return Math.round(size * heightScale)
}

export const moderateScale = (size: number, factor = 0.5) => {
  return Math.round(size + (scale(size) - size) * factor)
}

export const fontScale = (size: number) => {
  const newSize = size * widthScale
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export const getResponsiveValue = (phone: any, tablet: any) => {
  return isTablet() ? tablet : phone
}

export const getResponsiveFontSize = (size: number) => {
  return isTablet() ? size * 1.25 : size
}

export const getResponsiveSpacing = (size: number) => {
  return isTablet() ? size * 1.5 : size
}
