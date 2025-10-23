'use client'

// MUI Imports
// import CustomAvatar from '@core/components/mui/Avatar'
import { Grid } from '@mui/material'

// Component Imports
import CommonEntityContainer from '@/components/common/CommonEntityContainer'
import CommonKeyValueField, { ICommonKeyValueField } from '@/components/common/CommonKeyValueField'

import { IProfile } from '@/models/profile.model'
import { utils } from '@/utils/utils'

const NUMERIC_GENDER_TYPES = utils.CONST.USER.NUMERIC_GENDER_TYPES

type IViewProfileDetailsProps = {
    profile: IProfile
}

const ViewProfileDetails = (props: IViewProfileDetailsProps) => {
    const { profile } = props

    // const userName = user ? utils.helpers.user.getFullName(user) : 'User name'
    // const STORAGE_PATH = utils.CONST.APP_CONST.CONFIG.STORAGE_PATH
    // const profilePicture = user?.profilePicture ? `${STORAGE_PATH}${user.profilePicture}` : undefined

    // const initials = !profilePicture
    //     ? userName
    //         .split(' ')
    //         .splice(0, 2)
    //         .map(name => name[0]?.toUpperCase())
    //         .join('')
    //     : undefined

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
                    title='Examinee Details'
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
                                    {/* <CustomAvatar alt={userName} src={profilePicture} variant='rounded' size={120}>
                                        {initials}
                                    </CustomAvatar> */}
                                    {/* <Typography variant='h5'>{utils.helpers.user.getFullName(profile)}</Typography> */}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='flex flex-col gap-2'>
                                <CommonKeyValueField key_='Name' {...keyProps} value={utils.helpers.user.getFullName(profile)} />
                                <CommonKeyValueField key_='Email' {...keyProps} value={profile.email} />

                                <CommonKeyValueField
                                    key_='Phone No'
                                    {...keyProps}
                                    value={utils.number.formatNumber(utils.helpers.getValue(profile?.phoneNumber))?.toString()}
                                />

                                <CommonKeyValueField
                                    {...keyProps}
                                    key_='Gender'
                                    value={utils.helpers.getValue(
                                        NUMERIC_GENDER_TYPES?.[profile.gender as Exclude<IProfile['gender'], undefined>]
                                    )}
                                />

                                <CommonKeyValueField
                                    {...keyProps}
                                    key_='Date of Birth'
                                    value={utils.date.formatDate(profile?.dob)?.toString()}
                                />

                                <CommonKeyValueField key_='No. of reports' {...keyProps} value='N/A' />



                            </div>
                        </div>
                    </>
                </CommonEntityContainer>
            </Grid>
        </Grid>
    )
}

export default ViewProfileDetails
