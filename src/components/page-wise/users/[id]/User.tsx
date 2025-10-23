'use client'

import { Box, Card, CardContent, Grid } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

import CommonNotFound from '@/components/common/CommonNotFound'
import Loader from '@/components/Loader'

import { IRolePermission } from '@/models/rolePermission.model'
import { IUser } from '@/models/user.model'
import { UsersService } from '@/services/client/Users.service'
import { utils } from '@/utils/utils'

import UserDetails from './components/UserDetails'
import UserRelations from './components/UserRelations'

type IUserProps = {
  id: string
}

const User = (props: IUserProps) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<IUser | null>(null)
  const [userModulePermissions, setUserModulePermissions] = useState<IRolePermission['actions']>([])

  // Functions

  const getUser = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const us = new UsersService()
      const response = await us.get(userId)
      setUserModulePermissions(response.userModulePermissions)
      setUser(response)
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

  if (!user) {
    return (
      <Card>
        <CardContent>
          <CommonNotFound description='User not found' withoutImage={true} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <UserDetails user={user} />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <UserRelations user={user} id={props.id} userModulePermissions={userModulePermissions} />
      </Grid>
    </Grid>
  )
}

export default User
