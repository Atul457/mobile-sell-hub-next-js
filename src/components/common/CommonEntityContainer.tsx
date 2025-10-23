import { BoxProps, Card, CardContent, CardContentProps, CardHeader, CardHeaderProps } from '@mui/material'
import React, { PropsWithChildren } from 'react'

import { ICommonChipProps } from './CommonChip'

type ICommonEntityContainerProps = {
  containerProps?: BoxProps
  chip?: {
    label: string
    variant: ICommonChipProps['variant']
  }
  title?: string | React.ReactNode
  contentProps?: CardContentProps
  titleTypographyProps?: CardHeaderProps['titleTypographyProps']
} & PropsWithChildren

const CommonEntityContainer = (props: ICommonEntityContainerProps) => {
  return (
    <Card>
      <CardHeader
        title={props.title}
        titleTypographyProps={{
          ...props.titleTypographyProps,
          ...(typeof props.title !== 'string' && {
            display: 'flex',
            alignContent: 'center',
            flexWrap: 'wrap',
            columnGap: 2,
            ...props.titleTypographyProps
          })
        }}
      />
      <CardContent {...props.contentProps}>{props.children}</CardContent>
    </Card>
  )
}

export default CommonEntityContainer
