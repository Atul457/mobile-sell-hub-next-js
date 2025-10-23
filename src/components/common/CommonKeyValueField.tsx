import { Box, BoxProps, Typography, TypographyProps } from '@mui/material'
import Link from 'next/link'
import { PropsWithChildren, ReactNode } from 'react'

import { utils } from '@/utils/utils'

export type ICommonKeyValueField = {
  containerProps?: BoxProps
  key_: string | ReactNode
  boldKey?: boolean
  keyProps?: TypographyProps
  valueProps?: TypographyProps
  value?: string | number | null | ReactNode
  withoutValue?: boolean
  link?: {
    href: string
    target?: string
  }
}

type IWrapperProps = {
  haveValue?: boolean
  containerProps: ICommonKeyValueField['containerProps']
} & PropsWithChildren

const Wrapper = (props: IWrapperProps) => {
  const Children = (
    <Typography
      component='div'
      variant='body2'
      sx={{
        color: 'text.primary',
        fontSize: theme => theme.typography.body2.fontSize,
        display: 'flex'
      }}
    >
      {props.children}
    </Typography>
  )

  if (props.haveValue === false) {
    return Children
  }

  return <Box {...props.containerProps}>{Children}</Box>
}

const CommonKeyValueField = (props: ICommonKeyValueField) => {
  const { key_, link, containerProps, withoutValue, boldKey, valueProps, ...rest } = props
  const value = utils.helpers.getValue(rest.value)

  const Key = (
    <Typography
      component='div'
      variant='inherit'
      {...props.keyProps}
      sx={{
        color: 'inherit',
        fontSize: 'inherit',
        fontWeight: boldKey === false ? 400 : 500,
        display: 'inline-block',
        ...props.keyProps?.sx
      }}
    >
      {key_}
      {withoutValue ? null : <>:&nbsp;</>}
    </Typography>
  )

  if (withoutValue) {
    return (
      <Wrapper haveValue={false} containerProps={containerProps}>
        {Key}
      </Wrapper>
    )
  }

  return (
    <Wrapper containerProps={containerProps}>
      {Key}
      <Typography
        component='div'
        variant='body2'
        {...valueProps}
        sx={{
          color: 'text.primary',
          fontSize: theme => theme.typography.body2.fontSize,
          display: 'inline-block',
          ...valueProps?.sx
        }}
      >
        {link ? (
          <Link href={link.href} target={link.target} className='custom-link hyperlink'>
            {utils.helpers.getValue(value)}
          </Link>
        ) : Array.isArray(value) ? (
          <Box
            component='ul'
            sx={{
              paddingInlineStart: 4
            }}
          >
            {value.map(currentValue => {
              return <li key={currentValue}>{utils.helpers.getValue(currentValue)}</li>
            })}
          </Box>
        ) : (
          utils.helpers.getValue(value)
        )}
      </Typography>
    </Wrapper>
  )
}

export default CommonKeyValueField
