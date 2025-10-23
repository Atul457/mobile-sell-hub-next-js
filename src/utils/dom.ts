import { ChangeEvent } from 'react'

import { number } from './number'

type IOnNumberTypeFieldChangeOptions = {
  maxLength?: number
  min?: number
  max?: number
  dontReturnBlank?: boolean
}

type IGetCameraMessage = {
  hasDevices: boolean | 'loading'
  hasCameraPermission: PermissionState | 'loading'
}

async function checkCameraPermission() {
  let permissionStatus_: PermissionStatus['state'] = 'prompt'

  try {
    const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName })

    permissionStatus_ = permissionStatus.state

    if (permissionStatus.state === 'granted') {
      console.debug('Camera access granted.')
    } else if (permissionStatus.state === 'prompt') {
      console.debug('Camera access requires permission.')
    } else if (permissionStatus.state === 'denied') {
      console.debug('Camera access denied.')
    }
    return permissionStatus_
  } catch (error) {
    console.error('Permission API not supported or an error occurred:', error)
    return { permissionStatus_ }
  }
}

const checkCameras = async () => {
  let hasDevices = false
  let hasRearCamera = false
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoInputs = devices.filter(device => device.kind === 'videoinput')
    hasDevices = videoInputs.length > 0
    hasRearCamera = videoInputs.length > 1
    return { hasDevices, hasRearCamera }
  } catch (error) {
    console.error('Error accessing media devices:', error)
    return { hasDevices, hasRearCamera }
  }
}

const isEnterPressed = (event: any) => {
  return event?.key === 'Enter' || event?.keyCode === 13
}

const isWindowPresent = () => {
  return typeof window !== 'undefined'
}

const getSupportedMimeType = () => {
  if (!isWindowPresent()) return 'video/webm'
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  if (isIOS) {
    return 'video/mp4'
  } else {
    return 'video/webm'
  }
}

const getCameraMessage = (props: IGetCameraMessage) => {
  if (props.hasDevices === 'loading') {
    return 'Loading camera...'
  }

  if (props.hasDevices === false) {
    return 'No camera detected.'
  }

  if (props.hasCameraPermission === 'granted') {
    return null
  }

  if (props.hasCameraPermission === 'denied') {
    return 'Camera access denied. Please grant permission in settings.'
  }

  return 'No camera access. Please grant permission in settings.'
}

const getNumberFieldValue = (value: number) => {
  return value === 0 ? '' : value.toString()
}

const onNumberTypeFieldChange = (e: ChangeEvent<any>, options?: IOnNumberTypeFieldChangeOptions) => {
  let value: any = e.target.value
  if (options?.maxLength && value?.length > options?.maxLength) {
    value = value.slice(0, options.maxLength)
  }
  value = number.convertToNumber(value)
  if (options?.min && value < options.min) {
    value = options.min
  } else if (options?.max && value > options.max) {
    value = options.max
  }

  value = getNumberFieldValue(value)

  if (options?.dontReturnBlank) {
    value = !value ? 0 : value
  }

  e.target.value = value
}

const onNumberTypeFieldChangeWithoutE = (value: any, options?: IOnNumberTypeFieldChangeOptions) => {
  value = value.replace(/[^0-9]/g, '')
  if (options?.maxLength && value?.length > options?.maxLength) {
    value = value.slice(0, options.maxLength)
  }
  value = number.convertToNumber(value)
  if (typeof options?.min !== 'undefined' && value < options.min) {
    value = options.min
  } else if (typeof options?.max !== 'undefined' && value > options.max) {
    value = options.max
  }
  value = getNumberFieldValue(value)

  if (options?.dontReturnBlank) {
    value = !value ? 0 : value
  }
  return value
}

const onModalClose = () => {
  document.body.style.overflow = 'unset'
}

const onModalOpen = () => {
  if (isWindowPresent()) {
    document.body.style.overflow = 'hidden'
  }
}

const dom = {
  onModalClose,
  onModalOpen,
  getSupportedMimeType,
  getCameraMessage,
  checkCameraPermission,
  onNumberTypeFieldChangeWithoutE,
  onNumberTypeFieldChange,
  getNumberFieldValue,
  isEnterPressed,
  isWindowPresent,
  checkCameras
}

export { dom }
