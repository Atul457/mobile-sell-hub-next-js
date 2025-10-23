'use client'

// MUI Imports
import { Box, Divider, Drawer, Typography } from '@mui/material'
import classNames from 'classnames'
import Link from 'next/link'

// Hook Imports
import CommonButton from '@/components/common/CommonButton'

import { IQrPopulated } from '@/models/qr.model'
import { utils } from '@/utils/utils'

type IQrProps = {
  onClose: Function
  qr: IQrPopulated | null
}

const NUMERIC_STATUS = utils.CONST.QR.NUMERIC_STATUS

const Qr = (props: IQrProps) => {
  const onClose = () => {
    props.onClose()
  }

  const getField = (key: string, value: any, link?: string) => {
    value = utils.helpers.getValue(value)

    return (
      <Typography
        variant='body2'
        sx={{
          color: 'text.primary',
          fontSize: theme => theme.typography.body2.fontSize,
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography
          variant='inherit'
          sx={{
            color: 'text.primary',
            fontSize: theme => theme.typography.body2.fontSize,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600
          }}
        >
          {key}:&nbsp;
        </Typography>
        {link ? (
          <Link href={link}>
            <Typography
              variant='body2'
              sx={{
                color: 'text.primary',
                fontSize: theme => theme.typography.body2.fontSize,
                height: '100%',
                display: 'flex',
                fontWeight: 500,
                alignItems: 'center'
              }}
              className='custom-link hyperlink'
            >
              {value}
            </Typography>
          </Link>
        ) : (
          utils.helpers.getValue(value)
        )}
      </Typography>
    )
  }

  return (
    <Drawer
      anchor='right'
      open={Boolean(props.qr)}
      onClose={onClose}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true
      }}
      className={classNames('block', { static: !props.qr, absolute: Boolean(props.qr) })}
      PaperProps={{
        className: classNames('is-[400px] shadow-none rounded-s-[6px]', {
          static: false
        })
      }}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        },
        '& .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute'
        }
      }}
    >
      <form noValidate autoComplete='off' className='w-full'>
        <Box
          sx={{
            paddingInline: 6,
            paddingBlock: 5
          }}
          className='is-full p-6'
        >
          <Typography variant='h6'>Qr Details</Typography>
        </Box>

        <Divider className='is-full' />

        <div className='is-full p-6 flex flex-col gap-1'>
          {getField('Qr code', props.qr?.qrCode)}
          {getField('Status', props.qr ? NUMERIC_STATUS[props.qr.status] : null)}
          {getField('Used At', props.qr?.usedAt ? utils.date.formatDate(props.qr.usedAt) : null)}
          {getField(
            'Used By',
            props.qr?.usedBy ? utils.helpers.user.getFullName(props.qr.usedBy) : null,
            props.qr?.usedBy ? `/users/${props.qr?.usedBy?._id}` : undefined
          )}
          {getField('Created At', props.qr ? utils.date.formatDate((props.qr as any).createdAt) : null)}
        </div>
      </form>

      <div className='is-full p-6 flex flex-col space-y-2 webkit-bottom'>
        <CommonButton label='Close' fullWidth variant='contained' onClick={onClose} />
      </div>
    </Drawer>
  )
}

export default Qr
