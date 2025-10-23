'use client'

import { Box, Card, CardContent, Grid } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

import CommonNotFound from '@/components/common/CommonNotFound'
import Loader from '@/components/Loader'

import { IProfile } from '@/models/profile.model'
import { ProfileService } from '@/services/client/Profile.service'
// import { UsersService } from '@/services/client/Users.service'
import { utils } from '@/utils/utils'

import ViewProfileDetails from './components/ViewProfileDetails'
import ViewProfileRelations from './components/ViewProfileRelations'



type IUserProps = {
    id: string
}

const ViewProfile = (props: IUserProps) => {
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<IProfile | null>(null)

    // Functions

    const getUser = useCallback(async (userId: string) => {
        setLoading(true)
        try {
            const ps = new ProfileService()
            // ProfileService
            const response = await ps.getProfile(userId)
            setProfile(response)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            utils.toast.error({ message: utils.error.getMessage(error) })
        }
    }, [])

    useEffect(() => {
        if (props.id) {
            getUser(props.id)
        }
    }, [props.id, getUser])

    if (loading)
        return (
            <Box className='min-h-[300px] flex items-center justify-center'>
                <Loader size='md' />
            </Box>
        )

    if (!profile) {
        return (
            <Card>
                <CardContent>
                    <CommonNotFound description='Profile not found' withoutImage={true} />
                </CardContent>
            </Card>
        )
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12} lg={4} md={5}>
                <ViewProfileDetails profile={profile} />
            </Grid>
            <Grid item xs={12} lg={8} md={7}>
                {/* <UserRelations user={user} id={props.id} userModulePermissions={userModulePermissions} /> */}
                <ViewProfileRelations id={props.id} />
            </Grid>
        </Grid>
    )
}

export default ViewProfile
