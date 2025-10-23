import clsx from 'clsx'

import { IIconProps } from './types'

const FilledCircleIcon = (props: IIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      className={clsx(props.className)}
      fill='#002047'
      viewBox='0 0 24 24'
    >
      <circle cx='12' cy='12' r='9' />
    </svg>
  )
}

export default FilledCircleIcon
