'use client'

// React Imports
// Next Imports
import NextLink from 'next/link'
import type { ComponentProps, MouseEvent } from 'react'

type Props = Omit<ComponentProps<typeof NextLink>, 'href' | 'onClick'> & {
  href?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

const Link = (props: Props) => {
  // Props
  const { href, onClick, ...rest } = props

  return (
    <NextLink
      {...rest}
      href={href || '/'}
      onClick={onClick ? e => onClick(e) : !href ? e => e.preventDefault() : undefined}
    />
  )
}

export default Link
