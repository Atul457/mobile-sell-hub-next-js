import clsx from 'clsx'

import { IIconProps } from './types'

const PlusIcon = (props: IIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={props.width ?? '19'}
      height={props.height ?? '19'}
      fill='none'
      viewBox='0 0 19 19'
      className={clsx(props.className)}
    >
      <g stroke='#002047' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.217' clipPath='url(#clip0_125_2)'>
        <path d='M9.5 2.783v13.435M2.783 9.5h13.435'></path>
      </g>
      <defs>
        <clipPath id='clip0_125_2'>
          <path fill='#fff' d='M0 0H19V19H0z'></path>
        </clipPath>
      </defs>
    </svg>
  )
}

export default PlusIcon
