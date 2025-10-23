import { createAsyncThunk } from '@reduxjs/toolkit'

import { IUser } from '@/store/types'

import { UserService } from '@/services/client/User.service'
import { utils } from '@/utils/utils'

const get = createAsyncThunk('getUser', async (_, thunkApi) => {
  try {
    const us = new UserService()
    const user = await us.get()
    return user as IUser
  } catch (error: any) {
    return thunkApi.rejectWithValue({
      message: error?.message ?? utils.CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG
    })
  }
})

const userThunks = {
  get
}

export { userThunks }
