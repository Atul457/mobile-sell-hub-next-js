import LoadingButton from '@mui/lab/LoadingButton'
import { ButtonProps, styled, SxProps, Theme } from '@mui/material'
import clsx from 'clsx'
import { ButtonHTMLAttributes } from 'react'

import Loader from '../Loader'

type ICommonButtonProps = {
  label: string
  type?: ButtonHTMLAttributes<any>['type']
  sx?: SxProps<Theme>
  loading?: boolean
  btnVariant?: 'white'
} & ButtonProps

const CustomButton = styled(LoadingButton)(() => ({
  '&.Mui-disabled': {
    color: '#fff',
    opacity: 0.5
  }
}))

const CommonButton = (props: ICommonButtonProps) => {
  const { loading, btnVariant = 'primary', ...rest } = props

  return (
    <CustomButton
      fullWidth
      disabled={loading}
      loading={loading}
      onClick={props.onClick}
      variant='contained'
      type={props.type ?? 'submit'}
      {...rest}
      className={clsx(props.className, 'custom-btn-transition', `variant-${btnVariant}`)}
      sx={{
        borderRadius: 30,
        padding: props.size === 'small' ? 2 : { xs: 3, md: 4 },
        ...(props.size !== 'small' && {
          minHeight: `46px`
        }),
        maxWidth: 350,
        margin: 'auto',
        color: props.btnVariant === 'white' ? 'primary.main' : 'white',
        background: `${props.btnVariant === 'white' ? 'white' : 'primary.main'} !important`,
        ...(props?.sx ?? {})
      }}
    >
      {props.loading ? <Loader size='sm' bgVariant={props.color === 'error' ? 'error' : 'primary'} /> : props.label}
    </CustomButton>
  )
}

export default CommonButton
