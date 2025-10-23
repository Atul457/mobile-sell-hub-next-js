'use client'

// React Imports
// Config Imports
// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
// Component Imports
import VuexyLogo from '@core/svg/Logo'
// Third-party Imports
// Type Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
// Next Imports
// import Img from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const Logo = () => {
  // Refs
  const logoTextRef = useRef<HTMLSpanElement>(null)

  // Hooks
  const { isHovered } = useVerticalNav()
  const { settings } = useSettings()

  // Vars
  const { layout } = settings

  useEffect(() => {
    if (layout !== 'collapsed') {
      return
    }

    if (logoTextRef && logoTextRef.current) {
      if (layout === 'collapsed' && !isHovered) {
        logoTextRef.current?.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout])

  // You may return any JSX here to display a logo in the sidebar header
  // return <Img src='/next.svg' width={100} height={25} alt='logo' /> // for example
  return (
    // text-primary
    <Link href='/' className='flex justify-center w-full md:my-3'>
      <VuexyLogo className='text-2xl ' />
    </Link>
  )
}

export default Logo
