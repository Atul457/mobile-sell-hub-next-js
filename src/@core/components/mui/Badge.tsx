'use client'

// React Imports
import type { BadgeProps } from '@mui/material/Badge'
// MUI Imports
import MuiBadge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'
import React from 'react'

export type CustomBadgeProps = BadgeProps & {
  tonal?: 'true' | 'false'
}

const Badge = styled(MuiBadge)<CustomBadgeProps>(({ tonal, color }) => {
  return {
    '& .MuiBadge-badge.MuiBadge-standard': {
      ...(tonal === 'true' && {
        color: `var(--mui-palette-${color}-main)`,
        backgroundColor: `var(--mui-palette-${color}-lightOpacity)`
      })
    }
  }
})

const CustomBadge = (props: CustomBadgeProps) => <Badge {...props} />

export default CustomBadge
