'use client'

import { Chip, ChipProps, Theme } from '@mui/material'

import themeConfig from '@/configs/themeConfig'

export type ICommonChipProps = Omit<ChipProps, 'variant'> & {
  label: ChipProps['label']
  variant: 'error' | 'success' | 'primary' | 'yellow' | 'amber' | 'cyan'
}

const CommonChip = (props: ICommonChipProps) => {
  const { variant, size = 'small', ...rest } = props

  const getBg = (theme: Theme) => {
    return theme.colorSchemes.light.palette.customColors[`${variant}Light`]
  }

  const getColor = (theme: Theme) => {
    return theme.colorSchemes.light.palette.customColors[variant]
  }

  return (
    <Chip
      size={size}
      {...rest}
      sx={{
        color: getColor,
        background: getBg,
        fontSize: theme => theme.typography.subtitle2.fontSize,
        borderRadius: `${themeConfig.containerRadius / 3}px`
      }}
    />
  )
}

export default CommonChip
