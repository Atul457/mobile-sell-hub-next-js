import clsx from 'clsx'

import { IIconProps } from './types'

const PauseIcon = (props: IIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      className={clsx(props.className)}
      fill='#fff'
      viewBox='0 0 24 24'
    >
      <path fill='none' d='M0 0h24v24H0z'></path>
      <path d='M9 4H7a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V6a2 2 0 00-2-2zM17 4h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V6a2 2 0 00-2-2z'></path>
    </svg>
  )
}

export default PauseIcon
