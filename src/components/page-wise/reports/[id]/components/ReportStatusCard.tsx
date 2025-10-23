import { Box, Typography } from '@mui/material'
import clsx from 'clsx'
import { ReactNode } from 'react'

import FilledCircleIcon from '@/components/icons/FilledCircle'
import HollowCircleIcon from '@/components/icons/HollowCircle'

import { useModal } from '@/contexts/ModalProvider'
import { IChainOfCustody } from '@/models/custody.model'
import { utils } from '@/utils/utils'

type IStatusCardProps = {
  chainOfCustody?: IChainOfCustody
  status?: string
  complete: boolean
  reportId?: string
  cursor?: 'pointer' | 'default' | null
  index?: number
  push?: (data: any) => void
  date?: Date
  preventClick?: boolean
  description?: string | null | ReactNode
}

const StatusCard = (props: IStatusCardProps) => {
  const date = props.chainOfCustody ? props.chainOfCustody?.date : props.date
  const modalContext = useModal()

  const addCustodyModal = () => {
    if (props.preventClick) return
    modalContext.openModal({
      type: 'addCustody',
      props: {
        visible: true,
        editable: false,
        reportId: props?.reportId ?? '',
        custodyData: props.chainOfCustody
      }
    })
  }

  return (
    <Box
      onClick={() => addCustodyModal()}
      className={clsx('before-dashed-border', props.complete && 'opac')}
      sx={{
        pointerEvents: props?.cursor === null ? undefined : props?.cursor === 'pointer' ? 'auto' : 'none',
        cursor: props?.cursor === null ? undefined : props.cursor ?? 'default',
        opacity: props.complete ? 0.4 : 1,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          paddingTop: '22px',
          marginLeft: '-20px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {props.complete ? (
              <FilledCircleIcon className='mr-2 w-[15px]' />
            ) : (
              <HollowCircleIcon className='mr-2 w-[13px] fill-white' />
            )}

            <Typography
              color='primary.main'
              fontWeight={600}
              variant='body2'
              sx={{
                fontSize: theme => theme.typography.body2.fontSize
              }}
            >
              {props.chainOfCustody?.name ?? props.status}
            </Typography>
          </Box>

          {date ? (
            <Typography
              sx={{
                fontStyle: 'italic',
                fontSize: theme => theme.typography.subtitle2?.fontSize
              }}
              variant='subtitle1'
              color='primary.main'
            >
              {utils.date.formatDate(new Date(date))}
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Typography
        component='div'
        variant='subtitle2'
        sx={{
          color: 'customColors.textGray100',
          fontSize: theme => theme.typography.subtitle2.fontSize,
          display: 'flex',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}
      >
        {props?.description ??
          props.chainOfCustody?.description ??
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
      </Typography>
    </Box>
  )
}

export default StatusCard
