import { Box, BoxProps, Typography, TypographyProps } from '@mui/material'
import clsx from 'clsx'

import NotFound from '../icons/NotFound'
import { IIconProps } from '../icons/types'

type ICommonNotFoundProps = {
  description?: string
  isModal?: boolean
  withoutImage?: boolean
  descriptionProps?: TypographyProps
  containerProps?: BoxProps
  image?: (props: IIconProps) => JSX.Element
  imageContainerProps?: BoxProps
}

const CommonNotFound = (props: ICommonNotFoundProps) => {
  return (
    <Box
      {...props.containerProps}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxBlockSize: '600px',
        height: props.withoutImage ? 'fit-content' : props.isModal ? '40vh' : '70vh',
        marginTop: props.withoutImage
          ? 0
          : {
              xs: props.isModal ? 8 : 0,
              lg: props.isModal ? 3 : 0
            },
        ...props.containerProps?.sx
      }}
    >
      {!props.withoutImage ? (
        <Box
          {...props.imageContainerProps}
          sx={{
            maxWidth: {
              lg: props.isModal ? '90px' : '130px'
            },
            minHeight: props.isModal ? 150 : 260,
            width: '100%',
            flexDirection: 'column',
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginInline: 'auto',
            ...props.imageContainerProps?.sx
          }}
        >
          {props.image ? (
            props.image({
              className: clsx(props.isModal ? 'max-lg:w-[120px]' : 'max-lg:w-[140px]', 'lg:w-full h-full')
            })
          ) : (
            <NotFound className={clsx(props.isModal ? 'max-lg:w-[120px]' : 'max-lg:w-[140px]', 'lg:w-full h-full')} />
          )}
        </Box>
      ) : null}
      <Typography
        variant='h6'
        {...props.descriptionProps}
        sx={{
          maxWidth: 300,
          marginInline: 'auto',
          fontSize: {
            xs: props.isModal ? 12 : props.withoutImage ? 12 : 15,
            lg: props.isModal ? 14 : props.withoutImage ? 14 : 17
          },
          color: 'subTitle.mob',
          fontWeight: 500,
          marginTop: props.withoutImage ? 0 : 2,
          textAlign: 'center',
          ...props.descriptionProps?.sx
        }}
      >
        {props.description}
      </Typography>
    </Box>
  )
}

export default CommonNotFound
