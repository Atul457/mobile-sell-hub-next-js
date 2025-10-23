'use client'

// MUI Imports
import CustomAvatar from '@core/components/mui/Avatar'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'

// Component Imports
import CommonChip from '@/components/common/CommonChip'
import CommonEntityContainer from '@/components/common/CommonEntityContainer'
import CommonKeyValueField, { ICommonKeyValueField } from '@/components/common/CommonKeyValueField'

import { IUser } from '@/models/user.model'
import { utils } from '@/utils/utils'

const NUMERIC_TYPES = utils.CONST.USER.NUMERIC_TYPES
const NUMERIC_STATUS = utils.CONST.USER.NUMERIC_STATUS
// const NUMERIC_ROLE_TYPES = utils.CONST.USER.NUMERIC_ROLE_TYPES
const NUMERIC_DESIGNATION_TYPES = utils.CONST.USER.NUMERIC_DESIGNATION_TYPES

type IUserDetailsProps = {
  user: IUser
}

const UserDetails = (props: IUserDetailsProps) => {
  const { user } = props

  const userName = user ? utils.helpers.user.getFullName(user) : 'User name'
  const STORAGE_PATH = utils.CONST.APP_CONST.CONFIG.STORAGE_PATH
  const profilePicture = user?.profilePicture ? `${STORAGE_PATH}${user.profilePicture}` : undefined

  const initials = !profilePicture
    ? userName
        .split(' ')
        .splice(0, 2)
        .map(name => name[0]?.toUpperCase())
        .join('')
    : undefined

  const keyProps: Partial<ICommonKeyValueField> = {
    keyProps: {
      sx: {
        minWidth: '40%'
      }
    },
    valueProps: {
      sx: {
        wordBreak: 'break-word',
        maxWidth: '70%'
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CommonEntityContainer
          title='User Details'
          titleTypographyProps={{
            sx: {
              textAlign: 'center'
            }
          }}
          contentProps={{
            sx: {
              display: 'flex',
              flexDirection: 'column',
              rowGap: 4
            }
          }}
        >
          <>
            <div className='flex flex-col gap-6'>
              <div className='flex items-center justify-center flex-col gap-4'>
                <div className='flex flex-col items-center gap-4'>
                  <CustomAvatar alt={userName} src={profilePicture} variant='rounded' size={120}>
                    {initials}
                  </CustomAvatar>
                  <Typography variant='h5'>{utils.helpers.user.getFullName(user)}</Typography>
                </div>
                <CommonChip label={NUMERIC_TYPES[user.type]} variant='primary' />
              </div>
            </div>
            <div>
              <div className='flex flex-col gap-2'>
                <CommonKeyValueField key_='Email' {...keyProps} value={user.email} />

                <CommonKeyValueField
                  key_='Phone No'
                  {...keyProps}
                  value={utils.number.formatNumber(utils.helpers.getValue(user?.phoneNumber))?.toString()}
                />

                {utils.helpers.user.checkIsOrganiation(user.type) ? (
                  <>
                    <CommonKeyValueField {...keyProps} key_='Organization' value={user.organizationName} />

                    <CommonKeyValueField
                      key_='Designation'
                      {...keyProps}
                      value={
                        NUMERIC_DESIGNATION_TYPES[
                          utils.helpers.getValue(user.designation) as Exclude<IUser['designation'], undefined>
                        ]
                      }
                    />

                    {/* {typeof user.role === 'number' ? (
                      <CommonKeyValueField
                        key_='Role'
                        {...keyProps}
                        value={
                          NUMERIC_ROLE_TYPES[
                          utils.helpers.getValue(user.role) as Exclude<IUser['designation'], undefined>
                          ]
                        }
                      />
                    ) : null} */}
                  </>
                ) : null}

                <CommonKeyValueField {...keyProps} key_='Address' value={user.address} />

                <CommonKeyValueField
                  {...keyProps}
                  key_='Status'
                  value={
                    <CommonChip
                      variant={utils.helpers.user.getUserStatusVariant(user.status)}
                      label={utils.string.capitalizeFirstLetter(NUMERIC_STATUS[user.status])}
                      sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
                    />
                  }
                />
              </div>
            </div>
          </>
        </CommonEntityContainer>
      </Grid>
    </Grid>
  )
}

export default UserDetails
