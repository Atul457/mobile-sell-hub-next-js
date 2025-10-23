'use client'

import { Avatar } from '@mui/material'
import { useState } from 'react'

import { utils } from '@/utils/utils'

export interface ICommonImageProps {
  initials?: string
  src: string | null
  alt?: string
  onClick?: Function
  width: number
  height: number
  className?: string
  crossOrigin?: string
  load?: boolean
  fill?: any
  priority?: boolean
  showLoader?: boolean
}

const SkeletonLoader = ({ className }: { className?: string }) => (
  <div
    role='status'
    className={`h-full w-full animate-pulse space-y-8 md:flex md:items-center md:space-x-8 md:space-y-0 rtl:space-x-reverse ${className} overflow-hidden`}
  >
    <div className='flex h-full w-full items-center justify-center bg-gray-300 dark:bg-gray-700'></div>
  </div>
)

const CommonImage = (props: ICommonImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [errorOccurred, setErrorOccured] = useState(false)

  const showLoader = props.load ? props.load : false

  const handleOnLoad = () => {
    setIsLoaded(true)
  }

  const onError = () => {
    setErrorOccured(!!props.initials)
  }

  return (
    <>
      {!isLoaded && (showLoader || props.showLoader) && <SkeletonLoader className={props.className} />}

      {!props.showLoader &&
        (!errorOccurred && props.src !== null ? (
          <img
            alt={props.alt ?? 'something'}
            onLoad={handleOnLoad}
            src={props.src!}
            onClick={props.onClick as any}
            width={props.width}
            height={props.height}
            className={isLoaded || !showLoader ? props.className : 'h-0 w-0'}
            {...(props.fill ? { fill: true, quality: 100 } : {})}
            {...(props.priority ? { priority: 'high' } : {})}
            onError={e => {
              if ((e?.target as HTMLImageElement)?.src) {
                ;(e.target as HTMLImageElement).src = utils.CONST.APP_CONST.PLACEHOLDER_IMAGE
              }
              onError()
            }}
          />
        ) : (
          <Avatar className={props.className}>{props.initials}</Avatar>
        ))}
    </>
  )
}

export default CommonImage
