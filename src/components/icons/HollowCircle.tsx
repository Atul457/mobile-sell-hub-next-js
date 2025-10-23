import clsx from 'clsx'

import { IIconProps } from './types'

const HollowCircleIcon = (props: IIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      className={clsx(props.className)}
      fill='none'
      stroke='#002047'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='4.5'
      viewBox='0 0 24 24'
    >
      <path stroke='none' d='M0 0h24v24H0z'></path>
      <path d='M3 12a9 9 0 1018 0 9 9 0 10-18 0'></path>
    </svg>
  )
}

export default HollowCircleIcon
